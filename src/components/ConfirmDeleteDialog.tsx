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
    <Dialog open={open} onClose={!isSubmitting ? onClose : undefined} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting} sx={{ color: '#666' }}>
          Cancel
        </Button>
        <Button 
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
