import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = 'https://repertorify.com/api'; 
// const baseURL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken) => {
    refreshSubscribers.forEach(callback => callback(newToken));
    refreshSubscribers = [];
};

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const { data } = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
                    if (!data.success) throw new Error("Failed to refresh token");

                    const newToken = data.accessToken;
                    localStorage.setItem("token", newToken);
                    console.log("new token", newToken);
                    onTokenRefreshed(newToken);
                } catch (err) {
                    localStorage.removeItem("token");
                    localStorage.clear("persist:root");
                    try{
                      const response = await axios.post(`${baseURL}/logout`)
                      console.log(response)
                    }catch(err){
                      console.log(err)
                    }
                } finally {
                    isRefreshing = false;
                }
            }

            return new Promise((resolve) => {
                subscribeTokenRefresh((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    resolve(axiosInstance(originalRequest));
                });
            });
        }

        if (error.response?.status === 403) {
            if(error.response?.data?.message) {
                toast.error(error.response.data.message)
            }
            else{
                toast.error("Forbidden Access")
            }
        }

        if (error.response?.status === 404) {
            //redirect to 404 page
            console.log(error.response);
            // window.location.href = "/404";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
