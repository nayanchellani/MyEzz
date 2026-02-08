import React, { useState, useEffect } from 'react';
import { MapPin, Camera, Package, MapPinned, Trash2, Mail, Phone, User, ChevronLeft, RotateCw, Edit3, ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import Toast from '../Shared/Toast';
import { supabase } from '../../supabaseClient';

const MyProfilePage = ({ onBack, userProfile, setUserProfile, onAddAddress, addToCart, showToastMessage }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(userProfile);
    const [onlineOrders, setOnlineOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });
    const [newAddress, setNewAddress] = useState({ label: '', address: '' });
    const [processingOrderId, setProcessingOrderId] = useState(null);

    useEffect(() => {
        if (!userProfile.email) return;

        const fetchOrders = async () => {
            setLoadingOrders(true);
            try {
                const scriptUrl = import.meta.env.VITE_APP_SCRIPT_URL;
                if (!scriptUrl) {
                    console.error("VITE_APP_SCRIPT_URL not found");
                    return;
                }
                const response = await fetch(`${scriptUrl}?email=${userProfile.email}`);
                const data = await response.json();
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
        const privateFields = ['email', 'phoneNumber', 'fullName', 'location'];
        const hasPrivateChanges = privateFields.some(field => editedProfile[field] !== userProfile[field]);

        setToast({
            isVisible: true,
            message: hasPrivateChanges ? "Your profile has been updated successfully!" : "Profile updated successfully!",
            type: 'success'
        });

        setUserProfile(editedProfile);
        setIsEditing(false);
        localStorage.setItem('userProfile', JSON.stringify(editedProfile));
        window.dispatchEvent(new Event("userProfileUpdated"));
    };

    const handleCancel = () => {
        setEditedProfile(userProfile);
        setIsEditing(false);
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
        alert('Order tracking feature coming soon!');
    };

    const handleOrderAgain = async (order) => {
        if (!addToCart || !showToastMessage) {
            console.error('addToCart or showToastMessage function not provided');
            return;
        }

        setProcessingOrderId(order.orderId);

        try {
            let addedCount = 0;
            let unavailableCount = 0;
            const unavailableItems = [];

            for (const orderItem of order.items) {
                // Fetch current item data from Supabase
                const { data: currentItem, error } = await supabase
                    .from('menu_items')
                    .select('*, restaurants(name)')
                    .eq('name', orderItem.name)
                    .single();

                if (error || !currentItem) {
                    unavailableCount++;
                    unavailableItems.push(orderItem.name);
                    continue;
                }

                // Add item to cart with original quantity
                for (let i = 0; i < orderItem.quantity; i++) {
                    addToCart(currentItem, 1);
                }
                addedCount += orderItem.quantity;
            }

            // Show result notification
            if (addedCount > 0 && unavailableCount === 0) {
                showToastMessage(`All ${addedCount} item${addedCount !== 1 ? 's' : ''} added to cart!`);
            } else if (addedCount > 0 && unavailableCount > 0) {
                showToastMessage(`${addedCount} item${addedCount !== 1 ? 's' : ''} added to cart. ${unavailableCount} item${unavailableCount !== 1 ? 's were' : ' was'} unavailable.`);
            } else {
                showToastMessage('No items could be added. All items are unavailable.');
            }

        } catch (error) {
            console.error('Error processing Order Again:', error);
            showToastMessage('Failed to process order. Please try again.');
        } finally {
            setProcessingOrderId(null);
        }
    };

    const displayProfile = isEditing ? editedProfile : userProfile;

    useEffect(() => {
        if (displayProfile?.currentOrder?.status === "Delivered") {
            const completedOrder = displayProfile.currentOrder;
            const updatedProfile = {
                ...displayProfile,
                previousOrders: [...(displayProfile.previousOrders || []), completedOrder],
                currentOrder: null,
            };
            setUserProfile(updatedProfile);
            localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
        }
    }, [displayProfile?.currentOrder?.status]);

    return (
        <div className="min-h-screen bg-[#E5E7EB] dark:bg-gray-900">
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />

            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors font-medium"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">My Profile</h1>
                    <div className="w-20"></div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

                {/* Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 p-1 shadow-lg shadow-orange-200 dark:shadow-orange-900/20">
                                <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                    {displayProfile.profilePhoto ? (
                                        <img src={displayProfile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold bg-gradient-to-br from-orange-500 to-amber-500 bg-clip-text text-transparent">
                                            {displayProfile.fullName?.charAt(0)?.toUpperCase() || "U"}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2.5 rounded-full cursor-pointer hover:bg-orange-600 shadow-lg transition-colors">
                                    <Camera className="w-4 h-4" />
                                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                                </label>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {displayProfile.fullName || "User"}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">{displayProfile.email}</p>
                            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-semibold">
                                    <ShoppingBag className="w-4 h-4" />
                                    {onlineOrders ? onlineOrders.length : 0} Orders
                                </div>
                            </div>
                        </div>

                        {/* Edit Button */}
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-lg shadow-orange-200 dark:shadow-orange-900/20 transition-all"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                {/* Personal Details */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-orange-500" />
                        Personal Details
                    </h3>
                    <div className="grid gap-5 sm:grid-cols-2">
                        {[
                            { label: "Full Name", key: "fullName", type: "text", icon: User },
                            { label: "Email", key: "email", type: "email", icon: Mail },
                            { label: "Phone", key: "phoneNumber", type: "tel", icon: Phone },
                            { label: "Address", key: "location", type: "text", icon: MapPin },
                        ].map((field) => {
                            const Icon = field.icon;
                            return (
                                <div key={field.key} className={field.key === 'location' ? 'sm:col-span-2' : ''}>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                        {field.label}
                                    </label>
                                    {isEditing ? (
                                        field.key === 'location' ? (
                                            <div
                                                className="relative cursor-pointer group"
                                                onClick={() => onAddAddress('profile-main')}
                                            >
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={editedProfile[field.key] || ""}
                                                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-pointer group-hover:border-orange-300 dark:group-hover:border-orange-700 transition-colors"
                                                    placeholder="Click to select location"
                                                />
                                                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    type={field.type}
                                                    value={editedProfile[field.key] || ""}
                                                    onChange={(e) => setEditedProfile({ ...editedProfile, [field.key]: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-orange-400 dark:focus:border-orange-600 focus:ring-0 outline-none transition-colors"
                                                />
                                                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            </div>
                                        )
                                    ) : (
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                                <Icon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <span className="text-gray-900 dark:text-gray-100 font-medium">
                                                {displayProfile[field.key] || "Not provided"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Current Order */}
                {displayProfile.currentOrder && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-3xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Current Order</h3>
                        </div>
                        <div className="grid gap-3 mb-5">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Order ID</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{displayProfile.currentOrder.orderId}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Status</span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">{displayProfile.currentOrder.status}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Date</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{displayProfile.currentOrder.orderDate}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleTrackOrder}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors"
                        >
                            Track Order
                        </button>
                    </div>
                )}

                {/* Order History */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Package className="w-5 h-5 text-orange-500" />
                        Order History
                    </h3>
                    {loadingOrders ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-3 border-orange-500 border-t-transparent"></div>
                        </div>
                    ) : onlineOrders && onlineOrders.length > 0 ? (
                        <div className="space-y-4">
                            {onlineOrders.map((order) => (
                                <div key={order.orderId} className="border border-gray-100 dark:border-gray-700 rounded-2xl p-5 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-lg">Order #{order.orderId}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-xl text-gray-900 dark:text-white">₹{order.total}</p>
                                            <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full mt-1 font-medium ${order.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                {order.status === 'Delivered' && <CheckCircle className="w-3 h-3" />}
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm text-gray-600 dark:text-gray-400 py-1">
                                                <span>{item.quantity}x {item.name}</span>
                                                <span className="font-medium">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleOrderAgain(order)}
                                        disabled={processingOrderId === order.orderId}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-orange-300 disabled:to-amber-300 text-white rounded-xl font-semibold transition-all disabled:cursor-not-allowed shadow-sm"
                                    >
                                        <RotateCw className={`w-4 h-4 ${processingOrderId === order.orderId ? 'animate-spin' : ''}`} />
                                        {processingOrderId === order.orderId ? 'Adding to Cart...' : 'Order Again'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <Package className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No orders yet</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Your order history will appear here</p>
                        </div>
                    )}
                </div>

                {/* Saved Addresses */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <MapPinned className="w-5 h-5 text-orange-500" />
                            Saved Addresses
                        </h3>
                        {isEditing && (
                            <button
                                onClick={() => onAddAddress('profile-saved')}
                                className="flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-semibold transition-colors"
                            >
                                <MapPin className="w-4 h-4" />
                                Add New
                            </button>
                        )}
                    </div>
                    {displayProfile.savedAddresses && displayProfile.savedAddresses.length > 0 ? (
                        <div className="space-y-3">
                            {displayProfile.savedAddresses.map((addr) => (
                                <div key={addr.id} className="border border-gray-100 dark:border-gray-700 rounded-2xl p-4 hover:shadow-sm transition-shadow">
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                                    <MapPinned className="w-3.5 h-3.5 text-orange-500" />
                                                </div>
                                                <span className="font-semibold text-gray-900 dark:text-white">{addr.label}</span>
                                                {addr.isDefault && (
                                                    <span className="text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2.5 py-0.5 rounded-full font-medium">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">{addr.address}</p>
                                        </div>
                                        {isEditing && (
                                            <div className="flex flex-col gap-2">
                                                {!addr.isDefault && (
                                                    <button
                                                        onClick={() => handleSetDefaultAddress(addr.id)}
                                                        className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                                                    >
                                                        Set Default
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <MapPinned className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No saved addresses</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Add addresses for faster checkout</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                    <div className="flex gap-4 sticky bottom-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-6 py-3.5 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 px-6 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold shadow-lg shadow-green-200 dark:shadow-green-900/20 transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProfilePage;