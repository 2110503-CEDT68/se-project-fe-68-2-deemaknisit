import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface ConfirmDeleteDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  title,
  description,
  onConfirm,
  onClose,
  isSubmitting = false,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog id="confirm-delete-dialog" open={open} onClose={!isSubmitting ? onClose : undefined} maxWidth="xs" fullWidth>
      <DialogTitle id="confirm-delete-dialog-title" sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
      <DialogContent id="confirm-delete-dialog-content">
        <Typography id="confirm-delete-dialog-message">{description}</Typography>
      </DialogContent>
      <DialogActions id="confirm-delete-dialog-actions" sx={{ p: 2 }}>
        <Button id="confirm-delete-cancel-button" onClick={onClose} disabled={isSubmitting} sx={{ color: '#666' }}>
          Cancel
        </Button>
        <Button 
          id="confirm-delete-submit-button"
          onClick={onConfirm} 
          variant="contained" 
          disabled={isSubmitting}
          sx={{ backgroundColor: '#f87171', color: '#ffffff', '&:hover': { backgroundColor: '#ef4444' } }}
        >
          {isSubmitting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
