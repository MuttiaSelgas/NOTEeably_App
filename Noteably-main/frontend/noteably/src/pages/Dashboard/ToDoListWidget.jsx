import React, { useState, useEffect } from 'react';
import { axiosRequest } from '../../services/studentService';
import {
  Box,
  Typography,
  Checkbox,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import ConfirmEditDialog from '../../dialogs/ConfirmEditDialog';

const apiUrl = "http://localhost:8080/api/TodoList";

const ToDoListWidget = () => {
  const [toDoItems, setToDoItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", description: "" });
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);

  const fetchToDoItems = async () => {
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
      console.error("Student ID is not available.");
      return;
    }
    try {
      const response = await axiosRequest({
        method: 'get',
        url: `${apiUrl}/getByStudent/${studentId}`,
        headers: { "Content-Type": "application/json" }
      });
      setToDoItems(response.data);
    } catch (error) {
      console.error("Error fetching ToDo items", error);
    }
  };

  const saveToDoItem = async () => {
    if (editMode && selectedItem) {
      setConfirmEditOpen(true);
    } else {
      await createNewTask();
    }
  };

  const createNewTask = async () => {
    const fullStudentInfo = localStorage.getItem('fullStudentInfo');
    const studentObj = JSON.parse(fullStudentInfo);
    const studentId = studentObj.id;
    if (!newItem.title.trim()) {
      alert("Title is required.");
      return;
    }
    try {
      await axiosRequest({
        method: 'post',
        url: `${apiUrl}/postListRecord`,
        data: { ...newItem, studentId, completed: false },
        headers: { "Content-Type": "application/json" }
      });
      setNewItem({ title: "", description: "" });
      setModalOpen(false);
      fetchToDoItems();
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  const confirmUpdateTask = async () => {
    const fullStudentInfo = localStorage.getItem('fullStudentInfo');
    const studentObj = JSON.parse(fullStudentInfo);
    const studentId = studentObj.id;
    if (!newItem.title.trim()) {
      alert("Title is required.");
      return;
    }
    try {
      await axiosRequest({
        method: 'put',
        url: `${apiUrl}/updateList/${selectedItem.toDoListID}`,
        data: {
          ...newItem,
          studentId,
          completed: selectedItem.completed,
        },
        headers: { "Content-Type": "application/json" }
      });
      setNewItem({ title: "", description: "" });
      setSelectedItem(null);
      setEditMode(false);
      setModalOpen(false);
      setConfirmEditOpen(false);
      fetchToDoItems();
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const deleteToDoItem = async (id) => {
    try {
      await axiosRequest({
        method: 'delete',
        url: `${apiUrl}/deleteList/${id}`,
        headers: { "Content-Type": "application/json" }
      });
      fetchToDoItems();
    } catch (error) {
      console.error("Error deleting ToDo item", error);
    }
  };

  const handleCheckboxToggle = async (taskId) => {
    const updatedItems = toDoItems.map(item =>
      item.toDoListID === taskId ? { ...item, completed: !item.completed } : item
    );
    setToDoItems(updatedItems);

    const itemToUpdate = toDoItems.find(item => item.toDoListID === taskId);
    if (itemToUpdate) {
      try {
        await axiosRequest({
          method: 'put',
          url: `${apiUrl}/updateList/${taskId}`,
          data: { ...itemToUpdate, completed: !itemToUpdate.completed },
          headers: { "Content-Type": "application/json" }
        });
      } catch (error) {
        console.error("Error updating completion status", error);
      }
    }
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setNewItem({ title: item.title, description: item.description });
    setEditMode(true);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchToDoItems();
  }, []);

  const noteablyColors = ['#FFCC66', '#F26C6C', '#FF8A80', '#4DB6AC', '#AED581'];

  return (
    <Box
      sx={{
        backgroundImage: 'url("/ASSETS/polkadots.png")',
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
      }}
    >
      {/* ToDo List Container */}
      <Box sx={{
        padding: '30px',
        borderRadius: '20px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '1200px',
        minHeight: '600px',
        overflowY: 'auto',
      }}>
        {toDoItems.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: '#999' }}>
            No tasks added yet.
          </Typography>
        ) : (
          toDoItems.map((item, index) => {
            const randomColor = noteablyColors[index % noteablyColors.length];
            return (
              <Box
                key={item.toDoListID}
                sx={{
                  width: '100%',
                  marginBottom: '15px',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: item.completed ? '#D3D3D3' : randomColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={item.completed}
                    onChange={() => handleCheckboxToggle(item.toDoListID)}
                    sx={{
                      color: '#FFD166',
                      '&.Mui-checked': { color: '#06D6A0' },
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: item.completed ? 'line-through' : 'none',
                      color: item.completed ? '#999' : '#000',
                      marginLeft: 1,
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>
                <Box>
                  <IconButton onClick={() => openEditModal(item)} size="small">
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => deleteToDoItem(item.toDoListID)} size="small">
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* Floating Add Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => {
          setModalOpen(true);
          setEditMode(false);
          setNewItem({ title: "", description: "" });
        }}
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          backgroundColor: '#FFD166',
          color: '#fff',
          zIndex: 2000,
          '&:hover': { backgroundColor: '#EF476F' },
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Add />
      </Fab>

      {/* Modal for Create/Edit */}
      <Dialog
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  PaperProps={{
    sx: {
      borderRadius: 4,
      padding: 2,
      backgroundColor: '#FFF8F0', // soft background
      width: '100%',
      maxWidth: '500px',
    }
  }}
>
  <DialogTitle sx={{ fontWeight: 'bold', color: '#333' }}>
    {editMode ? "Edit Task" : "Create New Task"}
  </DialogTitle>

  <DialogContent>
    <TextField
      autoFocus
      margin="dense"
      label="Title"
      fullWidth
      variant="outlined"
      value={newItem.title}
      onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
      sx={{
        marginBottom: 2,
        backgroundColor: '#fff',
        borderRadius: 1,
      }}
    />
    <TextField
      margin="dense"
      label="Description"
      fullWidth
      variant="outlined"
      value={newItem.description}
      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
      sx={{
        backgroundColor: '#fff',
        borderRadius: 1,
      }}
    />
  </DialogContent>

  <DialogActions sx={{ padding: '16px 24px' }}>
    <Button
      onClick={() => setModalOpen(false)}
      sx={{ color: '#999', fontWeight: 600 }}
    >
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={saveToDoItem}
      sx={{
        backgroundColor: '#FFD166',
        color: '#fff',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: '#EF476F',
        },
      }}
    >
      {editMode ? "Update" : "Create"}
    </Button>
  </DialogActions>
</Dialog>


      {/* Confirm Edit Dialog */}
      <ConfirmEditDialog
        open={confirmEditOpen}
        onConfirm={confirmUpdateTask}
        onCancel={() => setConfirmEditOpen(false)}
      />
    </Box>
  );
};

export default ToDoListWidget;
