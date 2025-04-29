import React, { useEffect, useState, useCallback } from 'react';
import { axiosRequest } from '../../services/studentService';
import { IconButton, Box, Typography, TextField, Button, Checkbox, Dialog, DialogContent, DialogTitle, DialogActions, FormControl, InputLabel, Select, MenuItem, Fab } from '@mui/material';
import { Edit, Delete, Add, Search } from '@mui/icons-material';

const apiUrl = "http://localhost:8080/api/TodoList";

function ToDoList() {
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

  const [toDoItems, setToDoItems] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", scheduleId: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [dialog, setDialog] = useState({ open: false, type: "", item: null });
  const [modalOpen, setModalOpen] = useState(false); // For Create Modal

  const fetchToDoItems = useCallback(async () => {
    if (!studentId) return;
    try {
      const response = await axiosRequest({ method: 'get', url: `${apiUrl}/getByStudent/${studentId}` });
      setToDoItems(response.data);
    } catch (error) {
      console.error("Error fetching ToDo items", error);
    }
  }, [studentId]);

  const fetchSchedules = async () => {
    if (!studentId) return;
    try {
      const response = await axiosRequest({ method: 'get', url: `http://localhost:8080/api/schedules/getByStudent/${studentId}` });
      setSchedules(response.data);
    } catch (error) {
      console.error("Error fetching schedules", error);
    }
  };

  useEffect(() => {
    fetchToDoItems();
    fetchSchedules();
  }, [fetchToDoItems]);

  const addToDoItem = async () => {
    try {
      const toDoData = {
        ...formData,
        studentId: studentId,
        completed: false,
      };

      await axiosRequest({
        method: 'post',
        url: `${apiUrl}/postListRecord`,
        data: toDoData,
        headers: { "Content-Type": "application/json" },
      });

      setFormData({ title: "", description: "", scheduleId: "" });
      setModalOpen(false); // Close modal
      fetchToDoItems(); // Refresh
    } catch (error) {
      console.error("Error saving ToDo item:", error);
    }
  };

  const deleteToDoItem = async (id) => {
    try {
      await axiosRequest({ method: 'delete', url: `${apiUrl}/deleteList/${id}` });
      fetchToDoItems();
    } catch (error) {
      console.error("Error deleting ToDo item:", error);
    }
  };

  const handleDelete = (item) => {
    setDialog({ open: true, type: "delete", item });
  };

  const confirmDialog = () => {
    if (dialog.type === "delete") {
      deleteToDoItem(dialog.item.toDoListID);
    }
    setDialog({ open: false, type: "", item: null });
  };

  const cancelDialog = () => {
    setDialog({ open: false, type: "", item: null });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancelModal = () => {
    setFormData({ title: "", description: "", scheduleId: "" });
    setModalOpen(false);
  };

  const filteredItems = toDoItems.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box sx={{ padding: 4 }}>
      {/* Search */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search To-Do..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton>
                <Search />
              </IconButton>
            )
          }}
          sx={{ marginBottom: 3 }}
        />
      </Box>

      {/* ToDo List */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {filteredItems.length === 0 ? (
          <Typography>No tasks found.</Typography>
        ) : (
          filteredItems.map((item) => (
            <Box
              key={item.toDoListID}
              sx={{
                width: '80%',
                backgroundColor: '#fffbea',
                padding: 2,
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 1,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={() => handleDelete(item)}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {/* Floating Plus Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setModalOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          backgroundColor: '#FFD166',
          color: '#fff',
          zIndex: 1500,
          '&:hover': { backgroundColor: '#EF476F' },
        }}
      >
        <Add />
      </Fab>

      {/* Modal for Create */}
      <Dialog open={modalOpen} onClose={handleCancelModal}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            value={formData.title}
            onChange={handleFormChange}
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            value={formData.description}
            onChange={handleFormChange}
            variant="outlined"
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Schedule</InputLabel>
            <Select
              label="Schedule"
              name="scheduleId"
              value={formData.scheduleId}
              onChange={handleFormChange}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {schedules.map((schedule) => (
                <MenuItem key={schedule.scheduleID} value={schedule.scheduleID}>
                  {schedule.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelModal}>Cancel</Button>
          <Button variant="contained" onClick={addToDoItem}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={dialog.open} onClose={cancelDialog}>
        <DialogContent>
          <Typography>Are you sure you want to delete this task?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmDialog} variant="contained" color="error">Delete</Button>
          <Button onClick={cancelDialog} variant="outlined">Cancel</Button>  
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ToDoList;