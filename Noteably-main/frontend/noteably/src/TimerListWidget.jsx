import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const apiUrl = "http://localhost:8080/api/timer";

const TimerListWidget = () => {
    const [timerList, setTimerList] = useState([]);
    const navigate = useNavigate();

    // Fetch Timer List
    const fetchTimers = async () => {
        const studentId = localStorage.getItem('studentId');
        if (!studentId) {
            console.error("Student ID is not available.");
            return;
        }
        try {
            const response = await axios.get(`${apiUrl}/getByStudent/${studentId}`);
            setTimerList(response.data);
        } catch (error) {
            console.error("Error fetching timers:", error);
        }
    };

    useEffect(() => {
        fetchTimers();
    }, []);

    return (
        <Box className="scrollable" sx={{
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: '',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            width: '400px',
            height: '300px',
            overflowY: 'auto',
        }}>
            
            {timerList.length === 0 ? (
                <Typography style={{ textAlign: 'center', color: '#999' }}>
                    No timers added yet.
                </Typography>
            ) : (
                <List>
                    {timerList.map((timer) => (
                            <ListItem key={timer.timerID} sx={{ marginBottom: '10px', backgroundColor: '#118AB2', borderRadius: '5px', color: 'white', width: '100%' }}>
                            <ListItemText
                                primary={timer.title}
                                secondary={`${timer.hours}h ${timer.minutes}m ${timer.seconds}s`}
                                primaryTypographyProps={{ style: { color: 'white', fontWeight: 'bold' } }}
                                secondaryTypographyProps={{ style: { color: 'white' } }}
                            />
                            <IconButton onClick={() => navigate('/running', { state: { initialTime: timer.hours * 3600 + timer.minutes * 60 + timer.seconds, title: timer.title } })} sx={{ color: 'white' }}>
                                <PlayArrowIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default TimerListWidget;
