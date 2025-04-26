import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
    TextField,Typography,Grid,Box,List,ListItem,ListItemText,IconButton
  } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { axiosRequest } from '../../services/studentService';
import './TimerSetup.css';

import EditDialog from '../../dialogs/EditDialog';
import ConfirmEditDialog from '../../dialogs/ConfirmEditDialog';
import ConfirmDeleteDialog from '../../dialogs/ConfirmDeleteDialog';

function TimerSetup() {
  const url = "http://localhost:8080/api/timer";
  const [timerList, setTimerList] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [timerToDelete, setTimerToDelete] = useState(null);
  const [timerToEdit, setTimerToEdit] = useState(null);
  const [title, setTitle] = useState('');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const navigate = useNavigate();
  // const studentId = localStorage.getItem('studentId');
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

  // CRUD
  const fetchTimers = async () => {
    try {
        const response = await axiosRequest({ method: 'get', url: `${url}/getByStudent/${studentId}` });
        setTimerList(response.data);
    } catch (error) {
        console.error("Error fetching timers:", error);
    }
};

  const addTimer = async (title, hours, minutes, seconds) => {
  const formattedTimer = {
      title: title.trim(),
      hours: parseInt(hours || '0', 10),
      minutes: parseInt(minutes || '0', 10),
      seconds: parseInt(seconds || '0', 10),
      studentId: studentId
  };
  try {
      const response = await axiosRequest({ method: 'post', url: `${url}/create`, data: formattedTimer });
      setTimerList([...timerList, response.data]);
  } catch (error) {
      console.error("Error adding timer:", error);
  }
};

  const deleteTimer = async (timerID) => {
    try {
      console.log("Deleting timer:", timerID); // added recently
      await axiosRequest({ method: 'delete', url: `${url}/delete/${timerID}` });
setTimerList(timerList.filter((timer) => String(timer.timerID) !== String(timerID)));
    } catch (error) {
      console.error("Error deleting timer:", error);
    }
  };

  const updateTimer = async () => {
    if (timerToEdit) {
        const updatedTimer = {
            timerID: timerToEdit.timerID,
            title,
            hours: parseInt(hours || '0', 10),
            minutes: parseInt(minutes || '0', 10),
            seconds: parseInt(seconds || '0', 10),
            studentId: parseInt(studentId, 10)
        };
        try {
        const response = await axiosRequest({ method: 'put', url: `${url}/update/${timerToEdit.timerID}`, data: updatedTimer });
            setTimerList(timerList.map((timer) => 
                timer.timerID === timerToEdit.timerID ? response.data : timer
            ));
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating timer:", error);
        }
    }
};
  const handlePlayClick = (timer) => {
    const totalSeconds =
      timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
  
    navigate('/running', {
      state: {
        title: timer.title,
        initialTime: totalSeconds,
      },
    });
  };

  const handleEditClick = (timer) => {
    setTimerToEdit(timer);
    setTitle(timer.title);
    setHours(timer.hours);
    setMinutes(timer.minutes);
    setSeconds(timer.seconds);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (timerID) => {
    setTimerToDelete(timerID);
    setConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (timerToDelete) {
      deleteTimer(timerToDelete);
    }
    setConfirmDialogOpen(false);
    setTimerToDelete(null);
  };

  const handleDeleteCancel = () => {
    setConfirmDialogOpen(false);
    setTimerToDelete(null);
  };

  const resetFields = () => {
    setTitle('');
    setHours('00');
    setMinutes('00');
    setSeconds('00');
  };

  const handleStart = () => {
    const totalSeconds =
      parseInt(hours || '0', 10) * 3600 +
      parseInt(minutes || '0', 10) * 60 +
      parseInt(seconds || '0', 10);

    if (totalSeconds > 0) {
      addTimer(title, hours, minutes, seconds);
      navigate('/running', { state: { title, initialTime: totalSeconds } });
    } else {
      alert('Please enter a valid time.');
    }
  };

  useEffect(() => {
    fetchTimers();
  }, []);

  const isStartDisabled =
    (!/^\d+$/.test(hours) || hours === '00' || hours === '0' || hours === '') &&
    (!/^\d+$/.test(minutes) || minutes === '00' || minutes === '0' || minutes === '') &&
    (!/^\d+$/.test(seconds) || seconds === '00' || seconds === '0' || seconds === '');


    const [confirmEditDialogOpen, setConfirmEditDialogOpen] = useState(false);

    const handleEditSaveClick = () => {
      setConfirmEditDialogOpen(true);
    };
    
    const handleEditConfirm = () => {
      updateTimer();
      setConfirmEditDialogOpen(false);
    };
    
    const handleEditCancel = () => {
      setConfirmEditDialogOpen(false);
    };
    

    return (
      <Box className="timer-container">
        <Grid container spacing={3} className="timer-grid-container">
          {/* Timer Setup */}
          <Grid item xs={12} md={6} display="flex" justifyContent="center">

            <Box className="timer-box timer-setup">
              <Typography variant="h5" className="timer-title">Timer</Typography>
    
              <Grid item className="timer-title-input-container">
                <Typography variant="h6" className="timer-subtitle title">Timer Title</Typography>
                <TextField
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  inputProps={{ maxLength: 20 }}
                  placeholder="Enter Timer Title"
                  variant="outlined"
                  className="timer-title-input"
                />
              </Grid>
    
              <Grid container spacing={2} justifyContent="center" alignItems="center" className="timer-input-row">
                <Grid item>
                  <Typography variant="h6" className="timer-subtitle hours">Hours</Typography>
                  <TextField
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    inputProps={{ maxLength: 2 }}
                    variant="outlined"
                    className="timer-textfield input-hours"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h6" className="timer-subtitle minutes">Minutes</Typography>
                  <TextField
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    inputProps={{ maxLength: 2 }}
                    variant="outlined"
                    className="timer-textfield input-minutes"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h6" className="timer-subtitle seconds">Seconds</Typography>
                  <TextField
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    inputProps={{ maxLength: 2 }}
                    variant="outlined"
                    className="timer-textfield input-seconds"
                  />
                </Grid>
              </Grid>
    
              <Grid container justifyContent="center" spacing={2} className="timer-action-buttons">
                <Grid item>
                  <IconButton
                    onClick={handleStart}
                    disabled={isStartDisabled}
                    className={`timer-button timer-start ${isStartDisabled ? 'disabled' : ''}`}
                  >
                    <PlayArrowIcon className="timer-icon" />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={resetFields}
                    className="timer-button timer-reset"
                  >
                    <RefreshIcon className="timer-icon" />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          </Grid>
    
          {/* Timer List */}
          <Grid item xs={12} md={6} display="flex" justifyContent="center">
            <Box className="timer-box">
              <Typography variant="h5" className="timer-list-title">List</Typography>
              <List>
                {timerList.map((timer, index) => (
                  <ListItem
                  key={timer.timerID}
                  >                
                    <ListItemText
                      primary={timer.title}
                      secondary={`${timer.hours}h ${timer.minutes}m ${timer.seconds}s`}
                      primaryTypographyProps={{ className: 'timer-list-text-primary' }}
                      secondaryTypographyProps={{ className: 'timer-list-text-secondary' }}
                    />
                    <IconButton onClick={() => handleEditClick(timer)} className="timer-icon-button">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(timer.timerID)} className="timer-icon-button">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handlePlayClick(timer)} className="timer-icon-button">
                      <PlayArrowIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Dialog */}
            <EditDialog
              open={editDialogOpen}
              onClose={() => setEditDialogOpen(false)}
              title={title}
              setTitle={setTitle}
              hours={hours}
              setHours={setHours}
              minutes={minutes}
              setMinutes={setMinutes}
              seconds={seconds}
              setSeconds={setSeconds}
              onSave={handleEditSaveClick}
            />

            <ConfirmEditDialog
              open={confirmEditDialogOpen}
              onConfirm={handleEditConfirm}
              onCancel={handleEditCancel}
            />

            <ConfirmDeleteDialog
              open={confirmDialogOpen}
              onConfirm={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
            />
          </Grid>
        </Grid>
      </Box>
    );
}

export default TimerSetup;