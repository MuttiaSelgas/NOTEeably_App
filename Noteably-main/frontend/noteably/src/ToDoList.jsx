import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { IconButton, Box, Typography, TextField, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const apiUrl = "http://localhost:8080/api/TodoList";

function ToDoList() {
  const studentId = localStorage.getItem('studentId'); // Get studentId from local storage
  const [toDoItems, setToDoItems] = useState([]);
  const [schedules, setSchedules] = useState([]); // Added to manage schedules
  const [formData, setFormData] = useState({ title: "", description: "", scheduleId: "" }); // Added scheduleId
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [dialog, setDialog] = useState({ open: false, type: "", item: null });

  // Fetch ToDo Items
  const fetchToDoItems = useCallback(async () => {
    if (!studentId) {
      console.error("Student ID is not available.");
      return;
    }
    try {
      const response = await axios.get(`${apiUrl}/getByStudent/${studentId}`); // Fetch ToDo items by studentId
      setToDoItems(sortItems(response.data));
    } catch (error) {
      console.error("Error fetching ToDo items", error);
    }
  }, [studentId]);

  // Fetch Schedules
  const fetchSchedules = async () => {
    if (!studentId) {
      console.error("Student ID is not available.");
      return;
    }
    try {
      const response = await axios.get("http://localhost:8080/api/schedules/getByStudent/" + studentId); // Fetch schedules by studentId
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules", error);
    }
  };

  useEffect(() => {
    fetchToDoItems();
    fetchSchedules(); // Fetch schedules on component mount
  }, [fetchToDoItems]);

  const sortItems = (items) => {
    return items.sort((a, b) => a.completed - b.completed);
  };

  // Add or Update ToDo Item
  const addOrUpdateToDoItem = async () => {
    try {
      const isUpdating = isEditMode && selectedId !== null;
      const url = isUpdating ? `${apiUrl}/putList/${selectedId}` : `${apiUrl}/postListRecord`;
      const method = isUpdating ? "put" : "post";

      const toDoData = { ...formData, studentId: parseInt(studentId, 10) }; // Include studentId

      await axios({
        method,
        url,
        data: toDoData,
        headers: { "Content-Type": "application/json" }
      });

      setFormData({ title: "", description: "", scheduleId: "" }); // Reset form data
      setIsEditMode(false);
      setSelectedId(null);
      fetchToDoItems();
    } catch (error) {
      console.error("Error saving ToDo item:", error);
    }
  };

  // Delete ToDo Item
  const deleteToDoItem = async (id) => {
    try {
      if (id === undefined) {
        console.error("Cannot delete item: ID is undefined");
        return;
      }
      await axios.delete(`${apiUrl}/deleteList/${id}`);
      fetchToDoItems();
    } catch (error) {
      console.error("Error deleting ToDo item:", error);
    }
  };

  // Toggle Complete
  const toggleComplete = async (id) => {
    try {
      await axios.put(`${apiUrl}/toggleComplete/${id}`);
      fetchToDoItems();
    } catch (error) {
      console.error("Error toggling completion status:", error);
    }
  };

  // Handle Edit
  const handleEdit = (item) => {
    setDialog({ open: true, type: "edit", item });
  };

  // Handle Delete
  const handleDelete = (item) => {
    setDialog({ open: true, type: "delete", item });
  };

  // Confirm Dialog
  const confirmDialog = () => {
    if (dialog.type === "delete") {
      deleteToDoItem(dialog.item.toDoListID);
    } else if (dialog.type === "edit") {
      setFormData({
        title: dialog.item.title,
        description: dialog.item.description,
        scheduleId: dialog.item.scheduleId // Set scheduleId for editing
      });
      setIsEditMode(true);
      setSelectedId(dialog.item.toDoListID);
    }
    setDialog({ open: false, type: "", item: null });
  };

  // Cancel Dialog
  const cancelDialog = () => {
    setDialog({ open: false, type: "", item: null });
  };

  // Handle Form Change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setFormData({ title: "", description: "", scheduleId: "" });
    setIsEditMode(false);
    setSelectedId(null);
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      height: '100vh',
      backgroundImage: 'url("/ASSETS/polkadot.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '20px',
      borderRadius: '30px',
      border: '1px solid lightgray',
      padding: '40px',
      marginTop: '50px',
    }}>
      <Box style={{ marginBottom: '20px' }}>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleFormChange}
          fullWidth
          variant="outlined"
      
          style={{ marginBottom: '10px', backgroundColor: '#fff' }}
          sx={{
            '& .MuiOutlinedInput-root:hover fieldset': {
              borderColor: '#EF476F',
              borderWidth: '2px',
            },
            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
              borderColor: '#EF476F',
              borderWidth: '2px',
            },
          }}
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleFormChange}
          fullWidth
          variant="outlined"
          style={{ marginBottom: '10px', backgroundColor: '#fff' }}
          sx={{
            '& .MuiOutlinedInput-root:hover fieldset': {
              borderColor: '#FFD166',
              borderWidth: '2px',
            },
            '& .MuiOutlinedInput-root.Mui-focused fieldset': {
              borderColor: '#FFD166',
              borderWidth: '2px',
            },
          }}
        />

        <FormControl fullWidth style={{ marginBottom: '10px', backgroundColor: '#fff' }}>
          <InputLabel>Schedule</InputLabel>
          <Select
            label="Schedule"
            name="scheduleId"
            value={formData.scheduleId}
            onChange={handleFormChange}
            variant="outlined"
            sx={{
              backgroundColor: '#fff', // Sets background color
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#06D6A0', // Hover border color
                borderWidth: '2px',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#06D6A0', // Focus border color
                borderWidth: '2px',
              },
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {schedules.map((schedule) => (
              <MenuItem key={schedule.scheduleID} value={schedule.scheduleID}>
                {schedule.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={addOrUpdateToDoItem}
          startIcon={<Add />}
          style={{
            marginRight: '10px',
            backgroundColor: '#06D6A0',
            color: '#fff',
            borderRadius: '20px',
            padding: '10px 20px',
          }}
          sx={{
            '&:hover': {
              backgroundColor: '#118AB2',
            },
          }}
        >
          {isEditMode ? "Update Task" : "Add Task"}
        </Button>

        {isEditMode && (
          <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
            Cancel
          </Button>
        )}
      </Box>

      <Box>
        {toDoItems.map((item, index) => {
          const colors = ['#EF476F', '#F78C6B', '#FFD166', '#06D6A0', '#118AB2'];
          const color = item.completed ? '#D3D3D3' : colors[index % colors.length];

          return (
            <Box
              key={item.toDoListID}
              style={{
                marginBottom: '15px',
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: color,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={item.completed || false}
                  onChange={() => toggleComplete(item.toDoListID)}
                  color="primary"
                />
                <Box>
                  <Typography
                    variant="h6"
                    style={{
                      fontWeight: 'bold',
                      textDecoration: item.completed ? 'line-through' : 'none',
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      textDecoration: item.completed ? 'line-through' : 'none',
                    }}
                  >
                    {item.description}
                  </Typography>
                  {item.scheduleId && (
                    <Typography variant="body2" style={{ fontStyle: 'italic' }}>
                      <strong>Schedule: </strong>
                      {schedules.find(schedule => schedule.scheduleID === item.scheduleId)?.title}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box style={{ display: 'flex', gap: '10px' }}>
                <IconButton onClick={() => handleEdit(item)} style={{ color: '#6A0572' }}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(item)} style={{ color: '#FF6B6B' }}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={dialog.open} onClose={cancelDialog}>
        <DialogTitle>
          {dialog.type === "delete" ? "Delete Task" : "Edit Task"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialog.type === "delete"
              ? "Are you sure you want to delete this record?"
              : "Are you sure you want to update this record?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDialog} color="secondary">Cancel</Button>
          <Button onClick={confirmDialog} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ToDoList;
