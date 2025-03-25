import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { Button, TextField, Select, MenuItem, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { Edit, Delete, Event, PriorityHigh, LowPriority, Star, EventNote, Add } from '@mui/icons-material';
import './Fullcalendar.css';

const apiUrl = "http://localhost:8080/api/schedules";

function Schedule() {
  const studentId = localStorage.getItem('studentId'); // Get studentId from local storage
  const [schedules, setSchedules] = useState([]);
  const [toDoItems, setToDoItems] = useState([]);
  const [formData, setFormData] = useState({ title: "", priority: "moderate", startDate: "", endDate: "", colorCode: "", todoListIds: [] });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [openToDoDialog, setOpenToDoDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [newToDo, setNewToDo] = useState({ title: "", description: "", scheduleId: null });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openEditConfirmationDialog, setOpenEditConfirmationDialog] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");


 
  useEffect(() => {
    fetchSchedules();
    fetchToDoItems();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${apiUrl}/getByStudent/${studentId}`); // Fetch schedules by studentId
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules", error);
    }
  };

  const fetchToDoItems = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/TodoList/getByStudent/" + studentId); // Fetch ToDo items by studentId
      setToDoItems(response.data);
    } catch (error) {
      console.error("Error fetching ToDo items", error);
    }
  };

  const groupedSchedules = {
    high: schedules.filter(schedule => schedule.priority === 'high'),
    moderate: schedules.filter(schedule => schedule.priority === 'moderate'),
    low: schedules.filter(schedule => schedule.priority === 'low'),
  };

  const addOrUpdateSchedule = async () => {
    const today = new Date().toISOString().split('T')[0];
    if (formData.startDate < today) {
      setAlertMessage("Start date cannot be in the past. Please select today or a future date.");
      setOpenAlertDialog(true);
      return;
    }
    if (formData.endDate < formData.startDate) {
      setAlertMessage("End date cannot be earlier than the start date.");
      setOpenAlertDialog(true);
      return;
    }
  
    try {
      const url = isEditMode ? `${apiUrl}/editSched/${selectedId}` : `${apiUrl}/postSched`;
      const method = isEditMode ? "put" : "post";
  
      const scheduleData = { ...formData, studentId: parseInt(studentId, 10) }; // Include studentId
  
      await axios({ method, url, data: scheduleData, headers: { "Content-Type": "application/json" } });
      setFormData({ title: "", priority: "moderate", startDate: "", endDate: "", colorCode: "", todoListIds: [] });
      setIsEditMode(false);
      setSelectedId(null);
      fetchSchedules();
    } catch (error) {
      console.error("Error saving schedule", error);
    }
  };
  
  

  const handleDeleteClick = (id) => {
    setScheduleToDelete(id);
    setOpenDeleteDialog(true);
  };

  const deleteSchedule = async (id) => {
    try {
      await axios.delete(`${apiUrl}/deleteSched/${id}`);
      fetchSchedules();
      setOpenDeleteDialog(false);
      setScheduleToDelete(null);
    } catch (error) {
      console.error("Error deleting schedule", error);
    }
  };


const handleEdit = (schedule) => {
  setFormData({
    title: schedule.title,
    priority: schedule.priority,
    startDate: schedule.startDate,
    endDate: schedule.endDate,
    colorCode: schedule.colorCode,
    todoListIds: schedule.tasks.map((task) => task.toDoListID),
  });
  setIsEditMode(true);
  setSelectedId(schedule.scheduleID);
  setOpenEditConfirmationDialog(true); // Open confirmation dialog first
};


  

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false); // Close the edit dialog
    setIsEditMode(false);
    setSelectedId(null);
    setFormData({ title: "", priority: "moderate", startDate: "", endDate: "", colorCode: "", todoListIds: [] });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewToDoChange = (e) => {
    setNewToDo({ ...newToDo, [e.target.name]: e.target.value });
  };

  const addNewToDo = async () => {
    try {
      const newToDoData = { ...newToDo, studentId: parseInt(studentId, 10) }; // Include studentId
      const response = await axios.post("http://localhost:8080/api/TodoList/postListRecord", { ...newToDoData, scheduleId: selectedId });
      setNewToDo({ title: "", description: "" });
      setOpenToDoDialog(false);
      fetchToDoItems();
    } catch (error) {
      console.error("Error adding ToDo item", error);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <PriorityHigh sx={{ color: '#FF6F61' }} />;
      case 'moderate':
        return <Star sx={{ color: '#FFD166' }} />;
      case 'low':
        return <LowPriority sx={{ color: '#FFC067' }} />;
      default:
        return <Event />;
    }
  };

  return (
    <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundImage: 'url(/ASSETS/polkadot.png)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        border: '1px solid lightgray',
        borderRadius: '30px',
        marginTop: '50px',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '1000px', textAlign: 'left', mb: 4, p: 3, backgroundColor: '#f9f9f9', borderRadius: '12px', boxShadow: 'inset 0px 2px 2px 0px rgba(0, 0, 0, 0.1)', border: '1px solid lightgray'}}>
        <Typography variant="h4" sx={{ color: '#073B4C', mb: 2 }}>Schedule Manager</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', border: '1px solid lightgray' }}>
          <TextField label="Title" name="title" value={formData.title} onChange={handleFormChange} fullWidth />
          <TextField label="Start Date" type="date" name="startDate" value={formData.startDate} onChange={handleFormChange} InputLabelProps={{ shrink: true }} />
          <TextField label="End Date" type="date" name="endDate" value={formData.endDate} onChange={handleFormChange} InputLabelProps={{ shrink: true }} />
          <Select name="priority" value={formData.priority} onChange={handleFormChange}  >
            <MenuItem value="high">HIGH</MenuItem>
            <MenuItem value="moderate">MODERATE</MenuItem>
            <MenuItem value="low">LOW</MenuItem>
          </Select>
          <Select name="colorCode" value={formData.colorCode} onChange={handleFormChange}>
            <MenuItem value="#EF476F" style={{ color: "#EF476F" }}>Pink</MenuItem>
            <MenuItem value="#06D6A0" style={{ color: "#06D6A0" }}>Green</MenuItem>
            <MenuItem value="#118AB2" style={{ color: "#118AB2" }}>Blue</MenuItem>
            <MenuItem value="#F78C6B" style={{ color: "#F78C6B" }}>Coral</MenuItem>
            <MenuItem value="#FFD166" style={{ color: "#FFD166" }}>Yellow</MenuItem>
            <MenuItem value="#073B4C" style={{ color: "#073B4C" }}>Dark Blue</MenuItem>
          </Select>
          <Button variant="contained" color={isEditMode ? "secondary" : "primary"} onClick={addOrUpdateSchedule} sx={{ backgroundColor: isEditMode ? '#ffadad' : '#ffcb77', borderRadius: '20px' }}>
            {isEditMode ? "Update" : "Add"}
          </Button>
        </Box>
      </Box>

      <Dialog open={openAlertDialog} onClose={() => setOpenAlertDialog(false)}>
  <DialogContent>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        component="img"
        src="/ASSETS/popup-alert.png"// Path to your image
        alt="Alert Icon"
        sx={{ width: '50px', height: '50px' }}
      />
      <DialogContentText sx={{ fontSize: '16px', color: '#333' }}>
        {alertMessage}
      </DialogContentText>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => setOpenAlertDialog(false)}
      sx={{
        textTransform: 'none',
        color: '#fff',
        backgroundColor: '#EF476F',
        borderRadius: '8px',
        padding: '5px 20px',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: '#F78C6B',
        },
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>




      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
      <DialogTitle>Edit Schedule</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleFormChange}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Start Date"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleFormChange}
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleFormChange}
          fullWidth
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <Select
          name="priority"
          value={formData.priority}
          onChange={handleFormChange}
          fullWidth
          margin="dense"
        >
          <MenuItem value="high">High</MenuItem>
          <MenuItem value="moderate">Moderate</MenuItem>
          <MenuItem value="low">Low</MenuItem>
        </Select>
        <Select
          name="colorCode"
          value={formData.colorCode}
          onChange={handleFormChange}
          fullWidth
          margin="dense"
        >
          <MenuItem value="#EF476F" style={{ color: "#EF476F" }}>Pink</MenuItem>
          <MenuItem value="#06D6A0" style={{ color: "#06D6A0" }}>Green</MenuItem>
          <MenuItem value="#118AB2" style={{ color: "#118AB2" }}>Blue</MenuItem>
          <MenuItem value="#F78C6B" style={{ color: "#F78C6B" }}>Coral</MenuItem>
          <MenuItem value="#FFD166" style={{ color: "#FFD166" }}>Yellow</MenuItem>
          <MenuItem value="#073B4C" style={{ color: "#073B4C" }}>Dark Blue</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseEditDialog} color="secondary">Cancel</Button>
        <Button
          onClick={() => {
            addOrUpdateSchedule();
            handleCloseEditDialog();
          }}
          color="primary"
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog open={openEditConfirmationDialog} onClose={() => setOpenEditConfirmationDialog(false)}>
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'left',  alignItems: 'left', textAlign: 'left', gap: 2 }}>
          <Box
            component="img"
            src="/ASSETS/popup-alert.png" 
            alt="Edit Confirmation"
            sx={{ width: '80px', height: '80px' }}
          />
          <DialogContentText sx={{ color: 'black', fontSize: '16px', marginTop: '25px' }}>
            Are you sure you want to edit this schedule?
          </DialogContentText>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpenEditConfirmationDialog(false); // Close confirmation dialog
            setOpenEditDialog(true); // Proceed to edit dialog
          }}
          sx={{
            textTransform: 'none',
            color: '#fff',
            backgroundColor: '#06D6A0',
            borderRadius: '8px',
            padding: '5px 20px',
            fontWeight: 'bold',
            marginTop: '-30px',
            marginBottom: '10px',
            '&:hover': {
              backgroundColor: '#F78C6B',
            },
          }}
        >
          Yes, Edit
        </Button>
        <Button
          onClick={() => setOpenEditConfirmationDialog(false)}
          sx={{
            textTransform: 'none',
            color: '#fff',
            backgroundColor: '#EF476F',
            borderRadius: '8px',
            padding: '5px 20px',
            fontWeight: 'bold',
            marginTop: '-30px',
            marginBottom: '10px',
            '&:hover': {
              backgroundColor: '#F78C6B',
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>




      <Dialog open={openToDoDialog} onClose={() => setOpenToDoDialog(false)}>
        <DialogTitle>Add ToDo Item</DialogTitle>
        <DialogContent>
          <TextField label="Title" name="title" value={newToDo.title} onChange={handleNewToDoChange} fullWidth />
          <TextField label="Description" name="description" value={newToDo.description} onChange={handleNewToDoChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenToDoDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={addNewToDo} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

        <Dialog 
          open={openDeleteDialog} 
          onClose={() => setOpenDeleteDialog(false)}
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '600px' // Increased width for better text fit
            }
          }}
>
  <DialogContent>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px', // Spacing between image, text, and buttons
        padding: '10px',
      }}
    >
      {/* Image */}
      <Box
        component="img"
        src="/ASSETS/popup-delete.png"
        alt="Delete Icon"
        sx={{
          width: '80px', // Adjust size
          height: '80px',
        }}
      />

      {/* Text */}
      <DialogContentText
        sx={{
          color: 'black',
          fontSize: '16px',
          flex: '1', // Allow text to take up remaining space
        }}
      >
        Are you sure you want to delete this schedule?
      </DialogContentText>

      {/* Buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: '10px', // Spacing between buttons
        }}
      >
        <Button
          onClick={() => deleteSchedule(scheduleToDelete)}
          sx={{
            textTransform: 'none', // Prevent text from being auto-capitalized
            color: '#fff',
            backgroundColor: '#06D6A0',
            borderRadius: '8px',
            padding: '5px 20px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#F78C6B',
            },
          }}
        >
          Ok
        </Button>
        <Button
          onClick={() => setOpenDeleteDialog(false)}
          sx={{
            textTransform: 'none', // Prevent text from being auto-capitalized
            color: '#fff',
            backgroundColor: '#EF476F',
            borderRadius: '8px',
            padding: '5px 20px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#F78C6B',
            },
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  </DialogContent>
</Dialog>

      <Box sx={{ width: '100%', maxWidth: '1000px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: 3, overflow: 'hidden', p: 3, mb: 4, color: '#073B4C' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,dayGridDay,listWeek'
          }}
          events={schedules.map((s) => ({
            title: s.title,
            start: s.startDate,
            end: s.endDate || s.startDate,
            backgroundColor: s.colorCode,
          }))}
          height="600px"
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            list: 'List'
          }}
        />
      </Box>
      <Box sx={{ width: '100%', maxWidth: '1000px', p: 3, backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: 'inset 0px 2px 2px 0px rgba(0, 0, 0, 0.1)', border: '1px solid lightgray',  mb: 4, display: 'flex', gap: 2 }}>
        {Object.keys(groupedSchedules).map((priority, index) => (
          <Box key={index} sx={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: priority === 'high' ? '#EF476F' : priority === 'moderate' ? '#FFD166' : '#06D6A0', textAlign: 'center' }}>
              {priority.toUpperCase()} PRIORITY
            </Typography>
            {groupedSchedules[priority].map(schedule => (
              <Box key={schedule.scheduleID} sx={{ backgroundColor: schedule.colorCode, borderRadius: '15px', padding: '16px', mb: 3, color: '#ffffff', boxShadow: 3 }}>
              <Typography variant="h6" sx={{ color: '#073B4C'}}>
                {getPriorityIcon(schedule.priority)} {schedule.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#073B4C' }}>
                <EventNote /> {schedule.startDate} {schedule.endDate && `- ${schedule.endDate}`}
              </Typography>
                <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      mt: 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setOpenToDoDialog(true)}
                      sx={{
                        backgroundColor: '#fff',
                        color: '#06D6A0',
                        borderRadius: '50%',
                        height: '40px',
                        width: '40px',
                        minWidth: 'unset',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '& .MuiButton-startIcon': {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: 0, // Ensures no unexpected icon margin
                        },
                      }}
                    ></Button>
                    <Button
                      variant="contained"
                      onClick={() => handleEdit(schedule)}
                      startIcon={<Edit />}
                      sx={{
                        backgroundColor: '#fff',
                        color: '#118AB2',
                        borderRadius: '50%',
                        height: '40px',
                        width: '40px',
                        minWidth: 'unset',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '& .MuiButton-startIcon': {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: 0,
                        },
                      }}
                    ></Button>
                    <Button
                      variant="contained"
                      startIcon={<Delete />}
                      color="error"
                      onClick={() => handleDeleteClick(schedule.scheduleID)}
                      sx={{
                        backgroundColor: '#fff',
                        color: '#EF476F',
                        borderRadius: '50%',
                        height: '40px',
                        width: '40px',
                        minWidth: 'unset',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '& .MuiButton-startIcon': {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: 0,
                        },
                      }}
                    ></Button>
                  </Box>

            </Box>
            
            ))}
          </Box>
        ))}
      </Box>
    </div>
  );
}

export default Schedule;