import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Grid, Button
} from '@mui/material';

const EditDialog = ({
  open, onClose, title, setTitle, hours, setHours,
  minutes, setMinutes, seconds, setSeconds, onSave
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Edit Timer</DialogTitle>
    <DialogContent>
      <TextField
        label="Title"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        inputProps={{ maxLength: 20 }}
        sx={{ marginBottom: '10px', marginTop: '10px' }}
      />
      <Grid container justifyContent="center" spacing={2}>
        {[{ label: "Hours", value: hours, set: setHours },
          { label: "Minutes", value: minutes, set: setMinutes },
          { label: "Seconds", value: seconds, set: setSeconds }
        ].map(({ label, value, set }) => (
          <Grid item key={label}>
            <TextField
              label={label}
              value={value}
              onChange={(e) => set(e.target.value)}
              inputProps={{ maxLength: 2 }}
              sx={{ width: '100px' }}
            />
          </Grid>
        ))}
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} sx={{ backgroundColor: '#EF476F', color: '#fff', textTransform: 'none' }}>
        Cancel
      </Button>
      <Button onClick={onSave} sx={{ backgroundColor: '#118AB2', color: '#fff', textTransform: 'none' }}>
        Save
      </Button>
    </DialogActions>
  </Dialog>
);

export default EditDialog;
