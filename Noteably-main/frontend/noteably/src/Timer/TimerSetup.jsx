import React, { useState, useEffect } from 'react';
import {
    Button,TextField,Typography,Grid,Box,List,ListItem,ListItemText,IconButton,Dialog,DialogTitle,DialogContent,DialogActions,
  } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TimerSetup.css';

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
  const studentId = localStorage.getItem('studentId');

  // CRUD
  const fetchTimers = async () => {
    try {
        const response = await axios.get(`${url}/getByStudent/${studentId}`);
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
      studentId: parseInt(studentId, 10)
  };
  try {
      const response = await axios.post(`${url}/create`, formattedTimer);
      setTimerList([...timerList, response.data]);
  } catch (error) {
      console.error("Error adding timer:", error);
  }
};

  const deleteTimer = async (timerID) => {
    try {
      await axios.delete(`${url}/delete/${timerID}`);
      setTimerList(timerList.filter((timer) => timer.timerID !== timerID));
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
            const response = await axios.put(`${url}/update/${timerToEdit.timerID}`, updatedTimer);
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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        border: '1px solid lightgray',
        borderRadius: '30px',
        padding: '20px',
        backgroundImage: 'url("/ASSETS/polkadot.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxSizing: 'border-box',
        marginTop: '50px',
      }}
    >
      <Grid container spacing={3} sx={{ width: '90%', height: '100%' }}>
        {/* Timer Setup */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: '20px',
              borderRadius: '30px',
              backgroundColor: 'white',
              border: '1px solid lightgray',
              boxShadow: 'inset 0 2px 2px rgba(0, 0, 0, 0.1)',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minHeight: '500px',
              maxHeight: 'calc(100vh - 100px)',
              maxWidth: '500px',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <Typography variant="h5" textAlign="center" marginBottom="80px" color="#073B4C">
              Timer
            </Typography>

            <Grid item sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" style={{ color: '#118AB2', marginBottom: '10px' }}>
              Timer Title
            </Typography>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              inputProps={{ maxLength: 20 }}
              placeholder="Enter Timer Title"
              variant="outlined"
              sx={{
                width: '38%',
                backgroundColor: '#fff', // Set background color
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#118AB2', // Hover border color
                  borderWidth: '2px',
                },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#118AB2', // Focus border color
                  borderWidth: '2px',
                },
              }}
            />
          </Grid>

          {/* Hours, Minutes, and Seconds Inputs */}
          <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ marginTop: '10px' }}>
            {/* Hours */}
            <Grid item>
              <Typography variant="h6" style={{ color: '#EF476F' }}>Hours</Typography>
              <TextField
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                inputProps={{ maxLength: 2 }}
                variant="outlined"
                sx={{
                  width: '80px',
                  backgroundColor: '#fff', // Set background color
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#EF476F', // Hover border color
                    borderWidth: '2px',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#EF476F', // Focus border color
                    borderWidth: '2px',
                  },
                }}
              />
            </Grid>

            {/* Minutes */}
            <Grid item>
              <Typography variant="h6" style={{ color: '#FFD166' }}>Minutes</Typography>
              <TextField
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                inputProps={{ maxLength: 2 }}
                variant="outlined"
                sx={{
                  width: '80px',
                  backgroundColor: '#fff', // Set background color
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FFD166', // Hover border color
                    borderWidth: '2px',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FFD166', // Focus border color
                    borderWidth: '2px',
                  },
                }}
              />
            </Grid>

            {/* Seconds */}
            <Grid item>
              <Typography variant="h6" style={{ color: '#06D6A0' }}>Seconds</Typography>
              <TextField
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                inputProps={{ maxLength: 2 }}
                variant="outlined"
                sx={{
                  width: '80px',
                  backgroundColor: '#fff', // Set background color
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#06D6A0', // Hover border color
                    borderWidth: '2px',
                  },
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#06D6A0', // Focus border color
                    borderWidth: '2px',
                  },
                }}
              />
            </Grid>
          </Grid>


            {/* Action Buttons */}
            <Grid container justifyContent="center" spacing={2} sx={{ marginTop: '20px' }}>
              {/* Start Button */}
              <Grid item>
                <IconButton
                  onClick={handleStart}
                  disabled={isStartDisabled}
                  sx={{
                    backgroundColor: isStartDisabled ? '#CCC' : '#06D6A0',
                    color: '#FFF',
                    width: 55,
                    height: 55,
                    borderRadius: '50%',
                    '&:hover': {
                      backgroundColor: isStartDisabled ? '#CCC' : '#04B58D',
                    },
                  }}
                >
                  <PlayArrowIcon sx={{ fontSize: '30px' }} />
                </IconButton>
              </Grid>

              {/* Reset Button */}
              <Grid item>
                <IconButton
                  onClick={resetFields}
                  sx={{
                    backgroundColor: '#EF476F',
                    color: '#FFF',
                    width: 55,
                    height: 55,
                    borderRadius: '50%',
                    '&:hover': {
                      backgroundColor: '#D94262',
                    },
                  }}
                >
                  <RefreshIcon sx={{ fontSize: '30px' }} />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Timer List */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: '20px',
              borderRadius: '30px',
              backgroundColor: 'white',
              border: '1px solid lightgray',
              boxShadow: 'inset 0 2px 2px rgba(0, 0, 0, 0.1)',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minHeight: '500px',
              maxHeight: 'calc(100vh - 100px)',
              maxWidth: '500px',
              width: '100%',
              boxSizing: 'border-box',
              '&::-webkit-scrollbar': {
                width: '1px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#D3D3D3',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#6A6A6A',
              },
            }}
          >
            <Typography variant="h5" textAlign="center" marginBottom="25px" color="#073B4C">
              List
            </Typography>
            <List>
              {timerList.map((timer, index) => (
                <ListItem
                  key={timer.timerID}
                  sx={{
                    borderRadius: '15px',
                    marginBottom: '15px',
                    padding: '15px',
                    backgroundColor: ['#EF476F', '#F78C6B', '#FFD166', '#06D6A0', '#118AB2'][index % 5],
                    color: 'white',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <ListItemText
                    primary={timer.title}
                    secondary={`${timer.hours}h ${timer.minutes}m ${timer.seconds}s`}
                    primaryTypographyProps={{ style: { color: 'white', fontWeight: 'bold' } }}
                    secondaryTypographyProps={{ style: { color: 'white' } }}
                  />
                  <IconButton onClick={() => handleEditClick(timer)} sx={{ color: 'white' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(timer.timerID)} sx={{ color: 'white' }}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handlePlayClick(timer)} sx={{ color: 'white' }}>
                    <PlayArrowIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Edit Dialog */}
          <Dialog 
          open={editDialogOpen} 
          onClose={() => setEditDialogOpen(false)} 
          style={{
            border: '2px solid lightgray', /* Border style */
            boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)' 
          }}
        >

        <DialogTitle>Edit Timer</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            inputProps={{ maxLength: 20 }}
            sx={{
              marginBottom: '10px',
              marginTop: '10px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#118AB2', // Default border color
                },
                '&:hover fieldset': {
                  borderColor: '#FFD166', // Hover border color
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#06D6A0', // Focused border color
                },
              },
            }}
          />
          <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Grid item>
              <TextField
                label="Hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                inputProps={{ maxLength: 2 }}
                sx={{
                  width: '100px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#118AB2', // Default border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#FFD166', // Hover border color
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#06D6A0', // Focused border color
                    },
                  },
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Minutes"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                inputProps={{ maxLength: 2 }}
                sx={{
                  width: '100px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#118AB2', // Default border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#FFD166', // Hover border color
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#06D6A0', // Focused border color
                    },
                  },
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Seconds"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                inputProps={{ maxLength: 2 }}
                sx={{
                  width: '100px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#118AB2', // Default border color
                    },
                    '&:hover fieldset': {
                      borderColor: '#FFD166', // Hover border color
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#06D6A0', // Focused border color
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)}
                sx={{
                  textTransform: 'none', // Prevent text from being auto-capitalized
                  color: '#fff',
                  backgroundColor: '#EF476F',
                  borderRadius: '8px',
                  padding: '5px 20px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  '&:hover': {
                    backgroundColor: '#F78C6B',
                  },
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditSaveClick}
                sx={{
                  textTransform: 'none', // Prevent text from being auto-capitalized
                  color: '#fff',
                  backgroundColor: '#118AB2',
                  borderRadius: '8px',
                  padding: '5px 20px',
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  '&:hover': {
                    backgroundColor: '#F78C6B',
                  },
                }}
                >
                Save
              </Button>
            </DialogActions>
          </Dialog>


          {/* Confirm Update Dialog*/}

          <Dialog open={confirmEditDialogOpen} onClose={handleEditCancel} style={{border: '2px solid lightgray', /* Border style */
          boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)'}}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
            {/* Left side image */}
            <img
              src="/ASSETS/popup-alert.png"
              alt="Alert Icon"
              style={{ marginRight: '15px', width: '60px', height: '60px'}}
            />

            {/* Text and buttons */}
            <div style={{ flexGrow: 1 }}>
            <DialogTitle style={{ margin: 0, padding: 0, fontSize: '17px' }}>
              Are you sure you want to edit this?
            </DialogTitle>

            <DialogActions style={{ marginTop: '10px', padding: 0 }}>
                    <Button
                      onClick={handleEditConfirm}
                      style={{
                        backgroundColor: '#06D6A0',
                        color: '#ffffff',
                        marginRight: '10px',
                        textTransform: 'none',
                        padding: '5px 20px',
                      }}
                    >
                      Ok
                    </Button>
                    <Button
                      onClick={handleEditCancel}
                      style={{
                        backgroundColor: '#EF476F',
                        color: '#ffffff',
                        textTransform: 'none',
                        padding: '5px 20px',
                      }}
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </div>
              </div>
            </Dialog>


          {/* Confirm Delete Dialog */}
          <Dialog open={confirmDialogOpen} onClose={handleDeleteCancel} style={{border: '2px solid lightgray', /* Border style */
          boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)'}}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
            {/* Left side image */}
            <img
              src="/ASSETS/popup-delete.png"
              alt="Delete Icon"
              style={{ marginRight: '15px', width: '60px', height: '60px'}}
            />

          {/* Text and buttons */}
          <div style={{ flexGrow: 1 }}>
            <DialogTitle style={{ margin: 0, padding: 0, fontSize: '17px' }}>
              Are you sure you want to delete this?
            </DialogTitle>

            <DialogActions style={{ marginTop: '10px', padding: 0 }}>
                    <Button
                      onClick={handleDeleteConfirm}
                      style={{
                        backgroundColor: '#06D6A0',
                        color: '#ffffff',
                        marginRight: '10px',
                        textTransform: 'none',
                        padding: '5px 20px',
                      }}
                    >
                      Ok
                    </Button>
                    <Button
                      onClick={handleDeleteCancel}
                      style={{
                        backgroundColor: '#EF476F',
                        color: '#ffffff',
                        textTransform: 'none',
                        padding: '5px 20px',
                      }}
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </div>
              </div>
            </Dialog>


        </Grid>
      </Grid>
    </Box>
  );
}

export default TimerSetup;