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

// ✅ Axios interceptor: Skip Authorization for public endpoints
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

// ✅ Wrapper for authenticated requests (optional use)
export const axiosRequest = async (config) => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No auth token found. Please login.');
    }
    return axiosInstance(config);
};

// ✅ Registration - Public (no token)
export const addStudent = async (studentData) => {
    try {
        const response = await axiosInstance.post(`/students/register`, studentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ✅ Login - Public (no token)
export const loginStudent = async (credentials) => {
    try {
        const response = await axiosInstance.post(`/students/login`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ✅ Authenticated routes below
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
