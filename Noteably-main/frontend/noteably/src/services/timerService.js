import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/timer';

const timerService = {
    getAllTimers: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/getAll`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getTimerById: async (timerID) => {
        try {
            const response = await axios.get(`${BASE_URL}/get/${timerID}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createTimer: async (timerData) => {
        try {
            const response = await axios.post(`${BASE_URL}/create`, timerData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateTimer: async (timerID, timerData) => {
        try {
            const response = await axios.put(`${BASE_URL}/update/${timerID}`, timerData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteTimer: async (timerID) => {
        try {
            const response = await axios.delete(`${BASE_URL}/delete/${timerID}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    restartTimer: async (timerID) => {
        try {
            const response = await axios.put(`${BASE_URL}/restart/${timerID}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getTimersByStudentId: async (studentId) => {
        try {
            const response = await axios.get(`${BASE_URL}/getByStudent/${studentId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    startTimer: async (timerID) => {
        try {
            const response = await axios.post(`${BASE_URL}/start/${timerID}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default timerService;
