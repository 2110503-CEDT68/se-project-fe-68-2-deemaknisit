'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getWishlist, removeFromWishlist } from '@/libs/wishlistService';
import { decodeSafeUrl } from '@/libs/urlUtils';

type WishlistProvider = {
  _id: string;
  name: string;
  address?: string;
  district?: string;
  province?: string;
  tel?: string;
  picture?: string;
};

type WishlistItem = {
  _id: string;
  providerId: WishlistProvider | string;
  createdAt?: string;
};

function WishlistCard({
  item,
  onRemove,
  removing,
}: {
  item: WishlistItem;
  onRemove: (id: string) => void;
  removing: boolean;
}) {
  const provider = typeof item.providerId === 'string' ? null : item.providerId;
  const providerId = provider?._id || (typeof item.providerId === 'string' ? item.providerId : '');
  const location = [provider?.address, provider?.district, provider?.province].filter(Boolean).join(', ');
  const imageSrc = decodeSafeUrl(provider?.picture || '/img/logo.png');

  return (
    <article className="group overflow-hidden rounded-[28px] border border-stone-100 bg-white shadow-[0_20px_60px_-24px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-24px_rgba(0,0,0,0.24)]">
      <div className="relative h-56 overflow-hidden bg-stone-100">
        <Image
          src={imageSrc}
          alt={provider?.name || 'Wishlist provider'}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#FFD600]">Saved Provider</p>
            <h2 className="mt-1 text-2xl font-black italic uppercase leading-none text-white">
              {provider?.name || 'Unknown Provider'}
            </h2>
          </div>
          <div className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-white backdrop-blur-md">
            Wishlist
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-6">
        <div className="space-y-2">
          {location && (
            <p className="text-sm font-medium leading-relaxed text-stone-600">{location}</p>
          )}
          {provider?.tel && (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
              Tel: {provider.tel}
            </p>
          )}
          {item.createdAt && (
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300">
              Saved on {new Date(item.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={providerId ? `/provider/${providerId}` : '/provider'}
            className="inline-flex items-center justify-center rounded-full bg-[#111111] px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-[#FFD600] hover:text-[#111111]"
          >
            View Provider
          </Link>

          <button
            type="button"
            onClick={() => onRemove(item._id)}
            disabled={removing}
            className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.25em] text-red-600 transition-all duration-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {removing ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const token = session?.user?.token as string | undefined;

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadWishlist = useCallback(async () => {
    if (!token) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getWishlist(token);
      setItems((response?.data || []) as WishlistItem[]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load wishlist';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (status === 'loading') return;
    void loadWishlist();
  }, [status, loadWishlist]);

  const handleRemove = async (itemId: string) => {
    if (!token) return;

    try {
      setRemovingId(itemId);
      await removeFromWishlist(token, itemId);
      setItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove item';
      setError(message);
    } finally {
      setRemovingId(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen bg-white px-6 pt-28 pb-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="h-14 w-72 rounded-2xl bg-stone-100 animate-pulse" />
          <div className="h-6 w-96 rounded-full bg-stone-100 animate-pulse" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="h-96 rounded-[28px] bg-stone-100 animate-pulse" />
            <div className="h-96 rounded-[28px] bg-stone-100 animate-pulse" />
            <div className="h-96 rounded-[28px] bg-stone-100 animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-white px-6 pt-28 pb-16">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-blue-100 bg-blue-50 p-10 text-center shadow-[0_20px_60px_-30px_rgba(59,130,246,0.35)]">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-blue-500">Wishlist</p>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#111111]">
            Please sign in first
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-relaxed text-blue-700">
            Your saved providers will appear here after you log in.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#111111] px-6 py-3 text-[11px] font-black uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-[#FFD600] hover:text-[#111111]"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 pt-28 pb-16 relative overflow-hidden">
      <div className="absolute right-0 top-0 h-1 w-1/3 bg-[#FFD600]" />
      <div className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-stone-50 blur-3xl opacity-60" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-[2px] w-8 bg-[#FFD600]" />
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#FFD600]">Personal Collection</p>
            </div>
            <h1 className="text-5xl font-black italic uppercase leading-none tracking-tighter text-[#111111] md:text-7xl">
              My <span className="text-[#FFD600]">Wishlist</span>
            </h1>
            <p className="max-w-2xl text-sm font-medium leading-relaxed text-stone-500">
              Save providers you like and come back to them anytime.
            </p>
          </div>

          <div className="rounded-[24px] border border-stone-100 bg-white px-6 py-4 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.22)]">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-stone-400">Saved Providers</p>
            <p className="mt-2 text-3xl font-black text-[#111111]">{items.length}</p>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {items.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-stone-200 bg-stone-50 px-8 py-16 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-stone-400">Nothing here yet</p>
            <h2 className="mt-4 text-3xl font-black italic uppercase tracking-tighter text-[#111111]">
              Your wishlist is empty
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm font-medium leading-relaxed text-stone-500">
              Browse providers and tap the wishlist button on a provider page to save it here.
            </p>
            <Link
              href="/provider"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#111111] px-6 py-3 text-[11px] font-black uppercase tracking-[0.25em] text-white transition-all duration-300 hover:bg-[#FFD600] hover:text-[#111111]"
            >
              Browse Providers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <WishlistCard
                key={item._id}
                item={item}
                onRemove={handleRemove}
                removing={removingId === item._id}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
