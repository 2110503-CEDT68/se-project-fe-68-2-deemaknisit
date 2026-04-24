/**
 * Wishlist Service
 * Handles all wishlist-related API calls
 */

export async function addToWishlist(token: string, providerId: string) {
  const response = await fetch('/api/backend/wishlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ providerId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add to wishlist');
  }

  return await response.json();
}

export async function removeFromWishlist(token: string, wishlistItemId: string) {
  const response = await fetch(`/api/backend/wishlist/${wishlistItemId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to remove from wishlist');
  }

  return await response.json();
}

export async function getWishlist(token: string) {
  const response = await fetch('/api/backend/wishlist', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch wishlist');
  }

  return await response.json();
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
