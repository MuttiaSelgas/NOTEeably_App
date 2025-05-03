import axios from 'axios';

const API_BASE_URL = 'https://noteeablyapp-production.up.railway.app/api';

// 🔧 Utility: Get fallback or full image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/ASSETS/Profile_blue.png';
    if (imagePath.startsWith('/ASSETS/') || imagePath.startsWith('http')) {
        return imagePath;
    }
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

// 🔄 Axios instance with interceptor
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const publicEndpoints = ['/students/register', '/students/login'];
        const isPublic = publicEndpoints.some((endpoint) => config.url?.includes(endpoint));

        if (!isPublic) {
            const token = getAuthToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            } else {
                delete config.headers['Authorization'];
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Export the axios instance for direct use
export default axiosInstance;

// ✅ Auth-Free Endpoints
export const addStudent = async (studentData) => {
    const response = await axiosInstance.post('/students/register', studentData);
    return response.data;
};

export const loginStudent = async (credentials) => {
    const response = await axiosInstance.post('/students/login', credentials);
    return response.data;
};

// ✅ Authenticated API Calls
export const getStudentById = async (id) => {
    const response = await axiosInstance.get(`/students/${id}`);
    return response.data;
};

export const getStudentByStudentId = async (studentId) => {
    const response = await axiosInstance.get(`/students/find/${studentId}`);
    return response.data;
};

export const updateStudent = async (id, studentData) => {
    const response = await axiosInstance.put(`/students/${id}`, studentData);
    return response.data;
};

export const uploadProfilePicture = async (id, file) => {
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
};

export const deleteStudent = async (id) => {
    const response = await axiosInstance.delete(`/students/${id}`);
    return response.data;
};

// ✅ Generic Axios wrapper (correct usage!)
export const axiosRequest = async (method, url, data = null, config = {}) => {
    const response = await axiosInstance.request({
        method,
        url,
        data,
        ...config,
    });
    return response.data;
};
