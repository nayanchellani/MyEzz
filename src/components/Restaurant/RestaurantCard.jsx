import React from 'react';
import { StarIcon, HeartIcon } from '../Shared/Icons';
import { getRestaurantDistance } from '../../utils/distance';

const RestaurantCard = ({
    name,
    distance,
    cuisines,
    rating,
    reviews,
    delivery_time,
    image_url,
    onClick,
    isFavorite,
    onToggleFavorite,
    userLocation,
    ...restaurantProps
}) => {
    // Calculate distance if userLocation is available, otherwise use the provided distance
    const calculatedDistance = userLocation 
        ? getRestaurantDistance(userLocation, { ...restaurantProps, latitude: restaurantProps.latitude, longitude: restaurantProps.longitude })
        : distance;
    
    const displayDistance = calculatedDistance !== null ? calculatedDistance : distance;

    return (
    <div
        onClick={onClick}
        className="hologram-card group relative bg-white dark:bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]
                 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800
                 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-md hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-2xl transition-all duration-300
                 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
    >
        <div className="relative h-48 sm:h-52 overflow-hidden">
            <img
                src={image_url}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                        "https://placehold.co/600x400/cccccc/ffffff?text=Image+Missing";
                }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute bottom-3 left-3 flex items-center gap-1
                        bg-[#059669] dark:bg-emerald-600 text-white px-3 py-1 rounded-xl
                        text-sm font-semibold shadow-lg">
                <StarIcon className="w-4 h-4" />
                {rating}
            </div>

            {/* FAVORITE */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                }}
                className={`absolute top-3 right-3 w-11 h-11 rounded-full
                     bg-white/90 dark:bg-gray-900/80 backdrop-blur-md
                     flex items-center justify-center shadow-lg
                     transition-all duration-300 
                     hover:scale-110 active:scale-90
                     ${isFavorite ? 'animate-favorite-pop' : ''}`}
            >
                <span
                    className={`transition-all duration-300 transform ${isFavorite
                        ? "text-red-500 scale-110"
                        : "text-gray-400 hover:text-red-400 scale-100"
                        }`}
                >
                    <HeartIcon filled={isFavorite} />
                </span>
                {isFavorite && (
                    <span className="absolute inset-0 rounded-full animate-ping-once bg-red-400/30"></span>
                )}
            </button>
        </div>

        {/* CONTENT */}
        <div className="p-5 flex flex-col flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] dark:text-gray-100
                       line-clamp-1 group-hover:text-orange-500 transition-colors">
                {name}
            </h3>

            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                {cuisines ? cuisines.join(", ") : "Cuisine not available"}
            </p>

            {/* META */}
            <div className="mt-auto pt-4 flex justify-between items-center
                        text-sm text-gray-600 dark:text-gray-400
                        border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{displayDistance !== null && displayDistance !== undefined ? `${displayDistance} km` : 'N/A'}</span>
                </div>

                <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{delivery_time} mins</span>
                </div>
            </div>

            <button
                className="relative overflow-hidden w-full mt-5 py-3 rounded-2xl
             font-semibold text-white text-sm sm:text-base
             bg-gradient-to-br from-orange-500 to-orange-600
             shadow-[0_6px_18px_rgba(249,115,22,0.35)]
             transition-all duration-300
             hover:shadow-[0_10px_28px_rgba(249,115,22,0.55)]
             hover:scale-[1.02] active:scale-[0.97]
             group/button"
            >

                <span className="absolute inset-x-0 top-0 h-1/3
                   bg-gradient-to-b from-white/20 to-transparent" />


                <span className="absolute inset-0 -translate-x-full
                   bg-gradient-to-r from-transparent via-white/25 to-transparent
                   group-hover/button:translate-x-full
                   transition-transform duration-700" />

                <span className="relative z-10">View Menu</span>
            </button>

        </div>
    </div>
    );
};

export default RestaurantCard;
