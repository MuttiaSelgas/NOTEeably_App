import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';

const ConfirmEditDialog = ({ open, onConfirm, onCancel }) => (
  <Dialog open={open} onClose={onCancel}>
    <div style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
      <img src="/ASSETS/popup-alert.png" alt="Alert Icon" style={{ marginRight: '15px', width: '60px' }} />
      <div style={{ flexGrow: 1 }}>
        <DialogTitle style={{ fontSize: '17px', margin: 0 }}>Are you sure you want to edit this?</DialogTitle>
        <DialogActions style={{ marginTop: '10px' }}>
          <Button onClick={onConfirm} style={{ backgroundColor: '#06D6A0', color: '#fff' }}>Ok</Button>
          <Button onClick={onCancel} style={{ backgroundColor: '#EF476F', color: '#fff' }}>Cancel</Button>
        </DialogActions>
      </div>
    </div>
  </Dialog>
);
  
export default ConfirmEditDialog;
