import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import TimerIcon from '@mui/icons-material/Timer';
import FolderIcon from '@mui/icons-material/Folder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Calendar from './Calendar';
import { API_ENDPOINTS, axiosConfig } from './config/api';
import { getImageUrl } from './studentService';
import axios from 'axios';

// Define theme colors
const themeColors = {
  primary: "#EF476F",
  secondary: "#F78C6B",
  accent: "#FFD166",
  green: "#06D6A0",
  blue: "#118AB2",
  dark: "#073B4C",
};

function Dashboard() {
  const [studentData, setStudentData] = useState({ studentId: '', studentName: '' });

  useEffect(() => {
    const fetchStudentData = async () => {
      const studentId = localStorage.getItem('studentId');
      if (!studentId) {
        console.error("No student ID found in localStorage.");
        return;
      }
      try {
        const response = await axios.get(API_ENDPOINTS.STUDENT.GET_BY_ID(studentId), axiosConfig);
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
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        border: '1px solid lightgray',
        borderRadius: '30px',
        padding: 3,
        backgroundImage: 'url("/ASSETS/polkadot.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxSizing: 'border-box',
        marginTop: '50px',
      }}
    >
      {/* Header Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '10px',
            overflow: 'hidden',
            mr: 3,
            border: `2px solid ${themeColors.dark}`,
            
          }}
        >
          <img
            src={getImageUrl(studentData.profilePicture)}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ color: themeColors.dark, mb: 1 }}>
            Hello, {studentData.studentName || 'Student'}!
          </Typography>
          <Typography variant="subtitle1" sx={{ color: themeColors.blue, mb: 1 }}>
            Student ID: {studentData.studentId || 'Unknown ID'}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: themeColors.green }}>
            Stay organized, stay ahead!
          </Typography>
        </Box>
      </Box>

      {/* Grid Layout for Widgets */}
      <Grid container spacing={3}>
        {/* To-Do List Widget */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: '20px',
              backgroundColor: 'white',
              border: `2px solid ${themeColors.accent}`,
              boxShadow: '0 3px 2px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: themeColors.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <CheckCircleIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" sx={{ color: themeColors.accent }}>
                To-Do List
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Timer Widget */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: '20px',
              backgroundColor: 'white',
              border: `2px solid ${themeColors.blue}`,
              boxShadow: '0 3px 2px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: themeColors.blue,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <TimerIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" sx={{ color: themeColors.blue }}>
                Timer
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Folders Widget */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: '20px',
              backgroundColor: 'white',
              border: `2px solid ${themeColors.secondary}`,
              boxShadow: '0 3px 2px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: themeColors.secondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <FolderIcon sx={{ color: 'white' }} />
              </Box>
              <Typography variant="h6" sx={{ color: themeColors.secondary }}>
                Folders
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Calendar Widget */}
      <Grid item xs={12} sx={{ mt: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: '20px',
            backgroundColor: 'white',
            border: `2px solid ${themeColors.green}`,
            boxShadow: '0 3px 2px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: themeColors.green,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <EventNoteIcon sx={{ color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ color: themeColors.green }}>
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
