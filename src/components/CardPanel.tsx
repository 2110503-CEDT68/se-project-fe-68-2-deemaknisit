"use client";
import { useReducer } from "react";
import Link from "next/link";
import ProviderCard from "./ProviderCard";

// Mock Data for Demonstration Only
const mockProviderRepo = [
  { pid: "001", name: "Premium Car Rental", image: "/img/bloom.jpg" },
  { pid: "002", name: "City Drive", image: "/img/sparkspace.jpg" },
  { pid: "003", name: "Luxury Wheels", image: "/img/grandtable.jpg" },
];

type RatingMap = Map<string, number>;

type Action =
  | { type: "SET_RATING"; provider: string; rating: number }
  | { type: "REMOVE_PROVIDER"; provider: string };

function reducer(state: RatingMap, action: Action): RatingMap {
  const next = new Map(state);
  if (action.type === "SET_RATING") {
    next.set(action.provider, action.rating);
  } else if (action.type === "REMOVE_PROVIDER") {
    next.delete(action.provider);
  }
  return next;
}

const initialState: RatingMap = new Map(
  mockProviderRepo.map((v) => [v.name, 0])
);

export default function CardPanel() {
  const [ratingMap, dispatch] = useReducer(reducer, initialState);

  const handleRatingChange = (provider: string, rating: number) => {
    dispatch({ type: "SET_RATING", provider, rating });
  };

  const handleRemoveProvider = (provider: string) => {
    dispatch({ type: "REMOVE_PROVIDER", provider });
  };

  return (
    <div className="w-full flex flex-col items-center p-4">
      {/* Cards row - each Card wrapped in Link to /provider/[pid] */}
      <div className="m-5 flex flex-row flex-wrap justify-around content-around gap-5">
        {mockProviderRepo.map((providerItem) => (
          <Link
            key={providerItem.pid}
            href={`/provider/${providerItem.pid}`}
          >
            <ProviderCard
              providerName={providerItem.name}
              imgSrc={providerItem.image}
            />
          </Link>
        ))}
      </div>

      {/* Provider list with ratings */}
      <div className="w-full max-w-2xl px-8 py-6 mt-8 bg-white rounded-2xl shadow-md border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          Provider List with Ratings
          <span className="bg-cyan-100 text-cyan-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">
            {ratingMap.size}
          </span>
        </h3>
        <div className="space-y-2">
          {Array.from(ratingMap.entries()).map(([provider, rating]) => (
            <div
              key={provider}
              data-testid={provider}
              className="flex justify-between items-center p-3 cursor-pointer bg-gray-50 hover:bg-cyan-50 border border-transparent hover:border-cyan-200 rounded-xl transition-all duration-200"
              onClick={() => handleRemoveProvider(provider)}
            >
              <span className="font-medium text-gray-700">{provider}</span>
              <span className="text-gray-500 font-semibold">{rating} ★</span>
            </div>
          ))}
          {ratingMap.size === 0 && (
            <p className="text-gray-500 text-center py-4 italic">No providers selected.</p>
          )}
        </div>
      </div>
    </div>
  );
}
