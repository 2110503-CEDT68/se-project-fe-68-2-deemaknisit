'use client';

import ProviderCatalog from "@/components/ProviderCatalog";
import { getProviders, createProvider, updateProvider, deleteProvider } from "@/libs/providerService";
import { getRoleFromToken } from "@/libs/authService";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from 'react'; 
import { ResponseList, Provider } from "@/types/interface";
import { Fab, Typography } from "@mui/material";
import ProviderDialog from "@/components/ProviderDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import NotificationDialog from "@/components/NotificationDialog";

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default function ProviderPage() {
  const { data: session } = useSession();
  const token = session?.user?.token as string;

  // Utilize the session role directly
  const isAdminUser = session?.user?.role === 'admin';

  const [providersData, setProvidersData] = useState<ResponseList<Provider> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [notification, setNotification] = useState<{ title: string; message: string; severity: 'success' | 'error' | 'info' } | null>(null);

  const [providerToDelete, setProviderToDelete] = useState<Provider | null>(null);

  const fetchProviders = useCallback(async () => {
    setIsLoading(true); 
    setError(null); 
    try {
      const providersResponse = await getProviders();
      setProvidersData(providersResponse); 
    } catch (err: any) {
      console.error("Failed to fetch providers:", err);
      setError(err.message || 'Failed to load providers.'); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleSaveProvider = async (payload: Partial<Provider>) => {
    const token = session?.user?.token as string;
    if (!token) {
      setNotification({ title: 'Login required', message: 'Please login first', severity: 'info' });
      return;
    }
    
    try {
      if (editingProvider) {
        await updateProvider(token, editingProvider._id, payload);
        setNotification({ title: 'Provider Updated', message: 'Provider details were updated successfully.', severity: 'success' });
      } else {
        await createProvider(token, payload);
        setNotification({ title: 'Provider Created', message: 'New provider was added successfully.', severity: 'success' });
      }

      closeDialog();
      await fetchProviders(); // Refresh list
    } catch (err: any) {
      setNotification({ title: 'Save Failed', message: err.message || 'Failed to save provider', severity: 'error' });
    }
  };

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (provider: Provider) => {
    setProviderToDelete(provider);
  };

  const handleDeleteConfirm = async () => {
    const token = session?.user?.token as string;
    if (!token || !providerToDelete) return;
    
    try {
      await deleteProvider(token, providerToDelete._id);
      await fetchProviders();
      setNotification({ title: 'Provider Deleted', message: 'Provider was removed from the system.', severity: 'success' });
    } catch (err: any) {
      setNotification({ title: 'Delete Failed', message: err.message || 'Failed to delete provider', severity: 'error' });
    } finally {
      setProviderToDelete(null);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingProvider(null);
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-20 px-8 relative overflow-hidden flex flex-col items-center"> 
        {/* Aesthetic Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-[40vh] bg-[#FFD600]/5 blur-[120px] rounded-full -mr-20 -mt-20 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-end w-full max-w-6xl mb-16 px-4">
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="w-8 h-[2px] bg-[#FFD600]" />
                <p className="text-[#FFD600] text-xs font-black uppercase tracking-[0.3em]">Premium Selection</p>
            </div>
            <h1 className="text-[#111111] text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                Our <br /> <span className="text-[#FFD600]">Providers</span>
            </h1>
        </div>

        <div className="flex-none flex flex-col items-end gap-2 max-w-xs text-right mt-4 md:mt-0">
            <p className="text-stone-400 text-sm font-bold leading-relaxed">
                Select from our world-class rental car providers to begin your journey.
            </p>
            <div className="px-4 py-1.5 bg-[#111111] text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                {providersData?.count} Verified Partners
            </div>
        </div>
      </div>
      
      {isLoading && (
        <div className="w-full max-w-6xl px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[400px] rounded-[32px] border border-stone-100 bg-white overflow-hidden shadow-sm flex flex-col">
              <div className="h-[55%] w-full bg-stone-100 animate-pulse" />
              <div className="p-6 flex flex-col gap-4">
                <div className="w-24 h-3 bg-stone-50 rounded-full animate-pulse" />
                <div className="w-48 h-6 bg-stone-100 rounded-lg animate-pulse" />
                <div className="mt-4 space-y-2">
                  <div className="w-full h-3 bg-stone-50 rounded-full animate-pulse" />
                  <div className="w-2/3 h-3 bg-stone-50 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div id="provider-page-error-message" className="text-center text-xl mt-10 text-red-500">{error}</div>
      )}

      {!isLoading && !error && providersData && (
        <ProviderCatalog 
          providersList={providersData} 
          isAdmin={isAdminUser}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        /> 
      )}

      {/* Logged-in Add Button (FAB) */}
      {isAdminUser && (
        <Fab 
          id="provider-page-add-button"
          color="primary" 
          aria-label="add" 
          onClick={() => setIsDialogOpen(true)}
          sx={{ position: 'fixed', bottom: 32, right: 32, backgroundColor: '#FFD600', color: '#111111', '&:hover': { backgroundColor: '#e0b400' } }}
        >
          <PlusIcon />
        </Fab>
      )}

      {/* Modular Dialogs */}
      {providerToDelete && (
        <ConfirmDeleteDialog 
          open={!!providerToDelete}
          title="Delete Provider"
          description={`Are you sure you want to delete ${providerToDelete.name}? This action cannot be undone.`}
          onClose={() => setProviderToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <ProviderDialog 
        open={isDialogOpen} 
        onClose={closeDialog} 
        onSave={handleSaveProvider} 
        initialData={editingProvider}
      />

      <NotificationDialog
        open={!!notification}
        title={notification?.title ?? ''}
        message={notification?.message ?? ''}
        severity={notification?.severity ?? 'info'}
        onClose={() => setNotification(null)}
      />
    </main>
  );
}
