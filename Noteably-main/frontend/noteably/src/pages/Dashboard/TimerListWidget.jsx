import React, { useState, useEffect } from 'react';
import { axiosRequest } from '../../services/studentService';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const apiUrl = "https://noteeablyapp-production.up.railway.app/api/timer";

const TimerListWidget = () => {
    const [timerList, setTimerList] = useState([]);
    const navigate = useNavigate();

    // Fetch Timer List
    const fetchTimers = async () => {
        const fullStudentInfo = localStorage.getItem('fullStudentInfo');
        if (!fullStudentInfo) {
            console.error("Full student info is not available.");
            return;
        }
        const studentObj = JSON.parse(fullStudentInfo);
        const studentId = studentObj.id; // numeric ID expected by backend
        if (!studentId) {
            console.error("Numeric student ID is not available.");
            return;
        }
        try {
            const response = await axiosRequest(
                'get',
                `${apiUrl}/getByStudent/${studentId}`
              );
              
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
