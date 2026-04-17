'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText,
  cancelText = 'Cancel',
  confirmColor = '#111111',
  onConfirm,
  onClose,
  isSubmitting = false,
}: ConfirmDialogProps) {
  const hoverColor = confirmColor === '#111111' ? '#333333' : confirmColor;

  return (
    <Dialog open={open} onClose={!isSubmitting ? onClose : undefined} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting} sx={{ color: '#666' }}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: confirmColor,
            color: '#fff',
            '&:hover': { backgroundColor: hoverColor },
          }}
        >
          {isSubmitting ? `${confirmText}...` : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
