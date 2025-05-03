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
import { getImageUrl, axiosRequest } from '../../services/studentService';
import '../../antioverflow.css';
import './Dashboard.css';

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
        const response = await axiosRequest(
          'get',
          API_ENDPOINTS.STUDENT.GET_BY_ID(studentId),
          null,
          axiosConfig
        );
        
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
          <Typography variant="h4" sx={{ color: 'var(--darkblue)', mb: 0.5 }}>
            Hello, {studentData.studentName || 'Student'}!
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'var(--blue)', mb: 0.5 }}>
            Student ID: {studentData.studentId || 'Unknown ID'}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'var(--green)' }}>
            Stay organized, stay ahead!
          </Typography>
        </Box>
      </Box>

      {/* --- Small Compact Widgets --- */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper className="dashboard-widget compact-widget" sx={{ border: '2px solid var(--yellow)' }}>
            <Box className="dashboard-widget-header">
              <Box className="dashboard-icon-box yellow-bg">
                <CheckCircleIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" sx={{ color: 'var(--yellow)', ml: 1 }}>
                To-Do List
              </Typography>
            </Box>
            <Box className="dashboard-widget-content no-scroll-x">
              <ToDoListWidget />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className="dashboard-widget compact-widget" sx={{ border: '2px solid var(--blue)' }}>
            <Box className="dashboard-widget-header">
              <Box className="dashboard-icon-box blue-bg">
                <TimerIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" sx={{ color: 'var(--blue)', ml: 1 }}>
                Timer
              </Typography>
            </Box>
            <Box className="dashboard-widget-content no-scroll-x">
              <TimerListWidget />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper className="dashboard-widget compact-widget" sx={{ border: '2px solid var(--orange)' }}>
            <Box className="dashboard-widget-header">
              <Box className="dashboard-icon-box orange-bg">
                <FolderIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" sx={{ color: 'var(--orange)', ml: 1 }}>
                Folders
              </Typography>
            </Box>
            <Box className="dashboard-widget-content no-scroll-x">
              <FolderWidget />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* --- Calendar below --- */}
      <Grid container spacing={2} sx={{ marginTop: '20px' }}>
        <Grid item xs={12}>
          <Paper className="dashboard-widget">
            <Box className="dashboard-widget-header green-bg">
              <EventNoteIcon sx={{ color: 'white' }} />
              <Typography variant="h6" sx={{ color: 'var(--green)', ml: 1 }}>
                Schedule
              </Typography>
            </Box>
            <Box className="dashboard-widget-content">
              <Calendar />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
