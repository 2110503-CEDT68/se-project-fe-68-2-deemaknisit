'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getCar, getCarReviews } from '@/libs/carService';
import { getMyReviews } from '@/libs/reviewService';
import { Car, CarWithProvider, Review } from '@/types/interface';
import { decodeSafeUrl } from '@/libs/urlUtils';
import ReviewCard from '@/components/ReviewCard';
import { CircularProgress, Rating, Divider } from '@mui/material';
import { useSession } from 'next-auth/react';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog';
import ReviewSubmissionDialog from '@/components/ReviewSubmissionDialog';
import { updateReview, deleteReview } from '@/libs/reviewService';
import { addToWishlist, removeFromWishlist, getWishlist } from '@/libs/wishlistService';
import Link from 'next/link';

export default function CarDetailPage() {
    const { data: session } = useSession();
    const token = session?.user?.token;
    const currentUserId = session?.user?._id;

    const { id } = useParams<{ id: string }>();
    const [car, setCar] = useState<CarWithProvider | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);
    const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
    const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

    const refreshData = async () => {
        if (!id) return;
        try {
            const [carData, reviewsData] = await Promise.all([
                getCar(id),
                getCarReviews(id)
            ]);
            setCar(carData.data);
            setReviews(reviewsData.data);
        } catch (error) {
            console.error("Error fetching car details or reviews:", error);
        }
    };

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const [carData, reviewsData] = await Promise.all([
                    getCar(id),
                    getCarReviews(id)
                ]);
                setCar(carData.data);
                setReviews(reviewsData.data);
            } catch (error) {
                console.error("Error fetching car details or reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        const checkWishlist = async () => {
            if (!token || !id) return;
            try {
                const wishlist = await getWishlist(token);
                const item = wishlist.data.find((i: any) => i._id === id);
                if (item) setWishlistItemId(item.wishlistItemId || item._id);
            } catch (e) {
                console.error("Error checking wishlist status:", e);
            }
        };

        fetchData();
        checkWishlist();
    }, [id, token]);

    const handleWishlistToggle = async () => {
        if (!token || !id) return;
        setIsWishlistLoading(true);
        try {
            if (wishlistItemId) {
                await removeFromWishlist(token, wishlistItemId);
                setWishlistItemId(null);
            } else {
                const res = await addToWishlist(token, id);
                setWishlistItemId(res.data._id);
            }
        } catch (e) {
            console.error("Wishlist toggle error:", e);
        } finally {
            setIsWishlistLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="flex flex-col items-center bg-white min-h-screen">
                <div className="w-full h-80 bg-stone-100 animate-pulse relative" />
                <div className="w-full max-w-5xl -mt-20 px-8 relative z-10">
                    <div className="bg-white rounded-[40px] p-10 shadow-xl border border-stone-100 space-y-8">
                        <div className="flex flex-col md:flex-row gap-12">
                            <div className="w-full md:w-[400px] h-[300px] bg-stone-100 rounded-[32px] animate-pulse" />
                            <div className="flex-grow space-y-6 flex flex-col justify-center">
                                <div className="h-4 w-32 bg-stone-100 rounded-full animate-pulse" />
                                <div className="h-16 w-full bg-stone-100 rounded-2xl animate-pulse" />
                                <div className="h-10 w-2/3 bg-stone-100 rounded-2xl animate-pulse" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="h-24 bg-stone-50 rounded-3xl border border-stone-100 animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!car) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-white">
                <h1 className="text-2xl font-black text-[#111111] uppercase tracking-widest">Car Not Found</h1>
            </div>
        );
    }

    const averageRating = reviews.length > 0 
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
        : 0;

    return (
        <main className="bg-white min-h-screen pb-20">
            {/* Hero Section */}
            <div className="relative w-full h-[50vh] bg-stone-900 overflow-hidden">
                <Image
                    src={decodeSafeUrl(car.picture) || '/img/logo.png'}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-8 pb-12">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-[#FFD600] text-[#111111] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {car.year} Model
                            </span>
                            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                                {car.transmission}
                            </span>
                        </div>
                        <h1 className="text-white text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                            {car.brand} <span className="text-[#FFD600]">{car.model}</span>
                        </h1>
                        <p className="text-white/80 font-bold uppercase tracking-[0.3em] mt-2">{car.licensePlate}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Details Section */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h2 className="text-[10px] font-black text-[#FFD600] uppercase tracking-[0.4em] mb-4">Specifications</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: 'Color', value: car.color },
                                { label: 'Fuel Type', value: car.fuelType },
                                { label: 'Transmission', value: car.transmission },
                                { label: 'Daily Rate', value: `฿${car.rentPrice}` }
                            ].map((spec, i) => (
                                <div key={i} className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{spec.label}</p>
                                    <p className="text-[#111111] font-black text-lg">{spec.value}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <Divider />

                    {/* Reviews Section */}
                    <section id="reviews">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-[10px] font-black text-[#FFD600] uppercase tracking-[0.4em] mb-2">Guest Experiences</h2>
                                <h3 className="text-4xl font-black text-[#111111] tracking-tight">Reviews ({reviews.length})</h3>
                            </div>
                            {reviews.length > 0 && (
                                <div className="text-right">
                                    <div className="flex items-center gap-2 justify-end">
                                        <Rating value={averageRating} readOnly precision={0.5} />
                                        <span className="text-2xl font-black text-[#111111]">{averageRating.toFixed(1)}</span>
                                    </div>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Average Rating</p>
                                </div>
                            )}
                        </div>

                        {reviews.length === 0 ? (
                            <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-[32px] p-16 text-center">
                                <p className="text-stone-400 font-bold italic text-lg uppercase tracking-widest">No reviews yet for this vehicle</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {reviews.map((review) => {
                                    const reviewOwnerId = (review.userId as any)?._id || review.userId || (review as any).user?._id || (review as any).user;
                                    const isOwner = currentUserId && String(reviewOwnerId) === String(currentUserId);
                                    
                                    return (
                                        <ReviewCard 
                                            key={review._id} 
                                            review={review} 
                                            showUser={true} 
                                            onEdit={isOwner ? () => setReviewToEdit(review) : undefined}
                                            onDelete={isOwner ? () => setReviewToDelete(review) : undefined}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar / Call to Action */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-[#111111] rounded-[40px] p-10 shadow-2xl text-white border border-white/10 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD600] rounded-full blur-[80px] opacity-20 -mr-16 -mt-16" />
                        
                        <span className="text-[#FFD600] text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Premium Rental</span>
                        <div className="mb-8">
                            <p className="text-4xl font-black italic tracking-tighter">฿{car.rentPrice}<span className="text-sm font-bold uppercase tracking-widest text-[#FFD600] ml-2">/ Day</span></p>
                        </div>

                        <div className="space-y-4 mb-10">
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Availability</span>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${car.available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {car.available ? 'Ready to Drive' : 'Reserved'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-white/10">
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Provider</span>
                                <span className="text-xs font-black uppercase text-[#FFD600]">{car.provider?.name || 'Authorized Dealer'}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Link 
                                href={`/bookings?tab=new&carId=${id}`}
                                className={`flex-grow py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-300 text-center ${
                                    car.available 
                                    ? 'bg-[#FFD600] text-[#111111] hover:bg-white hover:scale-[1.02] shadow-[0_20px_40px_-10px_rgba(255,214,0,0.3)]' 
                                    : 'bg-stone-800 text-stone-500 cursor-not-allowed pointer-events-none'
                                }`}
                            >
                                {car.available ? 'Book This Car' : 'Currently Unavailable'}
                            </Link>

                            {token && (
                                <button 
                                    onClick={handleWishlistToggle}
                                    disabled={isWishlistLoading}
                                    className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                                        wishlistItemId 
                                        ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' 
                                        : 'bg-transparent border-white/20 text-white hover:border-[#ef4444] hover:text-[#ef4444]'
                                    } ${isWishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill={wishlistItemId ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                </button>
                            )}
                        </div>

                        <p className="text-[9px] text-center text-stone-500 font-bold uppercase tracking-widest mt-6 italic">Secure checkout powered by Ratatouille</p>
                    </div>
                </div>
            </div>

            {/* Review Edit Dialog */}
            <ReviewSubmissionDialog 
                open={!!reviewToEdit}
                onClose={() => setReviewToEdit(null)}
                onSave={async (rating, comment) => {
                    if (!token || !reviewToEdit) return;
                    await updateReview(token, reviewToEdit._id, { rating, comment });
                    setReviewToEdit(null);
                    alert("Review updated successfully!");
                    await refreshData();
                }}
                bookingDescription={`${car.brand} ${car.model}`}
                initialData={reviewToEdit}
            />

            {/* Review Delete Confirmation */}
            {reviewToDelete && (
                <ConfirmDeleteDialog 
                    open={!!reviewToDelete}
                    title="Delete Review"
                    description="Are you sure you want to delete your review? This action cannot be undone."
                    onConfirm={async () => {
                        if (!token || !reviewToDelete) return;
                        await deleteReview(token, reviewToDelete._id);
                        setReviewToDelete(null);
                        alert("Review deleted successfully.");
                        await refreshData();
                    }}
                    onClose={() => setReviewToDelete(null)}
                />
            )}
        </main>
    );
}
