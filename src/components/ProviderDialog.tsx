import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { Provider } from "@/types/interface";
import { encodeSafeUrl, decodeSafeUrl } from "@/libs/urlUtils";

interface ProviderDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Partial<Provider>) => Promise<void>;
  initialData: Provider | null;
}

export default function ProviderDialog({
  open,
  onClose,
  onSave,
  initialData,
}: ProviderDialogProps) {
  const [formData, setFormData] = useState({
    name: '', address: '', district: '', province: '',
    postalcode: '', tel: '', region: '', picture: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          address: initialData.address || '',
          district: initialData.district || '',
          province: initialData.province || '',
          postalcode: initialData.postalcode || '',
          tel: initialData.tel || '',
          region: initialData.region || '',
          picture: decodeSafeUrl(initialData.picture || '')
        });
      } else {
        setFormData({
          name: '', address: '', district: '', province: '',
          postalcode: '', tel: '', region: '', picture: ''
        });
      }
    }
  }, [open, initialData]);

  const handleSave = async () => {
    if (!formData.name) return alert('Name is required');
    
    setIsSubmitting(true);
    try {
      const payload: Partial<Provider> = {
        ...formData,
        picture: encodeSafeUrl(formData.picture)
      };
      await onSave(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog id="provider-dialog" open={open} onClose={!isSubmitting ? onClose : undefined} fullWidth maxWidth="sm">
      <DialogTitle id="provider-dialog-title" sx={{ fontWeight: 'bold' }}>
        {initialData ? 'Edit Provider' : 'Add New Provider'}
      </DialogTitle>
      <DialogContent id="provider-form" component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '20px !important' }}>
        <TextField 
          id="provider-name-input"
          label="Provider Name" 
          fullWidth 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
        />
        <TextField 
          id="provider-address-input"
          label="Address" 
          fullWidth 
          value={formData.address} 
          onChange={e => setFormData({...formData, address: e.target.value})} 
        />
        <div className="flex gap-2 w-full">
          <TextField 
            id="provider-district-input"
            label="District" 
            fullWidth 
            value={formData.district} 
            onChange={e => setFormData({...formData, district: e.target.value})} 
          />
          <TextField 
            id="provider-province-input"
            label="Province" 
            fullWidth 
            value={formData.province} 
            onChange={e => setFormData({...formData, province: e.target.value})} 
          />
        </div>
        <div className="flex gap-2 w-full">
          <TextField 
            id="provider-postalcode-input"
            label="Postal Code" 
            fullWidth 
            value={formData.postalcode} 
            onChange={e => setFormData({...formData, postalcode: e.target.value})} 
          />
          <TextField 
            id="provider-region-input"
            label="Region" 
            fullWidth 
            value={formData.region} 
            onChange={e => setFormData({...formData, region: e.target.value})} 
          />
        </div>
        <TextField 
          id="provider-tel-input"
          label="Telephone" 
          fullWidth 
          value={formData.tel} 
          onChange={e => setFormData({...formData, tel: e.target.value})} 
        />
        <TextField 
          id="provider-picture-input"
          label="Picture URL" 
          fullWidth 
          value={formData.picture} 
          onChange={e => setFormData({...formData, picture: e.target.value})} 
        />
      </DialogContent>
      <DialogActions id="provider-dialog-actions" sx={{ p: 2 }}>
        <Button id="provider-cancel-button" onClick={onClose} disabled={isSubmitting} sx={{ color: '#666' }}>Cancel</Button>
        <Button 
          id="provider-save-button"
          onClick={handleSave} 
          variant="contained" 
          disabled={isSubmitting || !formData.name}
          sx={{ backgroundColor: '#FFD600', color: '#111111', '&:hover': { backgroundColor: '#e0b400' } }}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Provider' : 'Create Provider'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
