import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/',
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            toast.error("Unauthorized, redirecting to login...");
            
            const navigate = useNavigate();
            navigate('/login');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
