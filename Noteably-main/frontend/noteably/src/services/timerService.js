import { axiosInstance } from '../studentService';

const BASE_URL = 'https://noteeablyapp-production.up.railway.app/api/timer';

const timerService = {
    getAllTimers: async () => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/getAll`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getTimerById: async (timerID) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/get/${timerID}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createTimer: async (timerData) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/create`, timerData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateTimer: async (timerID, timerData) => {
        try {
            const response = await axiosInstance.put(`${BASE_URL}/update/${timerID}`, timerData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteTimer: async (timerID) => {
        try {
            const response = await axiosInstance.delete(`${BASE_URL}/delete/${timerID}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    restartTimer: async (timerID) => {
        try {
            const response = await axiosInstance.put(`${BASE_URL}/restart/${timerID}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getTimersByStudentId: async (studentId) => {
        try {
            const response = await axiosInstance.get(`${BASE_URL}/getByStudent/${studentId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    startTimer: async (timerID) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/start/${timerID}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default timerService;
