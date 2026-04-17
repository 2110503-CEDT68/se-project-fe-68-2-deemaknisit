'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Rating,
  Box,
} from '@mui/material';

interface ReviewSubmissionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (rating: number, comment: string) => Promise<void>;
  bookingDescription?: string;
  initialData?: { rating: number; comment?: string } | null;
}

export default function ReviewSubmissionDialog({
  open,
  onClose,
  onSave,
  bookingDescription = '',
  initialData,
}: ReviewSubmissionDialogProps) {
  const [rating, setRating] = useState<number | null>(3);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setRating(initialData?.rating || 3);
      setComment(initialData?.comment || '');
      setIsSubmitting(false);
    }
  }, [open, initialData]);

  const handleSave = async () => {
    if (!rating || rating < 1 || rating > 5) {
      return alert('Please choose a rating between 1 and 5.');
    }

    setIsSubmitting(true);
    try {
      await onSave(rating, comment);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={!isSubmitting ? onClose : undefined} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 'bold', pt: 3 }}>Submit Your Review</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
        <div>
          <Typography variant="body2" className="text-stone-400">
            Reviewing: <span className="text-[#111111] font-bold">{bookingDescription || 'Your completed booking'}</span>
          </Typography>
        </div>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          <Typography sx={{ minWidth: 80, fontWeight: 'bold' }}>Rating</Typography>
          <Rating
            name="review-rating"
            value={rating}
            precision={1}
            onChange={(_, value) => setRating(value)}
          />
        </Box>

        <TextField
          label="Comment"
          multiline
          minRows={4}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share your experience with the provider or car..."
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onClose} disabled={isSubmitting} sx={{ color: '#666' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: '#FFD600',
            color: '#111111',
            fontWeight: 'bold',
            borderRadius: '12px',
            px: 4,
            '&:hover': { backgroundColor: '#e0b400' },
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
