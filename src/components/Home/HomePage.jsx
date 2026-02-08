/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../../auth/AuthContext';
import { Bike } from 'lucide-react';

import { supabase } from '../../supabaseClient';

// Components
import Header from './Header';
import Footer from '../Shared/Footer';
import Toast from '../Shared/Toast';
import LocationSelector from '../Shared/LocationSelector';
import HomePageContent from './HomePageContent';
import RestaurantMenuPage from '../Restaurant/RestaurantMenuPage';
import MyProfilePage from '../User/MyProfilePage';
import CheckoutPage from '../Cart/CheckoutPage';
import SurpriseMe from '../SurpriseMe/SurpriseMe';

// Icons for bottom nav
import { HomeIcon, CartIcon } from '../Shared/Icons';

// Internal component for the Floating Cart Panel
const CartFloatingPanel = ({ cartItems, onClick, currentPath }) => {
    // Hide on profile page
    if (currentPath === '/profile') return null;
    if (!cartItems || cartItems.length === 0) return null;

    // Group items by restaurant
    const groupedItems = cartItems.reduce((acc, item) => {
        const vendor = item.vendor || item.restaurantName || "Restaurant";
        const image = item.restaurantImage || null;
        if (!acc[vendor]) {
            acc[vendor] = {
                name: vendor,
                image: image,
                items: [],
                count: 0,
                total: 0
            };
        }
        acc[vendor].items.push(item);
        acc[vendor].count += item.quantity;
        acc[vendor].total += (item.price * item.quantity);
        return acc;
    }, {});

    const restaurants = Object.values(groupedItems);
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Calculate dynamic height based on number of stacked cards
    const stackHeight = 80 + (restaurants.length - 1) * 12; // Base height + offset for each additional card

    return (
        <div 
            className="fixed bottom-24 md:bottom-8 left-1/2 transform -translate-x-1/2 z-40 w-[95%] max-w-[420px]"
            style={{ perspective: '1000px' }}
        >
            <div 
                className="relative w-full cursor-pointer" 
                onClick={onClick}
                style={{ height: `${stackHeight}px` }}
            >
                {restaurants.map((rest, index) => {
                    // Create stack effect - bottom cards appear above
                    const reverseIndex = restaurants.length - 1 - index;
                    const isTop = index === restaurants.length - 1;
                    const scale = 1 - (reverseIndex * 0.04);
                    const translateY = reverseIndex * -12; // More visible offset
                    const zIndex = index + 10;
                    
                    return (
                        <div 
                            key={rest.name}
                            className={`absolute inset-x-0 bottom-0 h-20 rounded-2xl transition-all duration-500 ease-out overflow-hidden
                                bg-white dark:bg-[#1A1A1A]
                                border border-gray-200 dark:border-gray-800
                                ${isTop 
                                    ? 'shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] ring-1 ring-gray-900/5 dark:ring-white/10 hover:ring-orange-500/30 hover:shadow-orange-500/10' 
                                    : 'shadow-lg opacity-90 brightness-95 dark:brightness-75'
                                }
                            `}
                            style={{
                                transform: `translateY(${translateY}px) scale(${scale}) rotateX(2deg)`,
                                zIndex: zIndex,
                                transformOrigin: 'bottom center'
                            }}
                        >
                            {/* Card Content */}
                            <div className="flex items-center justify-between p-3 h-full">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden relative flex-shrink-0 shadow-inner">
                                        {rest.image ? (
                                            <img src={rest.image} alt={rest.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-orange-500 bg-orange-50 dark:bg-orange-500/10">
                                                <span className="font-bold text-xs">🍽️</span>
                                            </div>
                                        )}
                                        {restaurants.length > 1 && (
                                            <div className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                                                {rest.count}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <p className="font-bold text-gray-800 dark:text-gray-200 text-sm leading-tight line-clamp-1">{rest.name}</p>
                                        <p className="text-xs text-orange-600 dark:text-orange-500 font-semibold">
                                            {isTop && restaurants.length > 1 ? `+ ${restaurants.length - 1} more` : `${rest.count} item${rest.count > 1 ? 's' : ''}`}
                                        </p>
                                    </div>
                                </div>

                                {isTop && (
                                    <div className="flex items-center gap-3">
                                        <div className="text-right pr-1">
                                            <p className="font-black text-gray-900 dark:text-white text-lg leading-none">₹{totalPrice}</p>
                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5 font-medium">Total</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 text-white">
                                            <CartIcon className="w-5 h-5" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Glass Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 dark:from-white/5 to-transparent pointer-events-none"></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const TrackingFAB = ({ onTrack }) => {
    const [activeOrderId, setActiveOrderId] = useState(null);

    useEffect(() => {
        // Check periodically or just on mount. For now, on mount + interval to catch updates
        const checkOrder = () => {
            const id = localStorage.getItem('activeOrderId');
            if (id) setActiveOrderId(id);
        };
        
        checkOrder();
        // Optional: Check every few seconds if multiple tabs behavior matters, 
        // but typically user stays on this tab. Sticking to mount for now.
    }, []);

    if (!activeOrderId) return null;

    return (
        <button
            onClick={() => onTrack(activeOrderId)}
            className="fixed bottom-24 right-4 md:bottom-10 md:right-10 z-30 w-14 h-14 bg-green-500 rounded-full shadow-[0_4px_20px_rgba(34,197,94,0.4)] flex items-center justify-center text-white animate-in zoom-in duration-300 hover:scale-110 transition-transform border-4 border-white dark:border-gray-900"
        >
            <Bike className="w-6 h-6" />
        </button>
    );
};

export default function App() {
    const location = useLocation();
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cartItems');
        return saved ? JSON.parse(saved) : [];
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationPickerPurpose, setLocationPickerPurpose] = useState('delivery');

    const [userLocation, setUserLocation] = useState(() => {
        const saved = localStorage.getItem('userLocation');
        return saved ? JSON.parse(saved) : null;
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

    const [address, setAddress] = useState({
        fullName: '',
        emailId: '',
        phoneNumber: '',
        fullAddress: ''
    });

    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Load saved profile data
    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            try {
                setUserProfile(JSON.parse(savedProfile));
            } catch (error) {
                console.error('Error parsing saved profile:', error);
            }
        }
    }, []);

    // Persist cart to localStorage
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Sync auth data
    useEffect(() => {
        if (currentUser) {
            setUserProfile(prev => ({
                ...prev,
                fullName: currentUser.displayName || prev.fullName,
                email: currentUser.email || prev.email
            }));
        }
    }, [currentUser]);

    // Sync profile to checkout address
    useEffect(() => {
        if (userProfile) {
            setAddress(prev => ({
                ...prev,
                fullName: userProfile.fullName || prev.fullName,
                emailId: userProfile.email || prev.emailId,
                phoneNumber: userProfile.phoneNumber || prev.phoneNumber,
                fullAddress: userProfile.location || prev.fullAddress
            }));
        }
    }, [userProfile]);

    // Sync location specifically
    useEffect(() => {
        if (userLocation) {
            setAddress(prev => ({ ...prev, fullAddress: userLocation.address }));
        }
    }, [userLocation]);

    const handleLocationSelect = (location) => {
        if (locationPickerPurpose === 'delivery') {
            setUserLocation(location);
            localStorage.setItem('userLocation', JSON.stringify(location));

            const newSavedAddr = {
                id: Date.now(),
                label: location.addressType || 'Other',
                address: location.fullAddress || location.address,
                isDefault: (userProfile.savedAddresses || []).length === 0,
                coordinates: { lat: location.lat, lng: location.lng }
            };

            const isDuplicate = (userProfile.savedAddresses || []).some(
                addr => addr.address === newSavedAddr.address
            );

            if (!isDuplicate) {
                const updatedProfile = {
                    ...userProfile,
                    savedAddresses: [...(userProfile.savedAddresses || []), newSavedAddr]
                };
                setUserProfile(updatedProfile);
                localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                showToastMessage(`Address saved to your ${newSavedAddr.label} profile!`);
            }
        } else if (locationPickerPurpose === 'profile-main') {
            const updatedProfile = {
                ...userProfile,
                location: location.address,
                coordinates: { lat: location.lat, lng: location.lng }
            };
            setUserProfile(updatedProfile);
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            showToastMessage('Profile location updated!');
        } else if (locationPickerPurpose === 'profile-saved') {
            const newAddr = {
                id: Date.now(),
                label: location.addressType || 'Other',
                address: location.fullAddress || location.address,
                isDefault: (userProfile.savedAddresses || []).length === 0,
                coordinates: { lat: location.lat, lng: location.lng }
            };
            const updatedProfile = {
                ...userProfile,
                savedAddresses: [...(userProfile.savedAddresses || []), newAddr]
            };
            setUserProfile(updatedProfile);
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            showToastMessage('Address added to your profile!');
        }
        setShowLocationModal(false);
    };

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    const addToCart = (item, quantity = 1) => {
        setCartItems(prev => [...prev, {
            ...item,
            quantity,
            vendor: item.restaurants?.name || item.vendor || 'Unknown',
            restaurantName: item.restaurants?.name || item.restaurantName || 'Unknown'
        }]);
    };

    const handlePayNow = (addressData) => {
        if (!addressData.fullName.trim() || !addressData.emailId.trim() || !addressData.phoneNumber.trim() || !addressData.fullAddress.trim()) {
            alert("Please fill in all delivery information fields.");
            return;
        }

        const customerInfo = {
            ...addressData,
            latitude: userLocation?.lat,
            longitude: userLocation?.lng
        };

        const cartWithVendor = cartItems.map(item => ({
            ...item,
            vendor: item.vendor || "Unknown Vendor",
            restaurantName: item.restaurantName || "Unknown Restaurant"
        }));

        navigate("/payment", { state: { customerInfo, cart: cartWithVendor } });
    };

    return (
        <div className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] min-h-screen font-sans pb-16 md:pb-0">
            <Header
                cartItems={cartItems}
                onCartClick={() => navigate('/checkout')}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                isProfileOpen={isProfileOpen}
                onProfileToggle={() => setIsProfileOpen(!isProfileOpen)}
                onProfileClose={() => setIsProfileOpen(false)}
                onMyProfile={() => { navigate('/profile'); setIsProfileOpen(false); }}
                onLogoClick={() => { navigate('/'); setSearchQuery(''); }}
                userLocation={userLocation}
                onLocationClick={() => { setLocationPickerPurpose('delivery'); setShowLocationModal(true); }}
            />
            <LocationSelector
                isOpen={showLocationModal}
                onClose={() => setShowLocationModal(false)}
                onLocationSelect={handleLocationSelect}
                savedAddresses={userProfile.savedAddresses || []}
            />

            <Routes>
                <Route path="/" element={
                    <HomePageContent
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        cartItems={cartItems}
                        setCartItems={setCartItems}
                        showToastMessage={showToastMessage}
                        onSurpriseMe={() => navigate('/surprise')}
                    />
                } />
                <Route path="/profile" element={
                    <MyProfilePage
                        onBack={() => navigate('/')}
                        userProfile={userProfile}
                        setUserProfile={setUserProfile}
                        onAddAddress={(purpose) => {
                            setLocationPickerPurpose(purpose);
                            setShowLocationModal(true);
                        }}
                        addToCart={addToCart}
                        showToastMessage={showToastMessage}
                    />
                } />
                <Route path="/restaurant/:restaurantId" element={
                    <RestaurantMenuPage
                        onBack={() => navigate('/')}
                        cartItems={cartItems}
                        setCartItems={setCartItems}
                        searchQuery={searchQuery}
                        showToastMessage={showToastMessage}
                    />
                } />
                <Route path="/surprise" element={
                    <SurpriseMe
                        supabase={supabase}
                        addToCart={(item) => {
                            addToCart(item, 1);
                            showToastMessage(`${item.name} added to cart!`);
                        }}
                        onClose={() => navigate(-1)}
                    />
                } />
                <Route path="/checkout" element={
                    <CheckoutPage
                        cartItems={cartItems}
                        onBack={() => navigate(-1)}
                        address={address}
                        setAddress={setAddress}
                        setCartItems={setCartItems}
                        onPayNow={handlePayNow}
                        userLocation={userLocation}
                    />
                } />
            </Routes>



            <CartFloatingPanel 
                cartItems={cartItems} 
                onClick={() => navigate('/checkout')}
                currentPath={location.pathname}
            />
            
            <TrackingFAB onTrack={(orderId) => navigate(`/track/${orderId}`)} />

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2">
                <button onClick={() => { navigate('/'); setSearchQuery(''); }} className="flex flex-col items-center text-xs text-gray-500 hover:text-orange-500">
                    <HomeIcon className="h-6 w-6" />
                    <span>Home</span>
                </button>
                <button onClick={() => navigate('/checkout')} className={`flex flex-col items-center text-xs relative ${cartItems.length > 0 ? 'text-orange-500' : 'text-gray-500'}`}>
                    <CartIcon className="h-6 w-6" />
                    {cartItems.length > 0 && <span className="absolute -top-1 right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>}
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
