'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface SuccessDialogProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export default function SuccessDialog({
  open,
  title,
  message,
  onClose,
}: SuccessDialogProps) {
  return (
    <Dialog id="success-dialog" open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle id="success-dialog-title" sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
      <DialogContent id="success-dialog-content">
        <Typography id="success-dialog-message">{message}</Typography>
      </DialogContent>
      <DialogActions id="success-dialog-actions" sx={{ p: 2 }}>
        <Button id="success-dialog-ok-button" onClick={onClose} variant="contained" sx={{ backgroundColor: '#22c55e', color: '#fff', '&:hover': { backgroundColor: '#16a34a' } }}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
