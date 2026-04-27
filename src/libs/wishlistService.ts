/**
 * Wishlist Service
 * Handles all wishlist-related API calls for cars
 */

import { ResponseList, ResponseSingle, Wishlist, CarWithProvider } from "@/types/interface";
import { baseUrl } from '../config/api';

export async function addToWishlist(token: string, carId: string): Promise<ResponseSingle<Wishlist>> {
  const response = await fetch(`${baseUrl}/wishlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ carId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to add to wishlist');
  }

  return await response.json();
}

export async function removeFromWishlist(token: string, wishlistItemId: string): Promise<ResponseSingle<{}>> {
  const response = await fetch(`${baseUrl}/wishlist/${wishlistItemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to remove from wishlist');
  }

  return await response.json();
}

export async function getWishlist(token: string): Promise<ResponseList<CarWithProvider & { wishlistItemId: string }>> {
  const response = await fetch(`${baseUrl}/wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch wishlist');
  }

  return await response.json();
}

export async function checkIfInWishlist(token: string, carId: string): Promise<(CarWithProvider & { wishlistItemId: string }) | null> {
  try {
    const data = await getWishlist(token);
    const wishlistItems = data.data || [];
    return wishlistItems.find((item) => item._id === carId) ?? null;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return null;
  }
}
