import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Checkbox } from '@mui/material';

const apiUrl = "http://localhost:8080/api/TodoList";

const ToDoListWidget = () => {
    const [toDoItems, setToDoItems] = useState([]);

    // Fetch ToDo Items
    const fetchToDoItems = async () => {
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
            console.error("Student ID is not available.");
            return;
        }
        try {
            const response = await axios.get(`${apiUrl}/getByStudent/${studentId}`);
            setToDoItems(response.data);
        } catch (error) {
            console.error("Error fetching ToDo items", error);
        }
    };

    // Handle Checkbox Toggle
    const handleCheckboxToggle = async (taskId) => {
        const updatedItems = toDoItems.map(item =>
            item.toDoListID === taskId ? { ...item, completed: !item.completed } : item
        );
        setToDoItems(updatedItems);
    };

    useEffect(() => {
        fetchToDoItems();
    }, []);

    return (
        <Box sx={{
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF', 
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            width: '400px',
            height: '300px',
            overflowY: 'auto',
        }}>
            {toDoItems.length === 0 ? (
                <Typography style={{ textAlign: 'center', color: '#999' }}>
                    No tasks added yet.
                </Typography>
            ) : (
                toDoItems.map((item) => (
                    <Box
                        key={item.toDoListID}
                        sx={{
                            width: '100%',
                            marginBottom: '15px',
                            padding: '10px',
                            borderRadius: '5px',
                            backgroundColor: item.completed ? '#D3D3D3' : '#FFFFE0', 
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Checkbox
                            checked={item.completed}
                            onChange={() => handleCheckboxToggle(item.toDoListID)}
                            sx={{
                                color: item.completed ? '#FFBF00' : '#FFBF00',
                                '&.Mui-checked': { color: '#06D6A0' },
                            }}
                        />
                        <Typography
                            variant="body1"
                            style={{
                                textDecoration: item.completed ? 'line-through' : 'none',
                                color: item.completed ? '#999' : '#000',
                            }}
                        >
                            {item.title}
                        </Typography>
                    </Box>
                ))
            )}
        </Box>
    );
};

export default ToDoListWidget;
