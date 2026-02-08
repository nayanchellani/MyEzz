import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Dices, Heart, UtensilsCrossed, Building2, X } from 'lucide-react';
import FoodDeliveryLoader from '../Shared/FoodDeliveryLoader';
import Sidebar from './Sidebar';
import RestaurantCard from '../Restaurant/RestaurantCard';
import SurpriseMe from '../SurpriseMe/SurpriseMe';
import LocationSelector from '../Shared/LocationSelector';
import { FilterIcon } from '../Shared/Icons';
import { useDebounce } from '../../hooks/useDebounce';

const HomePageContent = ({ searchQuery, setSearchQuery, cartItems, setCartItems, showToastMessage, onSurpriseMe }) => {
    const navigate = useNavigate();
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });
    const [showFavorites, setShowFavorites] = useState(false);
    const [dishes, setDishes] = useState([]);
    const [showAllDishes, setShowAllDishes] = useState(false);
    const [showAllRestaurants, setShowAllRestaurants] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [userLocation, setUserLocation] = useState(() => {
        const saved = localStorage.getItem('userLocation');
        return saved ? JSON.parse(saved) : null;
    });
    const [showVegetarian, setShowVegetarian] = useState(false);
    const [vegRestaurantIds, setVegRestaurantIds] = useState([]);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Fetch restaurants that have vegetarian items
    useEffect(() => {
        async function fetchVegRestaurants() {
            const { data, error } = await supabase
                .from('menu_items')
                .select('restaurant_id')
                .eq('is_veg', true);

            if (!error && data) {
                // Get unique restaurant IDs
                const uniqueIds = [...new Set(data.map(item => item.restaurant_id))];
                setVegRestaurantIds(uniqueIds);
            }
        }
        fetchVegRestaurants();
    }, []);

    const handleLocationSelect = (location) => {
        setUserLocation(location);
        localStorage.setItem('userLocation', JSON.stringify(location));
    };

    const toggleFavorite = (restaurantId) => {
        const isCurrentlyFavorite = favorites.includes(restaurantId);
        const restaurant = restaurants.find(r => r.id === restaurantId);

        setFavorites(prev => {
            const newFavorites = isCurrentlyFavorite
                ? prev.filter(id => id !== restaurantId)
                : [...prev, restaurantId];
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });

        if (isCurrentlyFavorite) {
            showToastMessage(`${restaurant?.name || 'Restaurant'} removed from favourites`);
        } else {
            showToastMessage(`${restaurant?.name || 'Restaurant'} added to favourites ❤️`);
        }
    };

    const addToCart = (dish) => {
        setCartItems(prevItems => {
            const restaurantName = dish.restaurants?.name || 'Unknown Restaurant';
            const itemExists = prevItems.find(i => i.id === dish.id && i.vendor === restaurantName);
            if (itemExists) {
                showToastMessage(`${dish.name} quantity updated in cart!`);
                return prevItems.map(i =>
                    i.id === dish.id && i.vendor === restaurantName
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            showToastMessage(`${dish.name} added to cart!`);
            return [...prevItems, { 
                ...dish, 
                quantity: 1, 
                vendor: restaurantName, 
                restaurantName: restaurantName,
                restaurantImage: dish.restaurants?.image_url
            }];
        });
    };

    useEffect(() => {
        async function getRestaurants() {
            setLoading(true);
            let query;
            if (debouncedSearchQuery.trim() !== '') {
                if (/^\d+$/.test(debouncedSearchQuery.trim())) {
                    query = supabase.from('restaurants')
                        .select(`*, tags(name), cuisines(name)`)
                        .eq('id', parseInt(debouncedSearchQuery.trim()));
                } else {
                    query = supabase.rpc('search_restaurants', {
                        search_term: debouncedSearchQuery
                    });
                }
            } else {
                query = supabase.from('restaurants')
                    .select(`*, tags(name), cuisines(name)`)
                    .order('id', { ascending: true });
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching restaurants:', error);
                setRestaurants([]);
            } else {
                const formattedData = data.map(r => ({
                    ...r,
                    tags: r.tags ? r.tags.map(t => t.name) : [],
                    cuisines: r.cuisines ? r.cuisines.map(c => c.name) : [],
                }));
                setRestaurants(formattedData);
            }
            setLoading(false);
        }
        getRestaurants();
    }, [debouncedSearchQuery]);

    useEffect(() => {
        async function fetchDishes() {
            if (debouncedSearchQuery.trim() === '') {
                setDishes([]);
                return;
            }
            const { data, error } = await supabase
                .from('menu_items')
                .select('id, name, price, restaurant_id, restaurants(name, image_url)')
                .ilike('name', `%${debouncedSearchQuery}%`);
            if (error) {
                console.error('Error fetching dishes:', error);
                setDishes([]);
            } else {
                setDishes(data);
            }
        }
        fetchDishes();
    }, [debouncedSearchQuery]);

    const filteredRestaurants = restaurants.filter(restaurant => {

        const matchesCuisine = selectedCuisines.length === 0 ||
            selectedCuisines.some(c => restaurant.cuisines.includes(c));

        const matchesFavorite = !showFavorites || favorites.includes(restaurant.id);

        const isBeverageSelectedOnly = selectedCuisines.length === 1 && selectedCuisines.includes("Beverages");

        let matchesVegetarian;
        if (isBeverageSelectedOnly) {
            matchesVegetarian = true;
        } else {
            matchesVegetarian = !showVegetarian || vegRestaurantIds.includes(restaurant.id);
        }

        return matchesCuisine && matchesFavorite && matchesVegetarian;
    });

    if (loading) {
        return <FoodDeliveryLoader />;
    }

    return (
        <div className="flex items-center space-x-4 pb-6 scrollbar-hide px-2">
            <LocationSelector
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onLocationSelect={handleLocationSelect}
            />

            <Sidebar
                selectedCuisines={selectedCuisines}
                setSelectedCuisines={setSelectedCuisines}
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                showFavorites={showFavorites}
                setShowFavorites={setShowFavorites}
                showVegetarian={showVegetarian}
                setShowVegetarian={setShowVegetarian}
                onSurpriseMe={onSurpriseMe}
            />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
                <div className="hidden md:block mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-gray-200">What's on your mind?</h2>
                    </div>

                    <div className="hidden md:flex items-center space-x-3 sm:space-x-4 overflow-x-auto pb-6 scrollbar-hide px-1 sm:px-2">
                        {["Jain", "Non-Jain", "Beverages"].map(cuisine => {
                            const isSelected = selectedCuisines.includes(cuisine);
                            return (
                                <button
                                    key={cuisine}
                                    onClick={() => {
                                        setSelectedCuisines(prev =>
                                            prev.includes(cuisine)
                                                ? prev.filter(c => c !== cuisine)
                                                : [...prev, cuisine]
                                        );
                                    }}
                                    className={`
                                        group flex-shrink-0 px-6 py-3 text-sm font-medium rounded-xl border whitespace-nowrap
                                        transition-all duration-300 ease-out backdrop-blur-md
                                        hover:shadow-lg
                                        ${isSelected
                                            ? 'bg-orange-500 text-white border-orange-400 shadow-[0_8px_20px_rgba(249,115,22,0.4)] scale-105'
                                            : 'bg-white dark:bg-gray-800/40 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700/50 hover:border-orange-400 shadow-sm hover:shadow-md'
                                        }
                                        active:scale-95
                                    `}
                                >
                                    {cuisine}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setShowVegetarian(!showVegetarian)}
                            className={`
                                group flex-shrink-0 px-6 py-3 text-sm font-medium rounded-xl border whitespace-nowrap
                                transition-all duration-300 ease-out backdrop-blur-md
                                hover:shadow-lg
                                ${showVegetarian
                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-[0_8px_20px_rgba(16,185,129,0.4)] scale-105'
                                    : 'bg-white dark:bg-gray-800/40 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700/50 hover:border-emerald-400 shadow-sm hover:shadow-md'
                                }
                                active:scale-95
                            `}
                        >
                            Vegetarian
                        </button>

                        <button
                            onClick={() => setShowFavorites(!showFavorites)}
                            className={`
                                group flex-shrink-0 px-6 py-3 text-sm font-medium rounded-xl border whitespace-nowrap
                                flex items-center gap-2 transition-all duration-300 ease-out backdrop-blur-md
                                hover:shadow-lg
                                ${showFavorites
                                    ? 'bg-rose-500 text-white border-rose-400 shadow-[0_8px_20px_rgba(244,63,94,0.4)] scale-105'
                                    : 'bg-white dark:bg-gray-800/40 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700/50 hover:border-rose-400 shadow-sm hover:shadow-md'
                                }
                                active:scale-95
                            `}
                        >
                            <Heart className={`w-5 h-5 transition-transform duration-300 ${showFavorites ? 'scale-110 fill-current' : 'group-hover:scale-120'}`} />
                            Favourites
                        </button>

                        {(selectedCuisines.length > 0 || showFavorites || showVegetarian) && (
                            <button
                                onClick={() => {
                                    setSelectedCuisines([]);
                                    setShowFavorites(false);
                                    setShowVegetarian(false);
                                }}
                                className="group flex-shrink-0 px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-500 transition-all duration-200 whitespace-nowrap flex items-center gap-1"
                            >
                                <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
                                Clear All
                            </button>
                        )}
                        <button
                            onClick={onSurpriseMe}
                            className="group flex-shrink-0 px-6 py-3 text-sm font-black rounded-2xl border-2 whitespace-nowrap
                                flex items-center gap-2 transition-all duration-300 ease-out backdrop-blur-md
                                bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400/50
                                hover:shadow-[0_10px_25px_rgba(249,115,22,0.4)] active:scale-95
                                hidden md:flex"
                        >
                            <Dices className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="uppercase tracking-wider">Surprise Me</span>
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6 sm:mb-8">
                    <div className="flex items-center space-x-3">
                        <p className="hidden md:block text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
                            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
                        </p>
                        <button
                            onClick={onSurpriseMe}
                            className="md:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95"
                        >
                            <Dices className="w-5 h-5" />
                            <span>Surprise Me</span>
                        </button>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm transition-all active:scale-95"
                    >
                        <FilterIcon />
                        <span>Filters</span>
                    </button>
                </div>

                {searchQuery.trim() !== '' ? (
                    <div className="flex flex-col gap-8 mb-8">
                        <div className="bg-[hsl(var(--card))] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-bold mb-3 flex items-center justify-between cursor-pointer hover:text-orange-500 transition-colors" onClick={() => setShowAllDishes(!showAllDishes)}>
                                <span className="flex items-center gap-2">
                                    <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                                    Explore Dishes
                                </span>
                                <span className="text-sm text-gray-500">{showAllDishes ? 'Show Less' : 'View All'}</span>
                            </h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {(showAllDishes ? dishes : dishes.slice(0, 4)).map(d => (
                                    <li key={d.id} onClick={() => addToCart(d)} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800 transition-all cursor-pointer group hover:shadow-md">
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-orange-600 transition-colors">{d.name}</p>
                                            {d.restaurants && <p className="text-xs text-gray-500 line-clamp-1">from {d.restaurants.name}</p>}
                                            {d.price && <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-1">₹{d.price}</p>}
                                        </div>
                                        <button className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {dishes.length === 0 && <p className="text-gray-500 text-sm mt-2">No dishes found matching "{searchQuery}"</p>}
                        </div>

                        <div className="bg-[hsl(var(--card))] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-bold mb-3 flex items-center justify-between cursor-pointer hover:text-orange-500 transition-colors" onClick={() => setShowAllRestaurants(!showAllRestaurants)}>
                                <span className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-orange-500" />
                                    Explore Restaurants
                                </span>
                                <span className="text-sm text-gray-500">{showAllRestaurants ? 'Show Less' : 'View All'}</span>
                            </h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {(showAllRestaurants ? filteredRestaurants : filteredRestaurants.slice(0, 4)).map(r => (
                                    <li key={r.id} onClick={() => { navigate('/restaurant/' + r.id); setSearchQuery(''); }} className="cursor-pointer p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800 transition-all hover:shadow-md">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={r.image_url}
                                                alt={r.name}
                                                className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200 dark:border-gray-700"
                                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100?text=IMG'; }}
                                            />
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{r.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{r.cuisines.join(', ')}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {filteredRestaurants.length === 0 && <p className="text-gray-500 text-sm mt-2">No restaurants found matching "{searchQuery}"</p>}
                        </div>
                    </div>
                ) : (
                    filteredRestaurants.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                            {filteredRestaurants.map((restaurant, index) => (
                                <div
                                    key={restaurant.id}
                                    className="animate-fade-in"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <RestaurantCard
                                        {...restaurant}
                                        onClick={() => {
                                            navigate('/restaurant/' + restaurant.id);
                                            setSearchQuery('');
                                        }}
                                        isFavorite={favorites.includes(restaurant.id)}
                                        onToggleFavorite={() => toggleFavorite(restaurant.id)}
                                        userLocation={userLocation}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 sm:py-24 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/10 rounded-3xl border-2 border-dashed border-orange-200 dark:border-orange-800 shadow-inner">
                            <UtensilsCrossed className="w-16 h-16 mx-auto mb-5 text-orange-400 animate-bounce" />
                            <p className="text-gray-800 dark:text-gray-200 font-bold text-xl mb-2">No restaurants found</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
                            {(selectedCuisines.length > 0 || showFavorites || showVegetarian || searchQuery.trim() !== '') && (
                                <button
                                    onClick={() => {
                                        setSelectedCuisines([]);
                                        setShowFavorites(false);
                                        setShowVegetarian(false);
                                        setShowFilters(false);
                                    }}
                                    className="mt-4 px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    )
                )}
            </main>
        </div>
    );
};

export default HomePageContent;