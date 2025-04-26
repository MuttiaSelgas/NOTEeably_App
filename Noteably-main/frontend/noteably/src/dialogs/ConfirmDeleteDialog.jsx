import React from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, Box } from '@mui/material';

const ConfirmDeleteDialog = ({ open, onConfirm, onCancel }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogContent>
      <Box display="flex" alignItems="center">
        <img
          src="/ASSETS/popup-delete.png"
          alt="Delete Icon"
          style={{ marginRight: '15px', width: '60px' }}
        />
        <DialogTitle style={{ fontSize: '17px', margin: 0, padding: 0 }}>
          Are you sure you want to delete this?
        </DialogTitle>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onConfirm} style={{ backgroundColor: '#06D6A0', color: '#fff' }}>Ok</Button>
      <Button onClick={onCancel} style={{ backgroundColor: '#EF476F', color: '#fff' }}>Cancel</Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDeleteDialog;
