'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

type Severity = 'success' | 'error' | 'info' | 'warning';

interface NotificationDialogProps {
  open: boolean;
  title: string;
  message: string;
  severity?: Severity;
  actionLabel?: string;
  onClose: () => void;
}

const severityConfig: Record<Severity, { color: string; background: string }> = {
  success: { color: '#166534', background: '#dcfce7' },
  error: { color: '#991b1b', background: '#fee2e2' },
  info: { color: '#155e75', background: '#cffafe' },
  warning: { color: '#92400e', background: '#fef3c7' },
};

export default function NotificationDialog({
  open,
  title,
  message,
  severity = 'info',
  actionLabel = 'OK',
  onClose,
}: NotificationDialogProps) {
  const { color, background } = severityConfig[severity];

  return (
    <Dialog
      id="notification-dialog"
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{ '& .MuiDialog-paper': { borderRadius: '24px' } }}
    >
      <DialogTitle id="notification-dialog-title" sx={{ fontWeight: 'bold', color }}>
        {title}
      </DialogTitle>
      <DialogContent id="notification-dialog-content" sx={{ background }}>
        <Box sx={{ py: 1 }}>
          <Typography id="notification-dialog-message" sx={{ color: '#111111' }}>
            {message}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions id="notification-dialog-actions" sx={{ p: 2 }}>
        <Button
          id="notification-dialog-ok-button"
          onClick={onClose}
          variant="contained"
          sx={{ backgroundColor: color, color: '#fff', '&:hover': { opacity: 0.9 } }}
        >
          {actionLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
