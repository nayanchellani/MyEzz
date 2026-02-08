import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Navigation, ExternalLink, Loader2, Check, Clock, Bike, Package } from 'lucide-react';

const CENTRAL_BACKEND_URL = import.meta.env.VITE_CENTRAL_BACKEND_URL || "http://localhost:5050";

const LiveTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch order details
    useEffect(() => {
        if (!orderId) return;
        let isMounted = true;

        const fetchOrder = async () => {
            try {
                const response = await fetch(`${CENTRAL_BACKEND_URL}/api/orders/${orderId}`);
                if (!response.ok) throw new Error('Order not found');
                const data = await response.json();
                if (!isMounted) return;
                setOrder(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch order:", err);
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        fetchOrder();
        const interval = setInterval(fetchOrder, 5000); // Poll every 5s for smoother timeline updates
        
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [orderId]);

    const handleTrackOnMaps = () => {
        if (order?.live_tracking_link) {
            window.open(order.live_tracking_link, '_blank');
        }
    };

    // Determine current step index based on status
    const getStepIndex = (status) => {
        const statusOrder = [
            ['pending', 'new'],              // Step 0: Placed
            ['preparing'],                   // Step 1: Preparing
            ['ready', 'accepted'],           // Step 2: Ready / Rider Assigned
            ['pickup_completed', 'delivery_started', 'out_for_delivery'], // Step 3: Out for Delivery
            ['delivered']                    // Step 4: Delivered
        ];

        // Find which group the current status belongs to
        const currentIndex = statusOrder.findIndex(group => group.includes(status));
        
        // If status is not found (e.g. cancelled), default to 0
        if (currentIndex === -1) {
            if (status === 'cancelled') return -1;
            return 0;
        }

        return currentIndex;
    };

    const currentStep = order ? getStepIndex(order.status) : 0;

    const timelineSteps = [
        { title: 'Order Placed', desc: 'We have received your order', icon: Clock },
        { title: 'Preparing', desc: 'Kitchen is preparing your food', icon: Package },
        { title: 'Ready for Pickup', desc: 'Rider is on the way to restaurant', icon: Bike },
        { title: 'Out for Delivery', desc: 'Your food is on the way!', icon: Navigation },
        { title: 'Delivered', desc: 'Enjoy your meal!', icon: Check }
    ];

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-orange-500 text-white rounded-lg">Go Back</button>
        </div>
    );

    const hasTrackingLink = order?.live_tracking_link && 
        ['pickup_completed', 'delivery_started', 'out_for_delivery'].includes(order?.status);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col pb-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 p-4 shadow-sm z-[1001] flex items-center gap-4 sticky top-0">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 dark:text-gray-200" />
                </button>
                <div>
                    <h1 className="text-lg font-bold dark:text-white">Track Order</h1>
                    <p className="text-xs text-gray-500">#{orderId?.slice(-8).toUpperCase()}</p>
                </div>
            </div>

            <div className="flex-1 p-4 max-w-2xl mx-auto w-full space-y-6">
                
                {/* Timeline Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold dark:text-white mb-6">Order Status</h2>
                    
                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700" />

                        <div className="space-y-8">
                            {timelineSteps.map((step, index) => {
                                const isCompleted = index < currentStep || currentStep === 4; // All marked if delivered
                                const isActive = index === currentStep && currentStep !== 4;
                                const isPending = index > currentStep;

                                return (
                                    <div key={index} className="relative flex items-start gap-4">
                                        {/* Icon/Dot */}
                                        <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors duration-300
                                            ${isCompleted ? 'bg-green-500 border-green-100 dark:border-green-900 text-white' : 
                                              isActive ? 'bg-orange-500 border-orange-100 dark:border-orange-900 text-white animate-pulse' : 
                                              'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-400'}`}>
                                            {isCompleted ? <Check size={20} /> : <step.icon size={20} />}
                                        </div>

                                        {/* Text */}
                                        <div className={`pt-2 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                                            <h3 className={`font-semibold text-base ${isActive ? 'text-orange-600 dark:text-orange-400' : 'dark:text-white'}`}>
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-start gap-3 border border-gray-100 dark:border-gray-700">
                    <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Delivering To</p>
                        <p className="text-sm font-medium dark:text-gray-200">
                            {order?.delivery_address?.address_text || 'Address not available'}
                        </p>
                    </div>
                </div>

                {/* Live Tracking Actions */}
                {hasTrackingLink ? (
                    <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-6 border border-orange-100 dark:border-orange-900/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <h3 className="font-bold text-orange-900 dark:text-orange-100">Live Delivery Tracking</h3>
                        </div>
                        <p className="text-sm text-orange-800 dark:text-orange-200/80 mb-4">
                            Your rider has started the delivery. Track their real-time location on Google Maps.
                        </p>
                        <button
                            onClick={handleTrackOnMaps}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
                        >
                            <Navigation className="w-5 h-5" />
                            Track on Google Maps
                            <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                        </button>
                    </div>
                ) : (
                    currentStep === 4 ? (
                         <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-6 text-center border border-green-100 dark:border-green-900/30">
                            <Check className="w-12 h-12 text-green-500 mx-auto mb-2" />
                            <h3 className="font-bold text-green-900 dark:text-green-100">Delivered!</h3>
                            <p className="text-sm text-green-700 dark:text-green-200/80">
                                Enjoy your meal. Thanks for ordering!
                            </p>
                        </div>
                    ) : null
                )}

                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        {order?.status === 'cancelled' ? 'This order has been cancelled' : 'Updates will refresh automatically'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LiveTracking;
