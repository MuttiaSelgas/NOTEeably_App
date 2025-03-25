// API Base URL
export const API_BASE_URL = 'http://localhost:8080/api';

// API Endpoints
export const API_ENDPOINTS = {
    // Student endpoints
    STUDENT: {
        LOGIN: `${API_BASE_URL}/students/login`,
        REGISTER: `${API_BASE_URL}/students/register`,
        GET_BY_ID: (id) => `${API_BASE_URL}/students/${id}`,
        UPDATE: (id) => `${API_BASE_URL}/students/${id}`,
        DELETE: (id) => `${API_BASE_URL}/students/${id}`
    },
    // Add other endpoints as needed
    NOTES: {
        BASE: `${API_BASE_URL}/notes`,
        GET_BY_ID: (id) => `${API_BASE_URL}/notes/${id}`,
        CREATE: `${API_BASE_URL}/notes`,
        UPDATE: (id) => `${API_BASE_URL}/notes/${id}`,
        DELETE: (id) => `${API_BASE_URL}/notes/${id}`
    },
    FOLDERS: {
        BASE: `${API_BASE_URL}/folders`,
        GET_BY_ID: (id) => `${API_BASE_URL}/folders/${id}`,
        CREATE: `${API_BASE_URL}/folders`,
        UPDATE: (id) => `${API_BASE_URL}/folders/${id}`,
        DELETE: (id) => `${API_BASE_URL}/folders/${id}`
    }
};

// Axios default config
export const axiosConfig = {
    headers: {
        'Content-Type': 'application/json'
    }
};
