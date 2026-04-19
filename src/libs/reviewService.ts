import { ResponseList, ResponseSingle, Review, ReviewPayload } from "@/../interface";
import { baseUrl } from '../config/api';

// Submit a new review for a completed booking.
export async function addBookingReview(token: string, bookingId: string, payload: ReviewPayload): Promise<ResponseSingle<Review>> {
  const response = await fetch(`${baseUrl}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      bookingId,
      rating: payload.rating,
      comment: payload.comment,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to submit review");
  }
  return await response.json();
}

// Fetch only the reviews that belong to the current user.
export async function getMyReviews(token: string): Promise<ResponseList<Review>> {
  const response = await fetch(`${baseUrl}/reviews`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch reviews");
  }
  return await response.json();
}

// Fetch every review, typically for admin or catalog-level views.
export async function getAllReviews(): Promise<ResponseList<Review>> {
  const response = await fetch(`${baseUrl}/reviews?all=true`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch all reviews");
  }
  return await response.json();
}

// Fetch all reviews for a specific car.
export async function getCarReviews(carId: string): Promise<ResponseList<Review>> {
  const response = await fetch(`${baseUrl}/cars/${carId}/reviews`, {
    method: "GET",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch car reviews");
  }
  return await response.json();
}

// Fetch one review by its review ID.
export async function getReviewById(token: string, reviewId: string): Promise<ResponseSingle<Review>> {
  const response = await fetch(`${baseUrl}/reviews/${reviewId}`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch review");
  }
  return await response.json();
}

// Update an existing review's content by review ID.
export async function updateReview(token: string, reviewId: string, payload: ReviewPayload): Promise<ResponseSingle<Review>> {
  const response = await fetch(`${baseUrl}/reviews/${reviewId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update review");
  }
  return await response.json();
}

// Remove a review by review ID.
export async function deleteReview(token: string, reviewId: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${baseUrl}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete review");
  }
  return await response.json();
}
