import React, { useState, useEffect, useCallback } from 'react';
import {
  TextField, Typography, Grid, Box, List, ListItem, ListItemText, IconButton,
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
  const navigate = useNavigate();

  const fullStudentInfo = localStorage.getItem('fullStudentInfo');
  const studentId = (() => {
    try {
      return fullStudentInfo ? JSON.parse(fullStudentInfo).id : null;
    } catch {
      return null;
    }
  })();

  const [timerList, setTimerList] = useState([]);
  const [title, setTitle] = useState('');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmEditDialogOpen, setConfirmEditDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [timerToEdit, setTimerToEdit] = useState(null);
  const [timerToDelete, setTimerToDelete] = useState(null);

  const fetchTimers = useCallback(async () => {
    if (!studentId) return;
    try {
      const response = await axiosRequest({ method: 'get', url: `${url}/getByStudent/${studentId}` });
      setTimerList(response.data);
    } catch (error) {
      console.error("Error fetching timers:", error);
    }
  }, [studentId]);

  useEffect(() => {
    fetchTimers();
  }, [fetchTimers]);

  const addTimer = async (title, hours, minutes, seconds) => {
    if (!studentId) return;
    const newTimer = {
      title: title.trim(),
      hours: parseInt(hours || '0', 10),
      minutes: parseInt(minutes || '0', 10),
      seconds: parseInt(seconds || '0', 10),
      studentId,
    };
    try {
      const response = await axiosRequest({ method: 'post', url: `${url}/create`, data: newTimer });
      setTimerList(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding timer:", error);
    }
  };

  const updateTimer = async () => {
    if (!timerToEdit || !studentId) return;
    const updated = {
      timerID: timerToEdit.timerID,
      title,
      hours: parseInt(hours || '0', 10),
      minutes: parseInt(minutes || '0', 10),
      seconds: parseInt(seconds || '0', 10),
      studentId,
    };
    try {
      const response = await axiosRequest({
        method: 'put',
        url: `${url}/update/${timerToEdit.timerID}`,
        data: updated,
      });
      setTimerList(prev => prev.map(t => t.timerID === updated.timerID ? response.data : t));
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating timer:", error);
    }
  };

  const deleteTimer = async (timerID) => {
    try {
      await axiosRequest({ method: 'delete', url: `${url}/delete/${timerID}` });
      setTimerList(prev => prev.filter(t => t.timerID !== timerID));
    } catch (error) {
      console.error("Error deleting timer:", error);
    }
  };

  const handlePlayClick = (timer) => {
    const totalSeconds = timer.hours * 3600 + timer.minutes * 60 + timer.seconds;
    navigate('/running', {
      state: {
        title: timer.title,
        initialTime: totalSeconds,
      },
    });
  };

  const handleStart = () => {
    const totalSeconds = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    if (totalSeconds > 0) {
      addTimer(title, hours, minutes, seconds);
      navigate('/running', { state: { title, initialTime: totalSeconds } });
    } else {
      alert('Please enter a valid time.');
    }
  };

  const resetFields = () => {
    setTitle('');
    setHours('00');
    setMinutes('00');
    setSeconds('00');
  };

  const handleEditClick = (timer) => {
    setTimerToEdit(timer);
    setTitle(timer.title);
    setHours(String(timer.hours).padStart(2, '0'));
    setMinutes(String(timer.minutes).padStart(2, '0'));
    setSeconds(String(timer.seconds).padStart(2, '0'));
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (timerID) => {
    setTimerToDelete(timerID);
    setConfirmDialogOpen(true);
  };

  const handleEditSaveClick = () => setConfirmEditDialogOpen(true);
  const handleEditConfirm = () => {
    updateTimer();
    setConfirmEditDialogOpen(false);
  };
  const handleEditCancel = () => setConfirmEditDialogOpen(false);

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

  const isStartDisabled =
    (!/^\d+$/.test(hours) || parseInt(hours) === 0) &&
    (!/^\d+$/.test(minutes) || parseInt(minutes) === 0) &&
    (!/^\d+$/.test(seconds) || parseInt(seconds) === 0);

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
              {['Hours', 'Minutes', 'Seconds'].map((label, i) => {
                const value = [hours, minutes, seconds][i];
                const setter = [setHours, setMinutes, setSeconds][i];
                return (
                  <Grid item key={label}>
                    <Typography variant="h6" className={`timer-subtitle ${label.toLowerCase()}`}>{label}</Typography>
                    <TextField
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      inputProps={{ maxLength: 2 }}
                      variant="outlined"
                      className={`timer-textfield input-${label.toLowerCase()}`}
                    />
                  </Grid>
                );
              })}
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
                <IconButton onClick={resetFields} className="timer-button timer-reset">
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
                  disableGutters
                  className={`timer-item-box color-${index % 7}`}
                  sx={{ flex: 1 }}
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

          {/* Dialogs */}
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
