'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ReviewListCard, { ReviewListData } from '@/components/ReviewListCard';
import { getMyReviews, getAllReviews } from '@/libs/reviewService';
import { Review, Booking } from '@/../interface';

export default function ReviewsPage() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState<'all' | 'personal'>('all');
  const [reviews, setReviews] = useState<ReviewListData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Allow unauthenticated users to view all reviews
    if (tab === 'personal' && status === 'unauthenticated') {
      setReviews([]);
      setLoading(false);
      return;
    }

    if (status === 'loading') return;

    // For personal tab, need authentication
    if (tab === 'personal' && !session?.user?.token) {
      setReviews([]);
      setLoading(false);
      return;
    }

    // For all tab, can fetch without authentication
    if (tab === 'all' && status === 'unauthenticated') {
      const fetchPublicReviews = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await getAllReviews('');
          
          if (response.success && response.data) {
            const transformedReviews = response.data.map((review: any) => ({
              reviewId: review._id,
              userName: review.user?.name || review.userName || 'Unknown User',
              rating: review.rating,
              comment: review.comment,
              carImage: review.car?.picture || '',
              carBrand: review.car?.brand || '',
              carModel: review.car?.model || '',
              carYear: review.car?.year || 0,
              licensePlate: review.car?.licensePlate || '',
              createdAt: review.createdAt,
            } as ReviewListData));
            setReviews(transformedReviews);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
          console.error('Error fetching reviews:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchPublicReviews();
      return;
    }

    if (!session?.user?.token) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        if (tab === 'personal') {
          response = await getMyReviews(session.user.token);
        } else {
          response = await getAllReviews(session.user.token);
        }

        if (response.success && response.data) {
          const transformedReviews = response.data.map((review: any) => ({
            reviewId: review._id,
            userName: review.user?.name || review.userName || 'Unknown User',
            rating: review.rating,
            comment: review.comment,
            carImage: review.car?.picture || '',
            carBrand: review.car?.brand || '',
            carModel: review.car?.model || '',
            carYear: review.car?.year || 0,
            licensePlate: review.car?.licensePlate || '',
            createdAt: review.createdAt,
          } as ReviewListData));
          setReviews(transformedReviews);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [session, status, tab]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center mt-16">
        <p className="text-stone-600">Loading...</p>
      </div>
    );
  }

  const isPersonalTabWithoutAuth = tab === 'personal' && status === 'unauthenticated';

  return (
    <main className="min-h-screen bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#111111] mb-2">Reviews</h1>
          <p className="text-stone-600">Browse car rental reviews from our community</p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 mb-8 border-b border-stone-200">
          <button
            onClick={() => setTab('all')}
            className={`px-6 py-3 font-semibold text-sm uppercase tracking-wide transition-all duration-300 border-b-2 ${
              tab === 'all'
                ? 'text-[#FFD600] border-[#FFD600]'
                : 'text-stone-600 border-transparent hover:text-[#111111]'
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => setTab('personal')}
            className={`px-6 py-3 font-semibold text-sm uppercase tracking-wide transition-all duration-300 border-b-2 ${
              tab === 'personal'
                ? 'text-[#FFD600] border-[#FFD600]'
                : 'text-stone-600 border-transparent hover:text-[#111111]'
            }`}
          >
            My Reviews
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-stone-600">Loading reviews...</p>
          </div>
        ) : isPersonalTabWithoutAuth ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-blue-700 font-semibold mb-4 text-lg">Sign in to view your reviews</p>
            <p className="text-blue-600 text-sm mb-6">You need to be logged in to view your personal reviews.</p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 bg-[#FFD600] text-[#111111] font-bold rounded-lg hover:bg-yellow-500 transition-colors duration-300"
            >
              Sign In
            </Link>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <p className="text-red-700 font-semibold mb-2">Error Loading Reviews</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-stone-600 text-lg">
              {tab === 'personal' ? 'You have not left any reviews yet.' : 'No reviews available.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewListCard key={review.reviewId} review={review} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
