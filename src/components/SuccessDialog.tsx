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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: '#22c55e', color: '#fff', '&:hover': { backgroundColor: '#16a34a' } }}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
