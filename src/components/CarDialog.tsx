import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem } from "@mui/material";
import { Car, CarWithProvider } from "@/../interface";
import { encodeSafeUrl, decodeSafeUrl } from "@/libs/urlUtils";

interface CarDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: any) => Promise<void>;
  initialData: Car | CarWithProvider | null;
  providerId?: string;
}

export default function CarDialog({
  open,
  onClose,
  onSave,
  initialData,
  providerId
}: CarDialogProps) {
  const [formData, setFormData] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    year: '',
    color: '',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    picture: '',
    rentPrice: '',
    available: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          licensePlate: initialData.licensePlate || '',
          brand: initialData.brand || '',
          model: initialData.model || '',
          year: (initialData.year || '').toString(),
          color: initialData.color || '',
          transmission: initialData.transmission || 'Automatic',
          fuelType: initialData.fuelType || 'Gasoline',
          picture: decodeSafeUrl(initialData.picture || ''),
          rentPrice: (initialData.rentPrice || '').toString(),
          available: initialData.available ?? true
        });
      } else {
        setFormData({
          licensePlate: '', brand: '', model: '', year: '', color: '',
          transmission: 'Automatic', fuelType: 'Gasoline', picture: '',
          rentPrice: '', available: true
        });
      }
    }
  }, [open, initialData]);

  const handleSave = async () => {
    if (!formData.licensePlate || !formData.brand || !formData.model) {
      return alert('License Plate, Brand, and Model are required');
    }
    
    setIsSubmitting(true);
    try {
      const p = initialData?.provider;
      const provider = (typeof p === 'object' ? p._id : p) || providerId;
      
      const payload = {
        ...formData,
        year: formData.year ? parseInt(formData.year) : 0,
        rentPrice: formData.rentPrice ? parseFloat(formData.rentPrice) : 0,
        picture: encodeSafeUrl(formData.picture),
        provider 
      };
      await onSave(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={!isSubmitting ? onClose : undefined} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {initialData ? 'Edit Car' : 'Add New Car'}
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '20px !important' }}>
        <TextField 
          label="License Plate" 
          fullWidth 
          value={formData.licensePlate} 
          onChange={e => setFormData({...formData, licensePlate: e.target.value})} 
        />
        <div className="flex gap-2 w-full">
          <TextField 
            label="Brand" 
            fullWidth 
            value={formData.brand} 
            onChange={e => setFormData({...formData, brand: e.target.value})} 
          />
          <TextField 
            label="Model" 
            fullWidth 
            value={formData.model} 
            onChange={e => setFormData({...formData, model: e.target.value})} 
          />
        </div>
        <div className="flex gap-2 w-full">
          <TextField 
            label="Year" 
            fullWidth 
            type="number"
            value={formData.year} 
            onChange={e => setFormData({...formData, year: e.target.value})} 
          />
          <TextField 
            label="Color" 
            fullWidth 
            value={formData.color} 
            onChange={e => setFormData({...formData, color: e.target.value})} 
          />
        </div>
        <div className="flex gap-2 w-full">
          <TextField 
            select 
            label="Transmission" 
            fullWidth 
            value={formData.transmission}
            onChange={e => setFormData({...formData, transmission: e.target.value})}
          >
            <MenuItem value="Automatic">Automatic</MenuItem>
            <MenuItem value="Manual">Manual</MenuItem>
          </TextField>
          <TextField 
            select 
            label="Fuel Type" 
            fullWidth 
            value={formData.fuelType}
            onChange={e => setFormData({...formData, fuelType: e.target.value})}
          >
            <MenuItem value="Gasoline">Gasoline</MenuItem>
            <MenuItem value="Diesel">Diesel</MenuItem>
            <MenuItem value="Electric">Electric</MenuItem>
            <MenuItem value="Hybrid">Hybrid</MenuItem>
          </TextField>
        </div>
        <div className="flex gap-2 w-full">
          <TextField 
            label="Rent Price (฿/day)" 
            fullWidth 
            type="number"
            value={formData.rentPrice} 
            onChange={e => setFormData({...formData, rentPrice: e.target.value})} 
          />
          <TextField 
            select 
            label="Available" 
            fullWidth 
            value={formData.available ? "true" : "false"}
            onChange={e => setFormData({...formData, available: e.target.value === "true"})}
          >
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </TextField>
        </div>
        <TextField 
          label="Picture URL" 
          fullWidth 
          value={formData.picture} 
          onChange={e => setFormData({...formData, picture: e.target.value})} 
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting} sx={{ color: '#666' }}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={isSubmitting || !formData.licensePlate}
          sx={{ backgroundColor: '#FFD600', color: '#111111', '&:hover': { backgroundColor: '#e0b400' } }}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Car' : 'Create Car'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
