/**
 * Wishlist Service
 * Handles all wishlist-related API calls
 */

import { baseUrl } from '../config/api';

function getErrorMessage(error: unknown, fallback: string) {
  if (!error) return fallback;
  if (typeof error === 'string') return error;

  const e = error as { message?: string; msg?: string };
  return e.message || e.msg || fallback;
}

async function parseJsonResponse(response: Response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function addToWishlist(token: string, providerId: string) {
  const response = await fetch(`${baseUrl}/wishlist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ providerId }),
  });

  if (!response.ok) {
    const error = await parseJsonResponse(response);
    throw new Error(getErrorMessage(error, 'Failed to add to wishlist'));
  }

  return await parseJsonResponse(response);
}

export async function removeFromWishlist(token: string, wishlistItemId: string) {
  const response = await fetch(`${baseUrl}/wishlist/${wishlistItemId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await parseJsonResponse(response);
    throw new Error(getErrorMessage(error, 'Failed to remove from wishlist'));
  }

  return await parseJsonResponse(response);
}

export async function getWishlist(token: string) {
  const response = await fetch(`${baseUrl}/wishlist`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await parseJsonResponse(response);
    throw new Error(getErrorMessage(error, 'Failed to fetch wishlist'));
  }

  return await parseJsonResponse(response);
}

export async function checkIfInWishlist(token: string, providerId: string) {
  try {
    const data = await getWishlist(token);
    const wishlistItems = data.data || [];
    return wishlistItems.find((item: any) => item.providerId?._id === providerId || item.providerId === providerId);
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return null;
  }
}
