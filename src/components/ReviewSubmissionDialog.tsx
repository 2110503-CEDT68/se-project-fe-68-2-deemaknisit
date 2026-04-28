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
} from '@mui/material';

function StarRatingInput({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number) => void;
}) {
  return (
    <div style={{ display: 'inline-flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = value !== null && star <= value;
        return (
          <label
            key={star}
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
          >
            <input
              type="radio"
              name="review-rating"
              value={star}
              checked={value === star}
              onChange={() => onChange(star)}
              style={{
                position: 'absolute',
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: 'hidden',
                clip: 'rect(0,0,0,0)',
                whiteSpace: 'nowrap',
                border: 0,
              }}
            />
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill={filled ? '#FFD600' : 'none'}
              stroke={filled ? '#FFD600' : '#bbb'}
              strokeWidth="2"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </label>
        );
      })}
    </div>
  );
}

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
    <Dialog open={open} onClose={!isSubmitting ? onClose : undefined} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 'bold', pt: 3 }}>Submit Your Review</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
        {successMessage && (
          <Box sx={{ p: 1.5, bgcolor: '#e8f5e9', color: '#385b3a', borderRadius: 1 }}>
            <Typography fontWeight="bold" variant="body2">{successMessage}</Typography>
          </Box>
        )}

        {error && error !== 'Please share your thoughts - we require your comment!' && (
          <Box sx={{ p: 1.5, bgcolor: '#ffebee', color: '#871010', borderRadius: 1 }}>
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
          <StarRatingInput value={rating} onChange={(v) => setRating(v)} />
        </Box>

        <TextField
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
            sx: { fontWeight: 'bold', fontSize: '0.75rem' }
          }}
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
