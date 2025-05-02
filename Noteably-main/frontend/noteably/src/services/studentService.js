import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// 🔧 Utility: Get fallback or full image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/ASSETS/Profile_blue.png';
    if (imagePath.startsWith('/ASSETS/') || imagePath.startsWith('http')) {
        return imagePath;
    }
    console.log('Profile picture path:', imagePath);
    return '/ASSETS/Profile_blue.png';
};

// 🔐 Token utility
export const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') {
        console.warn('Invalid token found in localStorage:', token);
        return null;
    }
    return token;
};

// 🔄 Create Axios instance
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// ✅ Interceptor: Add Authorization header to protected routes only
axiosInstance.interceptors.request.use(
    (config) => {
        const publicEndpoints = ['/students/register', '/students/login'];
        const isPublic = publicEndpoints.some((endpoint) =>
            config.url?.includes(endpoint)
        );

        if (!isPublic) {
            const token = getAuthToken();
            console.log('Axios Interceptor: token from localStorage:', token);
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
                console.log('Axios Interceptor: Authorization header set');
            } else {
                delete config.headers['Authorization'];
                console.log('Axios Interceptor: Authorization header deleted');
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 📌 Auth-Free Endpoints (Public)
export const addStudent = async (studentData) => {
    try {
        const response = await axiosInstance.post(`/students/register`, studentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginStudent = async (credentials) => {
    try {
        const response = await axiosInstance.post(`/students/login`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ✅ Authenticated API Calls
export const getStudentById = async (id) => {
    try {
        const response = await axiosInstance.get(`/students/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getStudentByStudentId = async (studentId) => {
    try {
        const response = await axiosInstance.get(`/students/find/${studentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateStudent = async (id, studentData) => {
    try {
        const response = await axiosInstance.put(`/students/${id}`, studentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const uploadProfilePicture = async (id, file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post(
            `/students/${id}/profile-picture`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteStudent = async (id) => {
    try {
        const response = await axiosInstance.delete(`/students/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
