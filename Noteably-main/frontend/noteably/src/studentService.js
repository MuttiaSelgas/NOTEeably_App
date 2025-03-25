import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/students';
const API_BASE_URL = 'http://localhost:8080';

// Utility function to get complete image URL
export const getImageUrl = (imagePath) => {
    // Return default avatar if no path provided
    if (!imagePath) return '/ASSETS/Profile_blue.png';
    
    // Return as-is if it's a local asset or already a full URL
    if (imagePath.startsWith('/ASSETS/') || imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Log for debugging
    console.log('Profile picture path:', imagePath);
    
    // Return default avatar if path is invalid
    return '/ASSETS/Profile_blue.png';
};

export const addStudent = async (studentData) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, studentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginStudent = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getStudentById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getStudentByStudentId = async (studentId) => {
    try {
        const response = await axios.get(`${BASE_URL}/find/${studentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateStudent = async (id, studentData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, studentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const uploadProfilePicture = async (id, file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(
            `${BASE_URL}/${id}/profile-picture`,
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
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
