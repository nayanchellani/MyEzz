/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Wallet } from 'lucide-react';
import logo from './myezzlogopage0001removebgpreview2329-xmz0h-400w.png';
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient'; // Make sure this path is correct
import Footer from '../components/Footer';
import { useAuth } from '../auth/AuthContext';
import ThemeToggle from './ThemeToggle';
import { logOut } from '../auth/authService';
import Toast from './Toast';

// --- SVG ICONS (Your existing SVG components go here) ---
const SunIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-yellow-500 ${className}`}><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 ${className}`}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const StarIcon = ({ filled = true }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const HeartIcon = ({ filled }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${filled ? 'text-red-500 fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>;
const HomeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V16a1 1 0 01-.293.707l-2 2A1 1 0 0112 18v-1.586l-3.707-3.707A1 1 0 018 12V6a1 1 0 01-.293-.707L7 4H4a1 1 0 01-1-1z" /></svg>;
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const SearchIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const UserIcon = ({ className = "h-5 w-5 " }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;


const categoryFilters = [
    { name: 'Pizza', keywords: ['pizza', 'pizzatta'], image: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1756557648908-f3yzue48jb4-1756557650705_hsfuv5_screenshot_2025-08-3.png' },
    { name: 'Sandwich', keywords: ['sandwich', 'panini', 'bagel'], image: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1756552327686-rhswl7x25uh-1756552327877_35f5o9_screenshot_2025-08-3.png' },
    { name: 'Rolls & Wraps', keywords: ['roll', 'frankie', 'wrap'], image: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1756557561163-4v9aunjt71f-1756557563014_zdepzl_screenshot_2025-08-3.png' },
    { name: 'Burger', keywords: ['burger'], image: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1756557328450-pmk9jldolg-1756557330397_m33evn_screenshot_2025-08-3.png' },
    { name: 'Street Food', keywords: ['vada pav', 'samosa', 'dabeli', 'bhel', 'pakoda', 'dhokla', 'locho', 'khamani', 'patra', 'chaat', 'pav', 'pudla', 'bhurji', 'idli'], image: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1756557328450-pmk9jldolg-1756557330397_m33evn_screenshot_2025-08-3.png' },
    { name: 'Breads & Kulcha', keywords: ['kulcha', 'garlic bread', 'roti', 'naan', 'paratha', 'bun maska'], image: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1756557214213-k5uo08e6do-1756557215834_tm6edh_screenshot_2025-08-3.png' },
    { name: 'Chinese', keywords: ['noodles', 'manchurian', 'ramen', 'schezwan', 'hakka'], image: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1756556600027-5ktrv5mxz6b-1756556600301_mzvjpe_screenshot_2025-08-3.png' },
    { name: 'Momos', keywords: ['momos'], image: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1756557061089-powevnv8brq-1756557061231_soqr9p_screenshot_2025-08-3.png' },
    { name: 'Pasta', keywords: ['pasta', 'spaghetti'], image: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1756557131451-77u7ytc8hjh-1756557132811_xpym3t_screenshot_2025-08-3.png' },
    { name: 'Sushi', keywords: ['sushi'], image: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1756552882328-c8w8if74axq-1756552883691_shkbyo_screenshot_2025-08-3.png' },
    { name: 'Fries', keywords: ['fries', 'wedges', 'twister'], image: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1756552720273-nor1l0jr2w-1756552722137_2vbqus_screenshot_2025-08-3.png' },
    { name: 'Desserts', keywords: ['waffle', 'pastry', 'brownie', 'cake', 'falooda', 'sundae', 'sheera'], image: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1756552423146-33vmee7qwcc-1756552425289_3gqwk8_screenshot_2025-08-3.png' },
    { name: 'Beverages', keywords: ['juice', 'shake', 'tea', 'coffee', 'lassi', 'mojito', 'boba', 'blossom', 'limbu', 'coco'], image: 'https://pub-141831e61e69445289222976a15b6fb3.r2.dev/1756552468201-sb2j0y8fah-1756552470016_6s1tf6_screenshot_2025-08-3.png' },
];

// --- COMPONENTS ---
const Header = ({ onCartClick, cartItems, searchQuery, onSearchChange, isProfileOpen, onProfileToggle, onProfileClose, onMyProfile, onLogoClick }) => (
    <header className="bg-white/90 dark:bg-[#0B0C10]/90 backdrop-blur-md text-[hsl(var(--foreground))] 
    border-b border-gray-200/50 dark:border-slate-800 p-2 px-4 sm:p-4 sm:px-8 flex justify-between items-center sticky top-0 z-50 transition-colors duration-200">

        <button onClick={onLogoClick} className="focus:outline-none"><img src={logo} alt="MyEzz Logo" className="h-10 sm:h-20" /></button>
        <div className="relative flex-1 max-w-xl mx-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="text-[#FF6600]" />
            </div>
            <input
                type="text"
                placeholder="Search for restaurants..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-100 dark:bg-[#1F2833] border border-transparent rounded-full text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 transition-all duration-200"
            />
        </div>
        <div className="flex items-center space-x-3">
            <button onClick={onCartClick} className="relative text-gray-600 dark:text-gray-300 hover:text-[#FF6600] hidden md:block transition-colors duration-200">
                <CartIcon />
                {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-[#FF6600] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>}
            </button>
            <ProfileDropdown
                isOpen={isProfileOpen}
                onToggle={onProfileToggle}
                onClose={onProfileClose}
                onMyProfile={onMyProfile}
            />
        </div>
    </header>
);


const FilterCheckbox = ({ label, description, checked, onChange }) => (
    <div className="relative">
        {checked && <div className="absolute left-[-1rem] top-0 h-full w-1 bg-[#FF6600]"></div>}
        <label className="flex items-start space-x-3 cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="form-checkbox h-5 w-5 text-[#FF6600] rounded-sm border-gray-300 bg-gray-100 focus:ring-[#FF6600]" />
            <span className="text-gray-700 dark:text-gray-200">
                {label}
                {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
            </span>
        </label>
    </div>
);


const ProfileDropdown = ({ isOpen, onToggle, onClose, onMyProfile }) => {
    const { currentUser, logout } = useAuth();
    const [profilePhoto, setProfilePhoto] = useState(null);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Load and update profile photo from localStorage
    useEffect(() => {
        const storedProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
        if (storedProfile) setProfilePhoto(storedProfile.profilePhoto);

        const updateProfilePhoto = () => {
            const fresh = JSON.parse(localStorage.getItem("userProfile") || "{}");
            if (fresh) setProfilePhoto(fresh.profilePhoto);
        };

        window.addEventListener("userProfileUpdated", updateProfilePhoto);

        return () => window.removeEventListener("userProfileUpdated", updateProfilePhoto);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('currentUser');
            navigate("/login");
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    const userName =
        currentUser?.displayName ||
        currentUser?.email?.split("@")[0] ||
        "User";

    const userEmail = currentUser?.email || "";

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
                onClick={onToggle}
                className="relative text-gray-600 dark:text-gray-300 hover:text-[#FF6600] transition-colors p-2 rounded-full"
                style={{ minWidth: "48px", minHeight: "48px" }}
            >
                {profilePhoto ? (
                    <img
                        src={profilePhoto}
                        alt="Profile"
                        className="h-9 w-9 rounded-full object-cover"
                    />
                ) : (
                    <UserIcon className="h-6 w-6" />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg shadow-lg border border-gray-200 z-50">

                    {/* User Info */}
                    <div className="p-4 border-b border-gray-200">
                        <p className="font-semibold">Hello, {userName}!</p>
                        <p className="text-sm opacity-70">{userEmail}</p>
                    </div>

                    {/* Dark Mode */}
                    <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 border-b border-gray-200 dark:border-white-700">
                        <span className="text-sm font-medium">Dark Mode</span>
                        <ThemeToggle />
                    </div>

                    {/* My Profile */}
                    <button
                        onClick={onMyProfile}
className="w-full flex items-center px-4 py-3 text-left hover:bg-[#FF6600]/5 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors duration-200"
>
                        <UserIcon />
                        <span className="ml-3">My Profile</span>
                    </button>

                    <div className="border-t border-gray-200"></div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-left text-red-800 hover:bg-[#FF6600] transition-colors duration-200"
                    >
                        <LogoutIcon />
                        <span className="ml-3">Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};


const Sidebar = ({ selectedCuisines, setSelectedCuisines, isOpen, onClose, showFavorites, setShowFavorites }) => {
    const handleCuisineChange = (cuisine) => {
        setSelectedCuisines(prev =>
            prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
        );
    };

    const clearFilters = () => {
        setSelectedCuisines([]);
        setShowFavorites(false);
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar - Desktop & Mobile */}
            <aside className={`
                fixed
                top-0 left-0 h-full
                w-80 sm:w-96
                flex-shrink-0
                p-6 sm:p-8
                space-y-6
                bg-[hsl(var(--background))] text-[hsl(var(--foreground))]
                shadow-2xl
                z-50
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                overflow-y-auto
            `}>
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-6 md:hidden pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Filters</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div>
                    <h3 className="font-bold text-lg sm:text-xl mb-5 text-gray-800 dark:text-gray-100 flex items-center">
                        <span className="mr-2 text-2xl">🍽️</span>
                        Cuisine Type
                    </h3>
                    <div className="flex flex-wrap gap-3 justify-start">
                        {["Jain", "Non-Jain", "Beverages"].map(cuisine => (
                            <button
                                key={cuisine}
                                onClick={() => handleCuisineChange(cuisine)}
                                className={`
                                    px-5 py-2.5 text-sm font-semibold border-2 rounded-full 
                                    transition-all duration-300 transform hover:scale-105 active:scale-95
                                    ${selectedCuisines.includes(cuisine)
                                        ? 'bg-transparent text-[#FF6600] border-[#FF6600] border-2 shadow-md'
                                        : 'text-gray-700 dark:text-gray-300 border-slate-300 dark:border-slate-600 hover:border-[#FF6600] hover:text-[#FF6600] bg-white dark:bg-[#1F2833]'
                                    }
                                `}
                            >
                                {cuisine}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Favourites Filter */}
                <div>
                    <button
                        onClick={() => setShowFavorites(!showFavorites)}
                        className={`
                            w-full px-5 py-3 text-sm font-semibold border-2 rounded-xl flex items-center justify-between
                            transition-all duration-300 transform hover:scale-[1.02] active:scale-95
                            ${showFavorites
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-500 shadow-lg shadow-red-200/50 dark:shadow-red-900/30'
                                : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400 hover:shadow-md bg-white dark:bg-gray-800'
                            }
                        `}
                    >
                        <span>Show Favourites Only</span>
                        {showFavorites}
                    </button>
                </div>

                {/* Active Filters Count */}
                {(selectedCuisines.length > 0 || showFavorites) && (
                    <div className="bg-[#1F2833]/10 dark:bg-[#1F2833] border border-slate-300 dark:border-slate-700 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">
                                {selectedCuisines.length + (showFavorites ? 1 : 0)} filter{selectedCuisines.length + (showFavorites ? 1 : 0) > 1 ? 's' : ''} active
                            </span>
                            <button
                                onClick={clearFilters}
                                className="text-xs font-bold text-[#FF6600] dark:text-[#FF6600] hover:text-[#E65C00] dark:hover:text-[#FF6600] underline transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                )}

                <div className="sticky bottom-4 space-y-2 pt-4 md:pt-4">
                    <button
                        onClick={clearFilters}
                        className="w-full text-gray-700 dark:text-gray-300 font-semibold py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md bg-white dark:bg-gray-800"
                    >
                        Clear All Filters
                    </button>
                </div>
            </aside>
        </>
    );
};
const RestaurantCard = ({ name, distance, cuisines, rating, reviews, delivery_time, image_url, onClick, isFavorite, onToggleFavorite }) => (
    // The props are updated to include 'image_url' and 'delivery_time'
    <div onClick={onClick} className="bg-white dark:bg-[#1F2833] text-[hsl(var(--card-foreground))] rounded-xl shadow-md overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] cursor-pointer border-b-2 border-transparent hover:border-[#FF6600] h-full flex flex-col">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
            {/* FIXED: The src attribute now correctly uses the 'image_url' prop */}
            <img src={image_url} alt={name} className="w-full h-44 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-700 ease-out" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Missing'; }} />

            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Heart Icon - Top Right - FIXED PADDING */}
            <div className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 group-hover:scale-110">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite();
                    }}
                    className={`transition-colors ${isFavorite ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'}`}
                >
                    <HeartIcon filled={isFavorite} />
                </button>
            </div>
        </div>
        <div className="p-4 sm:p-5 bg-white dark:bg-[#1F2833] flex flex-col flex-1">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white pr-2 line-clamp-1 group-hover:text-[#FF6600] transition-colors">{name}</h3>
                {/* Rating Badge - Emerald Green for trust */}
                <div className="flex items-center bg-[#00C805] text-white px-2 py-0.5 rounded-lg text-xs sm:text-sm font-bold flex-shrink-0">
                    <span className="mr-1"><StarIcon className="w-4 h-4" /></span>
                    <span>{rating}</span>
                </div>
            </div>
            {/* Cuisines - Light Slate Gray */}
            <p className="text-[#94A3B8] text-sm truncate mb-3">{cuisines ? cuisines.join(', ') : 'Cuisine not available'}</p>
            <div className="flex justify-between items-center text-sm text-[#94A3B8] pt-3 border-t border-slate-200 dark:border-slate-700 mt-auto">
                <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-semibold">{distance} km</span>
                </div>
                <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold">{delivery_time} mins</span>
                </div>
            </div>
            {/* Primary Action Button */}
            <button className="w-full mt-4 py-2.5 bg-[#FF6600] text-white font-bold rounded-lg transition-all duration-300 hover:bg-[#E65C00] hover:shadow-[0_0_15px_rgba(255,102,0,0.3)] hover:scale-[1.02] transform">
                View Menu
            </button>
        </div>
    </div>
);

const HomePage = ({ setSelectedRestaurant, searchQuery, setSearchQuery, cartItems, setCartItems, showToastMessage }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });
    const [showFavorites, setShowFavorites] = useState(false);
    // New state for dish search results and UI toggles
    const [dishes, setDishes] = useState([]);
    const [showAllDishes, setShowAllDishes] = useState(false);
    const [showAllRestaurants, setShowAllRestaurants] = useState(false);

    const toggleFavorite = (restaurantId) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(restaurantId)
                ? prev.filter(id => id !== restaurantId)
                : [...prev, restaurantId];
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
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
            return [...prevItems, { ...dish, quantity: 1, vendor: restaurantName, restaurantName: restaurantName }];
        });
    };

    useEffect(() => {
        async function getRestaurants() {
            setLoading(true);
            let query;

            // If there's a search query, use the powerful RPC function
            if (searchQuery.trim() !== '') {
                query = supabase.rpc('search_restaurants', {
                    search_term: searchQuery
                });
            } else {
                // Otherwise, fetch all restaurants normally
                query = supabase.from('restaurants').select(`*, tags(name), cuisines(name)`);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching restaurants:', error);
                setRestaurants([]);
            } else {
                // The RPC doesn't fetch nested tags/cuisines, so we re-format for consistency
                // In a real app, you might adjust the RPC to return this info too.
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
    }, [searchQuery]); // Re-run the fetch whenever the search query changes

    // Fetch dishes matching the search query
    useEffect(() => {
        async function fetchDishes() {
            if (searchQuery.trim() === '') {
                setDishes([]);
                return;
            }
            const { data, error } = await supabase
                .from('menu_items')
                .select('id, name, price, restaurant_id, restaurants(name)')
                .ilike('name', `%${searchQuery}%`);
            if (error) {
                console.error('Error fetching dishes:', error);
                setDishes([]);
            } else {
                setDishes(data);
            }
        }
        fetchDishes();
    }, [searchQuery]);

    // Client-side filtering for cuisines still works on the fetched data
    const filteredRestaurants = restaurants.filter(restaurant => {
        const matchesCuisine = selectedCuisines.length === 0 || selectedCuisines.some(c => restaurant.cuisines.includes(c));
        const matchesFavorite = !showFavorites || favorites.includes(restaurant.id);
        return matchesCuisine && matchesFavorite;
    });

    if (loading) {
        return (
            <div className="text-center py-20 sm:py-24">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FF6600] border-t-transparent mb-4"></div>
                <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">Loading restaurants...</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">🛵 Finding the best food for you</p>
            </div>
        );
    }

    return (
        <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Sidebar
                selectedCuisines={selectedCuisines}
                setSelectedCuisines={setSelectedCuisines}
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                showFavorites={showFavorites}
                setShowFavorites={setShowFavorites}
            />
            <main className="flex-1 py-6 sm:py-8 w-full">
                {/* HORIZONTAL FILTERS - Moved from Sidebar to top of main */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">What's on your mind?</h2>
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex md:hidden items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm"
                        >
                            <FilterIcon />
                            <span>Filters</span>
                        </button>
                    </div>

                    <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
                        {/* Cuisine Chips */}
                        {["Jain", "Non-Jain", "Beverages"].map(cuisine => (
                            <button
                                key={cuisine}
                                onClick={() => {
                                    setSelectedCuisines(prev => prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]);
                                }}
                                className={`
                                    flex-shrink-0 px-5 py-2 text-sm font-semibold rounded-full border transition-all duration-200 whitespace-nowrap
                                    ${selectedCuisines.includes(cuisine)
                                        ? 'bg-[#FF6600] text-white border-[#FF6600] shadow-md'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-[#FF6600] hover:text-[#FF6600]'
                                    }
                                `}
                            >
                                {cuisine}
                            </button>
                        ))}

                        {/* Favourites Filter */}
                        <button
                            onClick={() => setShowFavorites(!showFavorites)}
                            className={`
                                flex-shrink-0 px-5 py-2 text-sm font-semibold rounded-full border transition-all duration-200 whitespace-nowrap flex items-center gap-2
                                ${showFavorites
                                    ? 'bg-red-500 text-white border-red-500 shadow-md'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-red-500 hover:text-red-500'
                                }
                            `}
                        >
                            <span>❤️</span>
                            <span>Favourites</span>
                        </button>

                        {/* Clear All */}
                        {(selectedCuisines.length > 0 || showFavorites) && (
                            <button
                                onClick={() => {
                                    setSelectedCuisines([]);
                                    setShowFavorites(false);
                                }}
                                className="flex-shrink-0 px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline whitespace-nowrap"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>


                <div className="flex justify-between items-center mb-6 sm:mb-8">
                    <div className="flex items-center space-x-3">
                        <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200">
                            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                </div>
                {searchQuery.trim() !== '' ? (
                    <div className="flex flex-col gap-8 mb-8">
                        {/* Top: Dish suggestions */}
                        <div className="bg-[hsl(var(--card))] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-bold mb-3 flex items-center justify-between cursor-pointer hover:text-[#FF6600] transition-colors" onClick={() => setShowAllDishes(!showAllDishes)}>
                                <span>🍽️ Explore Dishes</span>
                                <span className="text-sm text-gray-500">{showAllDishes ? 'Show Less' : 'View All'}</span>
                            </h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {(showAllDishes ? dishes : dishes.slice(0, 4)).map(d => (
                                    <li key={d.id} onClick={() => addToCart(d)} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#FF6600]/30 dark:hover:border-[#FF6600]/50 transition-all cursor-pointer group hover:shadow-md">
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-[#FF6600] transition-colors">{d.name}</p>
                                            {d.restaurants && <p className="text-xs text-gray-500 line-clamp-1">from {d.restaurants.name}</p>}
                                            {d.price && <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-1">₹{d.price}</p>}
                                        </div>
                                        <button className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm text-[#FF6600] group-hover:bg-[#FF6600] group-hover:text-white transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {dishes.length === 0 && <p className="text-gray-500 text-sm mt-2">No dishes found matching "{searchQuery}"</p>}
                        </div>

                        {/* Bottom: Restaurant suggestions */}
                        <div className="bg-[hsl(var(--card))] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-bold mb-3 flex items-center justify-between cursor-pointer hover:text-[#FF6600] transition-colors" onClick={() => setShowAllRestaurants(!showAllRestaurants)}>
                                <span>🏙️ Explore Restaurants</span>
                                <span className="text-sm text-gray-500">{showAllRestaurants ? 'Show Less' : 'View All'}</span>
                            </h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {(showAllRestaurants ? filteredRestaurants : filteredRestaurants.slice(0, 4)).map(r => (
                                    <li key={r.id} onClick={() => { setSelectedRestaurant(r); setSearchQuery(''); }} className="cursor-pointer p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#FF6600]/30 dark:hover:border-[#FF6600]/50 transition-all hover:shadow-md">
                                        <div className="flex items-center gap-3">
                                            {/* Simple list item style without big image tiles */}
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
                    /* Standard Restaurant Grid (Only shown when NOT searching) */
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
                                            setSelectedRestaurant(restaurant);
                                            setSearchQuery('');
                                        }}
                                        isFavorite={favorites.includes(restaurant.id)}
                                        onToggleFavorite={() => toggleFavorite(restaurant.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 sm:py-24 bg-gradient-to-br from-white to-[#FF6600]/5 dark:from-gray-800 dark:to-[#FF6600]/10 rounded-3xl border-2 border-dashed border-[#FF6600]/30 dark:border-[#FF6600]/30 shadow-inner">
                            <div className="text-7xl mb-5 animate-bounce">🍽️</div>
                            <p className="text-gray-800 dark:text-gray-200 font-bold text-xl mb-2">No restaurants found</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
                            {(selectedCuisines.length > 0 || showFavorites || searchQuery.trim() !== '') && (
                                <button
                                    onClick={() => {
                                        setSelectedCuisines([]);
                                        setShowFavorites(false);
                                        setShowFilters(false);
                                    }}
                                    className="mt-4 px-6 py-2.5 bg-[#FF6600] text-white font-semibold rounded-full hover:bg-[#E65C00] transition-all duration-200 shadow-md hover:shadow-lg"
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
const RestaurantMenuPage = ({ restaurant, onBack, cartItems, setCartItems, searchQuery, showToastMessage }) => {
    const [menuItems, setMenuItems] = useState([]);
    // NEW: Add state to hold categories fetched from the database
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // MODIFIED: This useEffect now fetches both menu items and all categories
    useEffect(() => {
        if (!restaurant) return;

        async function fetchData() {
            setLoading(true);

            // Fetch both sets of data at the same time for efficiency
            const [menuResponse, categoriesResponse] = await Promise.all([
                supabase.from('menu_items').select('*').eq('restaurant_id', restaurant.id),
                supabase.from('categories').select('*')
            ]);

            if (menuResponse.error) {
                console.error('Error fetching menu items:', menuResponse.error);
                setMenuItems([]);
            } else {
                setMenuItems(menuResponse.data);
            }

            if (categoriesResponse.error) {
                console.error('Error fetching categories:', categoriesResponse.error);
                setCategories([]);
            } else {
                setCategories(categoriesResponse.data);
            }

            setLoading(false);
        }

        fetchData();
        setSelectedCategory('All');
    }, [restaurant]);

    const addToCart = (item) => {
        setCartItems(prevItems => {
            const itemExists = prevItems.find(i => i.id === item.id && i.vendor === restaurant.name);
            if (itemExists) {
                showToastMessage(`${item.name} quantity updated in cart!`);
                return prevItems.map(i =>
                    i.id === item.id && i.vendor === restaurant.name
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            showToastMessage(`${item.name} added to cart!`);
            return [...prevItems, { ...item, quantity: 1, vendor: restaurant.name, restaurantName: restaurant.name }];
        });
    };

    const removeFromCart = (item) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id && i.vendor === restaurant.name);
            if (!existingItem) return prevItems;
            
            if (existingItem.quantity === 1) {
                showToastMessage(`${item.name} removed from cart!`);
                return prevItems.filter(i => !(i.id === item.id && i.vendor === restaurant.name));
            }
            
            showToastMessage(`${item.name} quantity decreased!`);
            return prevItems.map(i =>
                i.id === item.id && i.vendor === restaurant.name
                    ? { ...i, quantity: i.quantity - 1 }
                    : i
            );
        });
    };

    // FIXED: This logic now correctly uses the 'categories' state fetched from the database
    const availableCategories = categories.filter(category =>
        menuItems.some(item =>
            category.keywords.some(keyword =>
                item.name.toLowerCase().includes(keyword)
            )
        )
    );

    // FIXED: This logic also uses the 'categories' state
    const categoryFilteredItems = selectedCategory === 'All'
        ? menuItems
        : menuItems.filter(item => {
            const categoryInfo = categories.find(cat => cat.name === selectedCategory);
            if (!categoryInfo) return false;
            const lowerCaseName = item.name.toLowerCase();
            return categoryInfo.keywords.some(keyword => lowerCaseName.includes(keyword));
        });

    const filteredMenuItems = searchQuery.trim() === ''
        ? categoryFilteredItems
        : categoryFilteredItems.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className="max-w-screen-xl mx-auto p-4 sm:p-8 text-gray-800 dark:text-gray-100">
            <button onClick={onBack} className="flex items-center font-semibold text-[#FF6600] mb-4 px-4 py-2 border-2 border-[#FF6600] rounded-lg hover:bg-[#FF6600] hover:text-white transition-all duration-200">
                <BackIcon />
                <span className="ml-2">Back to Restaurants</span>
            </button>
            <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-lg shadow-md overflow-hidden">
                <img src={restaurant.image_url} alt={restaurant.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                    <h2 className="text-3xl font-bold mb-2">{restaurant.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{restaurant.cuisines.join(', ')}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                            <StarIcon filled={true} />
                            <span className="ml-1 font-semibold">{restaurant.rating} ({restaurant.reviews} reviews)</span>
                        </div>
                        <span>•</span>
                        <span>{restaurant.delivery_time} mins</span>
                    </div>
                </div>

                {/* --- CATEGORY FILTER UI --- */}
                {availableCategories.length > 0 && searchQuery.trim() === '' && (
                    <div className="px-6 sm:px-8 py-6 border-t border-gray-100 dark:border-gray-800">
                        <h3 className="text-xl sm:text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">Categories</h3>
                        <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4 scrollbar-hide">
                            <button onClick={() => setSelectedCategory('All')} className={`flex-shrink-0 text-center p-3 rounded-xl transition-all duration-200 ${selectedCategory === 'All' ? 'bg-[#FF6600]/5 dark:bg-[#FF6600]/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                <div className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full mx-auto mb-2.5 border-2 shadow-sm ${selectedCategory === 'All' ? 'border-[#FF6600] bg-[#FF6600]/5 dark:bg-[#FF6600]/30 ring-2 ring-[#FF6600]/30 dark:ring-[#FF6600]/50' : 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800'}`}>
                                    <div className="w-full h-full rounded-full flex items-center justify-center">
                                        <span className="text-base sm:text-lg font-bold text-gray-700 dark:text-gray-200">All</span>
                                    </div>
                                </div>
                                <span className={`text-xs sm:text-sm font-semibold ${selectedCategory === 'All' ? 'text-[#FF6600] dark:text-[#FF6600]' : 'text-gray-600 dark:text-gray-300'}`}>All</span>
                            </button>
                            {availableCategories.map((cat) => (
                                <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} className={`flex-shrink-0 text-center p-3 rounded-xl transition-all duration-200 ${selectedCategory === cat.name ? 'bg-[#FF6600]/5 dark:bg-[#FF6600]/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-2.5 border-2 shadow-sm overflow-hidden ${selectedCategory === cat.name ? 'border-[#FF6600] ring-2 ring-[#FF6600]/30 dark:ring-[#FF6600]/50' : 'border-gray-200 dark:border-gray-700'}`}>
                                        {/* FIXED: The <img> tag now correctly uses 'cat.image_url' */}
                                        <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className={`text-xs sm:text-sm font-semibold ${selectedCategory === cat.name ? 'text-[#FF6600] dark:text-[#FF6600]' : 'text-gray-600 dark:text-gray-300'}`}>
                                        {cat.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4">
                        {searchQuery.trim() !== '' ? 'Search Results' : (selectedCategory === 'All' ? 'Full Menu' : selectedCategory)}
                    </h3>
                    {loading ? (
                        <p>Loading menu...</p>
                    ) : filteredMenuItems.length > 0 ? (
                        <div className="space-y-4">
                            {filteredMenuItems.map((item) => {
                                // Find if this item is already in cart
                                const cartItem = cartItems.find(i => i.id === item.id && i.vendor === restaurant.name);
                                const quantity = cartItem?.quantity || 0;
                                
                                return (
                                    <div key={item.id} className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                                        <div>
                                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</h4>
                                            {item.price && <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price}</p>}
                                        </div>
                                        {item.price && (
                                            quantity === 0 ? (
                                                <button 
                                                    onClick={() => addToCart(item)} 
                                                    className="bg-[#FF6600] hover:bg-[#E65C00] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    ADD
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => removeFromCart(item)}
                                                        className="border-2 border-[#FF6600] text-[#FF6600] hover:text-white hover:bg-[#FF6600] w-8 h-8 rounded-md transition-all duration-200 font-bold text-xl flex items-center justify-center active:scale-90"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="text-[#FF6600] font-bold px-3 min-w-[2.5rem] text-center">
                                                        {quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="border-2 border-[#FF6600] text-[#FF6600] hover:text-white hover:bg-[#FF6600] w-8 h-8 rounded-md transition-all duration-200 font-bold text-xl flex items-center justify-center active:scale-90"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No items found for this filter.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


const MyProfilePage = ({ onBack, userProfile, setUserProfile }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(userProfile);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({ label: '', address: '' });

    // NEW: State for online orders
    const [onlineOrders, setOnlineOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Toast state
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

    // FETCH ORDERS FROM APP SCRIPT
    useEffect(() => {
        console.log("MyProfilePage: Checking userProfile for email...", userProfile);
        if (!userProfile.email) {
            console.warn("MyProfilePage: No email found in userProfile, skipping fetch.");
            return;
        }

        const fetchOrders = async () => {
            setLoadingOrders(true);
            console.log(`MyProfilePage: Fetching orders for ${userProfile.email}...`);
            try {
                // Using the specific App Script URL found in PaymentPage.jsx
                const scriptUrl = import.meta.env.VITE_APP_SCRIPT_URL;
                if (!scriptUrl) {
                    console.error("VITE_APP_SCRIPT_URL not found");
                    return;
                }
                const response = await fetch(`${scriptUrl}?email=${userProfile.email}`);
                const data = await response.json();
                console.log("MyProfilePage: Orders fetched successfully:", data);
                setOnlineOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, [userProfile.email]);

    const handleSave = () => {
        // CHECK FOR PRIVATE INFO CHANGES
        const privateFields = ['email', 'phoneNumber', 'fullName', 'location'];
        const hasPrivateChanges = privateFields.some(field => editedProfile[field] !== userProfile[field]);

        if (hasPrivateChanges) {
            setToast({
                isVisible: true,
                message: "Your profile has been updated successfully!",
                type: 'success'
            });
        } else {
            setToast({
                isVisible: true,
                message: "Profile updated successfully!",
                type: 'success'
            });
        }

        setUserProfile(editedProfile);
        setIsEditing(false);
        localStorage.setItem('userProfile', JSON.stringify(editedProfile));
        window.dispatchEvent(new Event("userProfileUpdated"));
        console.log('Profile saved:', editedProfile);
    };

    const handleCancel = () => {
        setEditedProfile(userProfile);
        setIsEditing(false);
        setShowAddressForm(false);
        setNewAddress({ label: '', address: '' });
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedProfile({ ...editedProfile, profilePhoto: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddAddress = () => {
        if (newAddress.label && newAddress.address) {
            const address = {
                id: Date.now(),
                ...newAddress,
                isDefault: !editedProfile.savedAddresses || editedProfile.savedAddresses.length === 0
            };
            setEditedProfile({
                ...editedProfile,
                savedAddresses: [...(editedProfile.savedAddresses || []), address]
            });
            setNewAddress({ label: '', address: '' });
            setShowAddressForm(false);
        }
    };

    const handleDeleteAddress = (id) => {
        setEditedProfile({
            ...editedProfile,
            savedAddresses: (editedProfile.savedAddresses || []).filter(addr => addr.id !== id)
        });
    };

    const handleSetDefaultAddress = (id) => {
        setEditedProfile({
            ...editedProfile,
            savedAddresses: (editedProfile.savedAddresses || []).map(addr => ({
                ...addr,
                isDefault: addr.id === id
            }))
        });
    };

    const handleTrackOrder = () => {
        console.log('Tracking order:', displayProfile.currentOrder?.orderId);
        alert('Order tracking feature coming soon!');
    };

    const displayProfile = isEditing ? editedProfile : userProfile;

    useEffect(() => {
        if (displayProfile?.currentOrder?.status === "Delivered") {
            // Move the delivered order to previous orders
            const completedOrder = displayProfile.currentOrder;

            const updatedProfile = {
                ...displayProfile,
                previousOrders: [...(displayProfile.previousOrders || []), completedOrder],
                currentOrder: null, // clear the current order
            };

            setUserProfile(updatedProfile);
            localStorage.setItem("userProfile", JSON.stringify(updatedProfile));

        }
    }, [displayProfile?.currentOrder?.status]);



    return (
        <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
            <div className="bg-[hsl(var(--card))] dark:bg-gray-800 text-[hsl(var(--card-foreground))] rounded-lg shadow-lg p-6 mb-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={onBack}
                        className="text-[#FF6600] hover:text-white font-semibold px-4 py-2 border-2 border-[#FF6600] rounded-lg hover:bg-[#FF6600] transition-all duration-200"
                    >
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        My Profile
                    </h1>
                    <div className="w-16" />
                </div>

                {/* Profile Photo */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-[#FF6600] dark:bg-[#E65C00] flex items-center justify-center overflow-hidden">
                            {displayProfile.profilePhoto ? (
                                <img
                                    src={displayProfile.profilePhoto}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-4xl text-white font-bold">
                                    {displayProfile.fullName?.charAt(0) || "U"}
                                </span>
                            )}
                        </div>
                        {isEditing && (
                            <label className="absolute bottom-0 right-0 bg-[#FF6600] text-white px-3 py-1 rounded-full cursor-pointer hover:bg-[#E65C00] text-sm">
                                📷
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                        Personal Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Full Name", key: "fullName", type: "text" },
                            { label: "Email Address", key: "email", type: "email" },
                            { label: "Phone Number", key: "phoneNumber", type: "tel" },
                            { label: "Location", key: "location", type: "text" },
                        ].map((field) => (
                            <div key={field.key}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                    {field.label}
                                </label>
                                {isEditing ? (
                                    <input
                                        type={field.type}
                                        value={editedProfile[field.key] || ""}
                                        onChange={(e) =>
                                            setEditedProfile({
                                                ...editedProfile,
                                                [field.key]: e.target.value,
                                            })
                                        }
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6600] focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                    />
                                ) : (
                                    <p className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100">
                                        {displayProfile[field.key] || "Not provided"}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total Orders */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    Total Orders Placed
                                </h3>
                                <p className="text-3xl font-bold text-[#FF6600]">
                                    {onlineOrders ? onlineOrders.length : 0}
                                </p>
                            </div>
                        </div>
                        <span className="text-4xl">📦</span>
                    </div>
                </div>

                {/* Current Order */}
                {displayProfile.currentOrder && (
                    <div className="bg-blue-50 dark:bg-blue-700 p-6 rounded-lg mb-6 border border-blue-200 dark:border-blue-600">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                            📦 Current Order
                        </h2>
                        <div className="space-y-2">
                            {["Order ID", "Status", "Order date"].map((label, index) => (
                                <div key={index} className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-300">{label}:</span>
                                    <span className="font-semibold">
                                        {index === 0
                                            ? displayProfile.currentOrder.orderId
                                            : index === 1
                                                ? displayProfile.currentOrder.status
                                                : displayProfile.currentOrder.orderDate}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleTrackOrder}
                            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Track Order →
                        </button>
                    </div>
                )}

                {/* Previous Orders - NOW FETCHED FROM SERVER */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                        Previous Orders
                    </h2>

                    {loadingOrders ? (
                        <div className="text-center py-4">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#FF6600] border-t-transparent"></div>
                            <p className="text-sm text-gray-500 mt-2">Loading orders...</p>
                        </div>
                    ) : onlineOrders && onlineOrders.length > 0 ? (
                        <div className="space-y-3">
                            {onlineOrders.map((order) => (
                                <div
                                    key={order.orderId}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-800 dark:text-gray-100">
                                                #{order.orderId}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600 dark:text-gray-300">
                                            {order.items.length} items
                                        </span>
                                        <span className="font-semibold text-gray-800 dark:text-gray-100">
                                            ₹{order.total}
                                        </span>
                                    </div>

                                    {/* Order Items List */}
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2 space-y-1">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                                                <span>
                                                    {item.quantity} x {item.name}
                                                    {item.portion && item.portion !== 'Regular' && <span className="text-gray-400"> ({item.portion})</span>}
                                                </span>
                                                <span>₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                            <span className="text-4xl mb-2 block">📦</span>
                            <p className="text-gray-500 dark:text-gray-400">No previous orders yet</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Your order history will appear here
                            </p>
                        </div>
                    )}
                </div>

                {/* Saved Addresses */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Saved Addresses
                        </h2>
                        {isEditing && (
                            <button
                                onClick={() => setShowAddressForm(!showAddressForm)}
                                className="text-[#FF6600] hover:text-[#FF6600] font-semibold"
                            >
                                + Add New
                            </button>
                        )}
                    </div>

                    {showAddressForm && isEditing && (
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-[#FF6600]/50 dark:border-[#FF6600] mb-4">
                            <input
                                type="text"
                                placeholder="Label (e.g., Home, Office)"
                                value={newAddress.label}
                                onChange={(e) =>
                                    setNewAddress({ ...newAddress, label: e.target.value })
                                }
                                className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6600] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                            />
                            <textarea
                                placeholder="Full Address"
                                value={newAddress.address}
                                onChange={(e) =>
                                    setNewAddress({ ...newAddress, address: e.target.value })
                                }
                                className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#FF6600] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                rows="3"
                            />
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleAddAddress}
                                    className="flex-1 bg-[#FF6600] text-white py-2 rounded-lg hover:bg-[#E65C00]"
                                >
                                    Add Address
                                </button>
                                <button
                                    onClick={() => setShowAddressForm(false)}
                                    className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        {displayProfile.savedAddresses && displayProfile.savedAddresses.length > 0 ? (
                            displayProfile.savedAddresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <span className="text-xl mr-2">📍</span>
                                                <span className="font-semibold text-gray-800 dark:text-gray-100">
                                                    {addr.label}
                                                </span>
                                                {addr.isDefault && (
                                                    <span className="ml-2 text-xs bg-[#FF6600]/10 text-[#E65C00] px-2 py-1 rounded">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 ml-7">
                                                {addr.address}
                                            </p>
                                        </div>
                                        {isEditing && (
                                            <div className="flex flex-col space-y-2 ml-2">
                                                {!addr.isDefault && (
                                                    <button
                                                        onClick={() => handleSetDefaultAddress(addr.id)}
                                                        className="text-[#FF6600] hover:text-[#FF6600] text-xs"
                                                    >
                                                        Set Default
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                    className="text-red-500 hover:text-red-600 text-xs"
                                                >
                                                    🗑 Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                                <span className="text-4xl mb-2 block">📍</span>
                                <p className="text-gray-500 dark:text-gray-400">No saved addresses yet</p>
                                {isEditing && (
                                    <p className="text-sm text-gray-400 mt-1">Click "Add New" to save an address</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-[#FF6600] text-white rounded-lg hover:bg-[#E65C00] transition-colors"
                            >
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2 bg-[#FF6600] text-white rounded-lg hover:bg-[#E65C00] transition-all duration-300 hover:shadow-lg hover:scale-[1.05] transform"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};




const CheckoutPage = ({ cartItems, onBack, address, setAddress, setCartItems, onPayNow }) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const platformFee = cartItems.length > 0 ? 8 : 0;

    // Calculate number of unique vendors for delivery fee
    const uniqueVendors = new Set(cartItems.map(item => item.vendor || item.restaurantName || 'Unknown Restaurant'));
    const deliveryFee = uniqueVendors.size * 30;

    const total = subtotal + deliveryFee + platformFee;

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const updateQuantity = (itemId, itemVendor, change) => {
        setCartItems(prevItems => {
            return prevItems.map(item => {
                const currentVendor = item.vendor || item.restaurantName || 'Unknown Restaurant';
                // Compare ID and Vendor to identify the unique item in cart
                if (item.id === itemId && currentVendor === itemVendor) {
                    return { ...item, quantity: item.quantity + change };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1F2833] text-[hsl(var(--card-foreground))] rounded-2xl shadow-2xl p-6 w-full max-w-md m-4 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Your Cart</h2>
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="bg-[#FF6600]/10 dark:bg-[#FF6600]/20 p-6 rounded-full mb-4">
                            <Wallet className="w-12 h-12 text-[#FF6600]" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-[250px]">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <button
                            onClick={onBack}
                            className="px-8 py-3 bg-[#FF6600] hover:bg-[#E65C00] text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#FF6600]/20 dark:shadow-[#FF6600]/30 transform hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]"
                        >
                            Start Ordering
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {(() => {
                                // Group items by restaurant/vendor
                                const groupedItems = cartItems.reduce((acc, item) => {
                                    const vendor = item.vendor || item.restaurantName || 'Unknown Restaurant';
                                    if (!acc[vendor]) {
                                        acc[vendor] = [];
                                    }
                                    acc[vendor].push(item);
                                    return acc;
                                }, {});

                                return Object.entries(groupedItems).map(([vendor, items]) => (
                                    <div key={vendor} className="mb-4">
                                        <h3 className="text-sm font-bold text-[#FF6600] dark:text-[#FF6600] mb-2 pb-1 border-b border-[#FF6600]/30 dark:border-[#FF6600]/30">
                                            🍽️ {vendor}
                                        </h3>
                                        {items.map((item, index) => (
                                            <div key={`${item.id}-${index}`} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 mb-3 hover:border-[#FF6600]/30 dark:hover:border-[#FF6600]/50 transition-colors">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-lg">{item.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">₹{item.price} each</p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-1 shadow-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, vendor, -1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition-all active:scale-95"
                                                            disabled={item.quantity <= 0}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                            </svg>
                                                        </button>
                                                        <span className="w-8 text-center font-bold text-gray-800 dark:text-gray-100">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, vendor, 1)}
                                                            className="w-8 h-8 flex items-center justify-center rounded-md bg-[#FF6600]/10 dark:bg-[#FF6600]/30 text-[#FF6600] dark:text-[#FF6600] hover:bg-[#FF6600]/20 dark:hover:bg-[#FF6600]/50 transition-all active:scale-95"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    <div className="text-right min-w-[3rem]">
                                                        <p className="font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toFixed(0)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ));
                            })()}
                        </div>

                        <div className="flex justify-end mt-2">
                            <button onClick={() => setCartItems([])} className="text-sm text-red-500 hover:text-red-600 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors">Clear Cart</button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><span>Platform Fee</span><span>₹{platformFee.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-white pt-2"><span>Grand Total</span><span className="text-[#FF6600] dark:text-[#FF6600]">₹{total.toFixed(2)}</span></div>
                        </div>
                        <div className="mt-6">
                            <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <span>📍</span> Delivery Information
                            </h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={address.fullName}
                                    onChange={handleAddressChange}
                                    placeholder="Full Name"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#FF6600] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                                />
                                <input
                                    type="email"
                                    name="emailId"
                                    value={address.emailId}
                                    onChange={handleAddressChange}
                                    placeholder="Email ID"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#FF6600] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                                />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={address.phoneNumber}
                                    onChange={handleAddressChange}
                                    placeholder="Phone Number"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#FF6600] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                                />
                                <input
                                    type="text"
                                    name="fullAddress"
                                    value={address.fullAddress}
                                    onChange={handleAddressChange}
                                    placeholder="Full Delivery Address"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#FF6600] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                                />
                            </div>
                        </div>
                        <button onClick={() => onPayNow(address)} className="w-full mt-8 bg-[#FF6600] text-white font-bold py-4 rounded-lg hover:bg-[#E65C00] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,102,0,0.3)] transform hover:scale-[1.02] active:scale-[0.98]">
                            Pay Now
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default function App() {
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('home'); // Track current page
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [address, setAddress] = useState({
        fullName: '',
        emailId: '',
        phoneNumber: '',
        fullAddress: ''
    });

    const [userProfile, setUserProfile] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        location: '',
        profilePhoto: '',
        savedAddresses: [],
        totalOrders: 0,
        currentOrder: null,
        previousOrders: []
    });

    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Load saved profile data from localStorage
    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            try {
                const parsedProfile = JSON.parse(savedProfile);
                setUserProfile(parsedProfile);
            } catch (error) {
                console.error('Error parsing saved profile:', error);
            }
        }
    }, []);

    // Initialize user profile from auth data
    useEffect(() => {
        if (currentUser) {
            setUserProfile(prev => ({
                ...prev,
                fullName: currentUser.displayName || prev.fullName,
                email: currentUser.email || prev.email
            }));
        }
    }, [currentUser]);

    // Sync profile data with payment address when profile is updated
    useEffect(() => {
        if (userProfile.fullName || userProfile.email || userProfile.phoneNumber || userProfile.location) {
            setAddress(prev => ({
                ...prev,
                fullName: userProfile.fullName || prev.fullName,
                emailId: userProfile.email || prev.emailId,
                phoneNumber: userProfile.phoneNumber || prev.phoneNumber,
                fullAddress: userProfile.location || prev.fullAddress
            }));
        }
    }, [userProfile]);

    // Handle browser back button to prevent going to login page
    useEffect(() => {
        const handlePopState = (event) => {
            // Always go back to restaurant home page instead of login
            if (currentPage !== 'home') {
                setCurrentPage('home');
                setSelectedRestaurant(null);
                setSearchQuery('');
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [currentPage]);

    const handleProfileToggle = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleProfileClose = () => {
        setIsProfileOpen(false);
    };

    const handleMyProfile = () => {
        setCurrentPage('profile');
        setIsProfileOpen(false);
    };

    const handleBackToHome = () => {
        setCurrentPage('home');
        setSelectedRestaurant(null);
        setSearchQuery('');
    };

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };


    const isValidEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const isValidPhone = (phone) => {
        const re = /^[0-9]{10}$/;
        return re.test(String(phone));
    };

    const handlePayNow = (addressData) => {
        if (!addressData.fullName.trim() || !addressData.emailId.trim() || !addressData.phoneNumber.trim() || !addressData.fullAddress.trim()) {
            alert("Please fill in all delivery information fields.");
            return;
        }

        if (!isValidEmail(addressData.emailId)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!isValidPhone(addressData.phoneNumber)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        const customerInfo = {
            fullName: addressData.fullName,
            phoneNumber: addressData.phoneNumber,
            emailId: addressData.emailId,
            fullAddress: addressData.fullAddress
        };

        const cartWithVendor = cartItems.map(item => ({
            ...item,
            // Preserve existing vendor/restaurantName, only set if missing
            vendor: item.vendor || item.restaurantName || (selectedRestaurant ? selectedRestaurant.name : "Unknown Vendor"),
            restaurantName: item.restaurantName || item.vendor || (selectedRestaurant ? selectedRestaurant.name : "Unknown Restaurant")
        }));

        setShowCheckout(false);

        navigate("/payment", {
            state: {
                customerInfo,
                cart: cartWithVendor,
            },
        });

    };

    const renderPage = () => {
        if (currentPage === 'profile') {
            return <MyProfilePage
                onBack={handleBackToHome}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
            />;
        }

        if (selectedRestaurant) {
            return <RestaurantMenuPage
                restaurant={selectedRestaurant}
                onBack={() => setSelectedRestaurant(null)}
                cartItems={cartItems}
                setCartItems={setCartItems}
                searchQuery={searchQuery}
                showToastMessage={showToastMessage}
            />;
        }

        return <HomePage
            setSelectedRestaurant={setSelectedRestaurant}
            address={address}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            cartItems={cartItems}
            setCartItems={setCartItems}
            showToastMessage={showToastMessage}
        />;
    };

    return (
        <div className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] min-h-screen font-sans pb-16 md:pb-0 ">
            <Header
                cartItems={cartItems}
                onCartClick={() => setShowCheckout(true)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                isProfileOpen={isProfileOpen}
                onProfileToggle={handleProfileToggle}
                onProfileClose={handleProfileClose}
                onMyProfile={handleMyProfile}
                onLogoClick={handleBackToHome}
            />
            {renderPage()}
            {showCheckout && <CheckoutPage cartItems={cartItems} onBack={() => setShowCheckout(false)} address={address} setAddress={setAddress} setCartItems={setCartItems} onPayNow={handlePayNow} />}

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0B0C10] border-t border-slate-200 dark:border-slate-800 flex justify-around p-2">
                <button onClick={() => { setSelectedRestaurant(null); setSearchQuery(''); }} className={`flex flex-col items-center text-xs ${!selectedRestaurant ? 'text-[#FF6600]' : 'text-gray-500 dark:text-gray-400'}`}>
                    <HomeIcon className="h-6 w-6" />
                    <span>Home</span>
                </button>
                <button onClick={() => setShowCheckout(true)} className={`flex flex-col items-center text-xs relative ${cartItems.length > 0 ? 'text-[#FF6600]' : 'text-gray-500 dark:text-gray-400'}`}>
                    <CartIcon className="h-6 w-6" />
                    {cartItems.length > 0 && <span className="absolute -top-1 right-1 bg-[#FF6600] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>}
                    <span>Cart</span>
                </button>
            </nav>
            <Toast
                message={toastMessage}
                type="success"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />
            <Footer />
        </div>
    );
}
