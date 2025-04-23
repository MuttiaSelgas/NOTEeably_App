import React, { useEffect, useState } from 'react';
import FolderWidget from './FolderWidget';
import ToDoListWidget from './ToDoListWidget';
import TimerListWidget from './TimerListWidget';
import { Box, Grid, Typography, Paper } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import FolderIcon from '@mui/icons-material/Folder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Calendar from '../Calendar/Calendar';
import { API_ENDPOINTS, axiosConfig } from '../../config/api';
import { getImageUrl } from '../../services/studentService';
import { axiosRequest } from '../../services/studentService';
import '../../antioverflow.css';
import './Dashboard.css'; // ✅ New CSS import


function Dashboard() {
  const [studentData, setStudentData] = useState({ studentId: '', studentName: '' });

  useEffect(() => {
    const fetchStudentData = async () => {
      const fullStudentInfo = localStorage.getItem('fullStudentInfo');
      let studentId = null;
      if (fullStudentInfo) {
        try {
          const studentObj = JSON.parse(fullStudentInfo);
          studentId = studentObj.id;
        } catch (error) {
          console.error("Error parsing fullStudentInfo from localStorage", error);
        }
      }
      if (!studentId) {
        console.error("No student ID found in localStorage.");
        return;
      }
      try {
        const response = await axiosRequest({ method: 'get', url: API_ENDPOINTS.STUDENT.GET_BY_ID(studentId), ...axiosConfig });
        const { studentId: apiStudentId, name, profilePicture } = response.data;
        setStudentData({ 
          studentId: apiStudentId, 
          studentName: name,
          profilePicture: profilePicture || '/ASSETS/Profile_blue.png',
        });
      } catch (error) {
        console.error('Error fetching student data:', error.response?.data || error.message);
      }
    };
    fetchStudentData();
  }, []);

  return (
    <Box className="dashboard-container">
      <Box className="dashboard-header">
        <Box className="dashboard-profile">
          <img src={getImageUrl(studentData.profilePicture)} alt="Profile" />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ color: 'var(--darkblue)', mb: 1 }}>
            Hello, {studentData.studentName || 'Student'}!
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'var(--blue)', mb: 1 }}>
            Student ID: {studentData.studentId || 'Unknown ID'}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'var(--green)' }}>
            Stay organized, stay ahead!
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={10} md={4}>
          <Paper className="dashboard-widget" sx={{ border: `2px solid ${'var(--yellow)'}` }}>
            <Box className="dashboard-widget-header">
              <Box className="dashboard-icon-box" sx={{ backgroundColor: 'var(--yellow)' }}>
                <CheckCircleIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" sx={{ color: 'var(--yellow)' }}>
                To-Do List
              </Typography>
            </Box>
            <ToDoListWidget />
          </Paper>
        </Grid>

        <Grid item xs={10} md={4}>
          <Paper className="dashboard-widget" sx={{ border: `2px solid ${'var(--blue)'}` }}>
            <Box className="dashboard-widget-header">
              <Box className="dashboard-icon-box" sx={{ backgroundColor: 'var(--blue)' }}>
                <TimerIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" sx={{ color: 'var(--blue)' }}>
                Timer
              </Typography>
            </Box>
            <TimerListWidget />
          </Paper>
        </Grid>

        <Grid item xs={10} md={4}>
          <FolderWidget />
        </Grid>
      </Grid>

      <Grid item xs={12} className="dashboard-calendar">
        <Paper className="dashboard-widget" sx={{ border: `2px solid ${'var(--green)'}` }}>
          <Box className="dashboard-widget-header">
            <Box className="dashboard-icon-box" sx={{ backgroundColor: 'var(--green)'}}>
              <EventNoteIcon sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'var(--green)' }}>
              Schedule
            </Typography>
          </Box>
          <Calendar />
        </Paper>
      </Grid>
    </Box>
  );
}

export default Dashboard;
