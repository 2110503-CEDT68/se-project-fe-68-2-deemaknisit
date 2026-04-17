import { ResponseSingle, Review, ReviewPayload } from "@/../interface";

const baseUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || '/api/backend').replace(/\/$/, '');

export async function addBookingReview(
  token: string,
  bookingId: string,
  payload: ReviewPayload
): Promise<ResponseSingle<Review>> {
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
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit review");
    }
    throw new Error("The server returned an unexpected response. Please try again later.");
  }
  return await response.json();
}
