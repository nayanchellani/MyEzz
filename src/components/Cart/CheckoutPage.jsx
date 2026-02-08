import React from 'react';
import { Wallet, MapPin, Utensils } from 'lucide-react';

const CheckoutPage = ({ cartItems = [], onBack = () => window.history.back(), address = { fullName: '', emailId: '', phoneNumber: '', fullAddress: '' }, setAddress = () => {}, setCartItems = () => {}, onPayNow = () => {}, userLocation = null }) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const platformFee = cartItems.length > 0 ? 8 : 0;

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
                if (item.id === itemId && currentVendor === itemVendor) {
                    return { ...item, quantity: item.quantity + change };
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] rounded-2xl shadow-2xl p-6 w-full max-w-md m-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Your Cart</h2>
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="bg-orange-100 dark:bg-orange-900/20 p-6 rounded-full mb-4">
                            <Wallet className="w-12 h-12 text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-[250px]">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <button
                            onClick={onBack}
                            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-orange-200/50 dark:shadow-orange-900/30 transform hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02]"
                        >
                            Start Ordering
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {(() => {
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
                                        <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 mb-2 pb-1 border-b border-orange-200 dark:border-orange-800 flex items-center gap-2">
                                            <Utensils className="w-4 h-4" /> {vendor}
                                        </h3>
                                        {items.map((item, index) => (
                                            <div key={`${item.id}-${index}`} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 mb-3 hover:border-orange-200 dark:hover:border-orange-800 transition-colors">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-lg">{item.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">₹{item.price} each</p>
                                                </div>

                                                <div className="flex items-center gap-4">
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
                                                            className="w-8 h-8 flex items-center justify-center rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all active:scale-95"
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
                            <div className="flex justify-between font-bold text-xl text-gray-900 dark:text-white pt-2"><span>Grand Total</span><span className="text-orange-600 dark:text-orange-400">₹{total.toFixed(2)}</span></div>
                        </div>
                        <div className="mt-6">
                            <h3 className="font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-orange-500" /> Delivery Information
                            </h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    name="fullName"
                                    value={address.fullName}
                                    onChange={handleAddressChange}
                                    placeholder="Full Name"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                                />
                                <input
                                    type="email"
                                    name="emailId"
                                    value={address.emailId}
                                    onChange={handleAddressChange}
                                    placeholder="Email ID"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                                />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={address.phoneNumber}
                                    onChange={handleAddressChange}
                                    placeholder="Phone Number"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                                />
                                <input
                                    type="text"
                                    name="fullAddress"
                                    value={address.fullAddress}
                                    onChange={handleAddressChange}
                                    placeholder="Full Delivery Address"
                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                                />
                                {/* {userLocation && userLocation.lat && (
                                    <div className="flex gap-4 px-1">
                                        <div className="flex-1 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Latitude</p>
                                            <p className="text-sm font-mono text-orange-600 dark:text-orange-400">{userLocation.lat.toFixed(6)}</p>
                                        </div>
                                        <div className="flex-1 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Longitude</p>
                                            <p className="text-sm font-mono text-orange-600 dark:text-orange-400">{userLocation.lng.toFixed(6)}</p>
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        </div>
                        <button onClick={() => onPayNow(address)} className="w-full mt-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-200/50 dark:shadow-orange-900/30 transform hover:scale-[1.02] active:scale-[0.98]">
                            Pay Now
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CheckoutPage;
