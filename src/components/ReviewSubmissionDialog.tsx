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
  Box,
  Rating,
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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage,setSuccessMessage] = useState<string | null>(null);

  const initialRating = initialData?.rating;
  const initialComment = initialData?.comment;
  useEffect(() => {
    if (open) {
      setRating(initialRating || 3);
      setComment(initialComment || '');
      setIsSubmitting(false);
      setError(null);
      setSuccessMessage(null);
    }
  }, [open, initialRating, initialComment]);

  const handleSave = async () => {
    setError(null);

    if (!rating || rating < 1 || rating > 5) {
      return setError('Please choose a rating between 1 and 5.');
    }

    if (!comment || comment.trim() === '') {
      return setError('Please share your thoughts - we require your comment!');
    }

    setIsSubmitting(true);
    try {
      await onSave(rating, comment);
      setSuccessMessage('Thank you for your feedback!');
    } catch (err: any) {
      setError('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog id="review-dialog" open={open} onClose={!isSubmitting ? onClose : undefined} fullWidth maxWidth="xs">
      <DialogTitle id="review-dialog-title" sx={{ fontWeight: 'bold', pt: 3 }}>Submit Your Review</DialogTitle>
      <DialogContent
        id="review-form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}
      >
        {successMessage && (
          <Box id="review-success-message" sx={{ p: 1.5, bgcolor: '#e8f5e9', color: '#385b3a', borderRadius: 1 }}>
            <Typography fontWeight="bold" variant="body2">{successMessage}</Typography>
          </Box>
        )}

        {error && error !== 'Please share your thoughts - we require your comment!' && (
          <Box id="review-error-message" sx={{ p: 1.5, bgcolor: '#ffebee', color: '#871010', borderRadius: 1 }}>
            <Typography fontWeight="bold" variant="body2">{error}</Typography>
          </Box>
        )}
        <div>
          <Typography variant="body2" className="text-stone-400">
            Reviewing: <span className="text-[#111111] font-bold">{bookingDescription || 'Your completed booking'}</span>
          </Typography>
        </div>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          <Typography sx={{ minWidth: 80, fontWeight: 'bold' }}>Rating</Typography>
          <Rating
            id="review-rating-input"
            name="review-rating"
            value={rating}
            precision={1}
            data-testid="review-rating"
            onChange={(_, value) => setRating(value)}
          />
        </Box>

        <TextField
          id="review-comment-input"
          label="Comment"
          multiline
          minRows={4}
          value={comment}
          onChange={(event) => {
            setComment(event.target.value);
            if (error === 'Please share your thoughts - we require your comment!' && event.target.value.trim() !== '') {
              setError(null);
            }
          }}
          placeholder="Share your experience with the provider or car..."
          fullWidth
          error={error === 'Please share your thoughts - we require your comment!'}
          helperText={error === 'Please share your thoughts - we require your comment!' ? 'Please share your thoughts - we require your comment!' : ''}
          FormHelperTextProps={{
            id: 'review-comment-helper',
            sx: { fontWeight: 'bold', fontSize: '0.75rem' }
          }}
          inputProps={{ "data-testid": "review-comment" }}
        />
      </DialogContent>
      <DialogActions id="review-dialog-actions" sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button id="review-cancel-button" onClick={onClose} disabled={isSubmitting} sx={{ color: '#666' }}>
          Cancel
        </Button>
        <Button
          id="review-submit-button"
          onClick={handleSave}
          variant="contained"
          disabled={isSubmitting}
          data-testid="review-submit-button"
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
