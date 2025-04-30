import axios from 'axios';

const API_BASE_URL = 'https://noteably.onrender.com/api';

// Utility function to get complete image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/ASSETS/Profile_blue.png';
    if (imagePath.startsWith('/ASSETS/') || imagePath.startsWith('http')) {
        return imagePath;
    }
    console.log('Profile picture path:', imagePath);
    return '/ASSETS/Profile_blue.png';
};

export const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined') {
        console.warn('Invalid token found in localStorage:', token);
        return null;
    }
    return token;
};

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        console.log('Axios Interceptor: token from localStorage:', token);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('Axios Interceptor: Authorization header set');
        } else {
            delete config.headers['Authorization'];
            console.log('Axios Interceptor: Authorization header deleted');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Wrapper function to make requests only if token exists
export const axiosRequest = async (config) => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No auth token found. Please login.');
    }
    return axiosInstance(config);
};

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