import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../controllers/TokenController';

const axiosInstance = axios.create({
    baseURL: 'https://repertorify.onrender.com/api',
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            toast.error("Unauthorized Access"); 
        }if(error.response && error.response.status === 403) {
            toast.error("Forbidden Access");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
