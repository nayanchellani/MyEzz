import React, { useState } from 'react';
import { X, Leaf, GlassWater, UtensilsCrossed, Dices, ShoppingCart, RotateCcw, AlertCircle, Check } from 'lucide-react';
import { supabase as supabaseClient } from '../../supabaseClient';

const SurpriseMe = ({ supabase = supabaseClient, addToCart = () => {}, onClose = () => window.history.back(), restaurantId = null, restaurantName = null }) => {
    const [budget, setBudget] = useState(300);
    const [selectedTypes, setSelectedTypes] = useState(['Vegetarian']);
    const [rolling, setRolling] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleType = (type) => {
        setSelectedTypes(prev => {
            const dietaryOptions = ['Jain', 'Vegetarian', 'Non-veg'];

            if (dietaryOptions.includes(type)) {
                // For dietary options (Jain, Veg, Non-veg) - mutually exclusive
                if (prev.includes(type)) {
                    // If already selected, don't deselect (always keep one selected)
                    return prev;
                } else {
                    // Replace any dietary option with the new one, keep beverages if present
                    const hasBeverages = prev.includes('Beverages');
                    return hasBeverages ? [type, 'Beverages'] : [type];
                }
            } else {
                // For Beverages - toggle on/off
                if (prev.includes('Beverages')) {
                    return prev.filter(t => t !== 'Beverages');
                } else {
                    return [...prev, 'Beverages'];
                }
            }
        });
    };

    const getSurpriseDish = async () => {
        if (selectedTypes.length === 0) {
            setError('Please select at least one food type!');
            setTimeout(() => setError(null), 3000);
            return;
        }

        setRolling(true);
        setResult(null);
        setError(null);

        try {
            // Separate beverages and food types
            const hasBeverages = selectedTypes.includes('Beverages');
            const foodTypes = selectedTypes.filter(t => t !== 'Beverages');

            let allItems = [];

            // Fetch beverages if selected
            if (hasBeverages) {
                let beverageQuery = supabase
                    .from('menu_items')
                    .select('id, name, price, is_veg, category_id, restaurant_id, restaurants(name, image_url)')
                    .lte('price', budget + 20) // Fetch items up to budget + 20 for priority logic
                    .or('category_id.eq.5,name.ilike.%Shake%,name.ilike.%Juice%,name.ilike.%Tea%,name.ilike.%Coffee%,name.ilike.%Cold Drink%,name.ilike.%Lassi%,name.ilike.%Mojito%');

                // Filter by restaurant if restaurantId is provided
                if (restaurantId) {
                    beverageQuery = beverageQuery.eq('restaurant_id', restaurantId);
                }

                const { data: beverageData } = await beverageQuery;
                if (beverageData) allItems = [...allItems, ...beverageData];
            }

            // Fetch food items based on selected types
            if (foodTypes.length > 0) {
                for (const type of foodTypes) {
                    let foodQuery = supabase
                        .from('menu_items')
                        .select('id, name, price, is_veg, category_id, restaurant_id, restaurants(name, image_url)')
                        .lte('price', budget + 20) // Fetch items up to budget + 20 for priority logic
                        .neq('category_id', 5)
                        .not('name', 'ilike', '%Shake%')
                        .not('name', 'ilike', '%Juice%')
                        .not('name', 'ilike', '%Tea%')
                        .not('name', 'ilike', '%Coffee%')
                        .not('name', 'ilike', '%Cold Drink%')
                        .not('name', 'ilike', '%Lassi%')
                        .not('name', 'ilike', '%Mojito%');

                    // Filter by restaurant if restaurantId is provided
                    if (restaurantId) {
                        foodQuery = foodQuery.eq('restaurant_id', restaurantId);
                    }

                    if (type === 'Jain') {
                        foodQuery = foodQuery
                            .eq('is_veg', true)
                            .ilike('name', '%Jain%');
                    } else if (type === 'Vegetarian') {
                        foodQuery = foodQuery
                            .eq('is_veg', true)
                            .not('name', 'ilike', '%Jain%');
                    } else if (type === 'Non-veg') {
                        foodQuery = foodQuery.eq('is_veg', false);
                    }

                    const { data: foodData } = await foodQuery;
                    if (foodData) allItems = [...allItems, ...foodData];
                }
            }

            // Remove duplicates based on id
            const uniqueItems = Array.from(
                new Map(allItems.map(item => [item.id, item])).values()
            );

            if (uniqueItems.length === 0) {
                setError('Oops! No items found. Try increasing budget or changing options!');
                setRolling(false);
                setTimeout(() => setError(null), 3000);
                return;
            }

            // Apply priority scoring based on budget closeness:
            // Priority 1: Items priced between budget and budget + 20 (slightly above)
            // Priority 2: Items priced exactly at budget
            // Priority 3: Items priced less than budget
            uniqueItems.forEach(item => {
                const price = item.price;
                if (price > budget && price <= budget + 20) {
                    item.budgetPriority = 1; // Slightly above - HIGHEST priority
                } else if (price === budget) {
                    item.budgetPriority = 2; // Exact match
                } else if (price < budget) {
                    item.budgetPriority = 3; // Below budget - fallback
                } else {
                    item.budgetPriority = 99; // Should not happen, but exclude
                }
            });

            // Filter out items that are too expensive (more than budget + 20)
            const validItems = uniqueItems.filter(item => item.budgetPriority <= 3);

            // Sort by priority, then by closeness to budget
            validItems.sort((a, b) => {
                if (a.budgetPriority !== b.budgetPriority) {
                    return a.budgetPriority - b.budgetPriority;
                }
                // For same priority, prefer prices closer to budget
                return Math.abs(a.price - budget) - Math.abs(b.price - budget);
            });

            // Group items by restaurant (using validItems which are sorted by priority)
            const itemsByRestaurant = {};
            validItems.forEach(item => {
                if (!itemsByRestaurant[item.restaurant_id]) {
                    itemsByRestaurant[item.restaurant_id] = [];
                }
                itemsByRestaurant[item.restaurant_id].push(item);
            });

            // Generate all valid combinations (1 or more items from single vendor)
            const allCombinations = [];
            const targetMin = budget - 20; // Ideally within 20 rupees of budget

            // If restaurantId is provided, only use items from that restaurant
            const restaurantsToProcess = restaurantId
                ? [itemsByRestaurant[restaurantId]].filter(Boolean)
                : Object.values(itemsByRestaurant);

            restaurantsToProcess.forEach(restaurant => {
                // Add all single items as combinations
                restaurant.forEach(item => {
                    allCombinations.push({
                        items: [item],
                        total: item.price,
                        closeness: budget - item.price, // Lower is closer to budget
                    });
                });

                // Generate multi-item combinations using greedy approach
                // Sort items by price descending for greedy algorithm
                const sortedItems = [...restaurant].sort((a, b) => b.price - a.price);

                // Try to build combinations starting from each item
                for (let i = 0; i < sortedItems.length; i++) {
                    let combo = [sortedItems[i]];
                    let total = sortedItems[i].price;

                    // Add more items greedily
                    for (let j = i + 1; j < sortedItems.length; j++) {
                        if (total + sortedItems[j].price <= budget) {
                            combo.push(sortedItems[j]);
                            total += sortedItems[j].price;
                        }
                    }

                    // Only add if it's a multi-item combination
                    if (combo.length > 1) {
                        allCombinations.push({
                            items: combo,
                            total: total,
                            closeness: budget - total,
                        });
                    }
                }
            });

            if (allCombinations.length === 0) {
                setError('Oops! No items found. Try increasing budget or changing options!');
                setRolling(false);
                setTimeout(() => setError(null), 3000);
                return;
            }

            // Add diversity scoring to prevent beverage-only results
            allCombinations.forEach(combo => {
                // Check if combo contains non-beverage items
                const hasNonBeverage = combo.items.some(item =>
                    item.category_id !== 5 &&
                    !['Shake', 'Juice', 'Tea', 'Coffee', 'Cold Drink', 'Lassi', 'Mojito'].some(
                        term => item.name.toLowerCase().includes(term.toLowerCase())
                    )
                );

                // Boost score for combinations with food items (not just beverages)
                combo.diversityScore = hasNonBeverage ? 1 : 0;
            });

            // Sort by diversity first (food items preferred), then by closeness to budget
            allCombinations.sort((a, b) => {
                if (a.diversityScore !== b.diversityScore) {
                    return b.diversityScore - a.diversityScore; // Higher diversity first
                }
                return a.closeness - b.closeness; // Then closer to budget
            });

            // Select from top 40% of combinations to maintain variety
            const topCombos = allCombinations.slice(0, Math.ceil(allCombinations.length * 0.4));
            const randomCombo = topCombos[Math.floor(Math.random() * topCombos.length)];

            setTimeout(() => {
                setResult(randomCombo);
                setSelectedItems(randomCombo.items.map(item => item.id)); // Select all items by default
                setRolling(false);
            }, 1500);
        } catch (error) {
            console.error('Error fetching dish:', error);
            setError('Something went wrong! Please try again.');
            setRolling(false);
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleReroll = () => {
        // Keep selected items and reroll only unselected ones
        if (result && selectedItems.length > 0) {
            // Keep selected items, reroll the rest
            setRolling(true);
            setError(null);

            // Get the restaurant ID from the current result or use the prop
            const currentRestaurantId = restaurantId || result.items[0]?.restaurant_id;
            const keptItems = result.items.filter(item => selectedItems.includes(item.id));
            const keptTotal = keptItems.reduce((sum, item) => sum + item.price, 0);
            const remainingBudget = budget - keptTotal;

            if (!currentRestaurantId) {
                setError('Unable to reroll: Restaurant information missing.');
                setRolling(false);
                setTimeout(() => setError(null), 3000);
                return;
            }

            if (remainingBudget <= 0) {
                setError('Selected items exceed budget! Please deselect some items.');
                setRolling(false);
                setTimeout(() => setError(null), 3000);
                return;
            }

            // Reroll with remaining budget and same restaurant
            getSurpriseDishForReroll(currentRestaurantId, remainingBudget, keptItems, keptTotal);
        } else {
            // No items selected, reroll everything
            setRolling(true);
            setResult(null);
            setSelectedItems([]);
            getSurpriseDish();
        }
    };

    const getSurpriseDishForReroll = async (restaurantId, remainingBudget, keptItems, keptTotal) => {
        try {
            // Similar logic to getSurpriseDish but with remaining budget
            const hasBeverages = selectedTypes.includes('Beverages');
            const foodTypes = selectedTypes.filter(t => t !== 'Beverages');

            let allItems = [];

            // Fetch beverages if selected
            if (hasBeverages) {
                let beverageQuery = supabase
                    .from('menu_items')
                    .select('id, name, price, is_veg, category_id, restaurant_id, restaurants(name)')
                    .eq('restaurant_id', restaurantId)
                    .lte('price', remainingBudget)
                    .or('category_id.eq.5,name.ilike.%Shake%,name.ilike.%Juice%,name.ilike.%Tea%,name.ilike.%Coffee%,name.ilike.%Cold Drink%,name.ilike.%Lassi%,name.ilike.%Mojito%');

                const { data: beverageData } = await beverageQuery;
                if (beverageData) allItems = [...allItems, ...beverageData];
            }

            // Fetch food items based on selected types
            if (foodTypes.length > 0) {
                for (const type of foodTypes) {
                    let foodQuery = supabase
                        .from('menu_items')
                        .select('id, name, price, is_veg, category_id, restaurant_id, restaurants(name)')
                        .eq('restaurant_id', restaurantId)
                        .lte('price', remainingBudget)
                        .neq('category_id', 5)
                        .not('name', 'ilike', '%Shake%')
                        .not('name', 'ilike', '%Juice%')
                        .not('name', 'ilike', '%Tea%')
                        .not('name', 'ilike', '%Coffee%')
                        .not('name', 'ilike', '%Cold Drink%')
                        .not('name', 'ilike', '%Lassi%')
                        .not('name', 'ilike', '%Mojito%');

                    if (type === 'Jain') {
                        foodQuery = foodQuery
                            .eq('is_veg', true)
                            .ilike('name', '%Jain%');
                    } else if (type === 'Vegetarian') {
                        foodQuery = foodQuery
                            .eq('is_veg', true)
                            .not('name', 'ilike', '%Jain%');
                    } else if (type === 'Non-veg') {
                        foodQuery = foodQuery.eq('is_veg', false);
                    }

                    const { data: foodData } = await foodQuery;
                    if (foodData) allItems = [...allItems, ...foodData];
                }
            }

            // Remove duplicates and items already kept
            const keptItemIds = new Set(keptItems.map(item => item.id));
            const uniqueItems = Array.from(
                new Map(allItems
                    .filter(item => !keptItemIds.has(item.id))
                    .map(item => [item.id, item]))
                    .values()
            );

            if (uniqueItems.length === 0) {
                // No new items found, just keep the selected items
                setTimeout(() => {
                    setResult({
                        items: keptItems,
                        total: keptTotal,
                        closeness: 0
                    });
                    setSelectedItems(keptItems.map(item => item.id));
                    setRolling(false);
                }, 1500);
                return;
            }

            // Generate combinations with remaining budget
            const allCombinations = [];
            const targetMin = remainingBudget - 20;

            // Add single items
            uniqueItems.forEach(item => {
                allCombinations.push({
                    items: [item],
                    total: item.price,
                    closeness: remainingBudget - item.price,
                });
            });

            // Generate multi-item combinations
            const sortedItems = [...uniqueItems].sort((a, b) => b.price - a.price);

            for (let i = 0; i < sortedItems.length; i++) {
                let combo = [sortedItems[i]];
                let total = sortedItems[i].price;

                for (let j = i + 1; j < sortedItems.length; j++) {
                    if (total + sortedItems[j].price <= remainingBudget) {
                        combo.push(sortedItems[j]);
                        total += sortedItems[j].price;
                    }
                }

                if (combo.length > 1) {
                    allCombinations.push({
                        items: combo,
                        total: total,
                        closeness: remainingBudget - total,
                    });
                }
            }

            if (allCombinations.length === 0) {
                setTimeout(() => {
                    setResult({
                        items: keptItems,
                        total: keptTotal,
                        closeness: 0
                    });
                    setSelectedItems(keptItems.map(item => item.id));
                    setRolling(false);
                }, 1500);
                return;
            }

            // Add diversity scoring
            allCombinations.forEach(combo => {
                const hasNonBeverage = combo.items.some(item =>
                    item.category_id !== 5 &&
                    !['Shake', 'Juice', 'Tea', 'Coffee', 'Cold Drink', 'Lassi', 'Mojito'].some(
                        term => item.name.toLowerCase().includes(term.toLowerCase())
                    )
                );
                combo.diversityScore = hasNonBeverage ? 1 : 0;
            });

            allCombinations.sort((a, b) => {
                if (a.diversityScore !== b.diversityScore) {
                    return b.diversityScore - a.diversityScore;
                }
                return a.closeness - b.closeness;
            });

            const topCombos = allCombinations.slice(0, Math.ceil(allCombinations.length * 0.4));

            if (topCombos.length === 0) {
                // Fallback: just keep the selected items
                setTimeout(() => {
                    setResult({
                        items: keptItems,
                        total: keptTotal,
                        closeness: 0
                    });
                    setSelectedItems(keptItems.map(item => item.id));
                    setRolling(false);
                }, 1500);
                return;
            }

            const randomCombo = topCombos[Math.floor(Math.random() * topCombos.length)];

            setTimeout(() => {
                // Combine kept items with new items
                const newResult = {
                    items: [...keptItems, ...randomCombo.items],
                    total: keptTotal + randomCombo.total,
                };
                setResult(newResult);
                // Keep selected items selected, and select all new items by default
                setSelectedItems([...keptItems.map(item => item.id), ...randomCombo.items.map(item => item.id)]);
                setRolling(false);
            }, 1500);
        } catch (error) {
            console.error('Error rerolling:', error);
            setError('Something went wrong! Please try again.');
            setRolling(false);
            setTimeout(() => setError(null), 3000);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-orange-950/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-950 w-full max-w-sm rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(234,88,12,0.3)] border border-orange-100 dark:border-orange-900/30 max-h-[90vh] flex flex-col">

                {/* Top Header Section */}
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-6 text-white relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 p-2 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors z-50 cursor-pointer"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-black tracking-tight relative z-10">Magic Pick</h2>
                    <p className="text-orange-50 opacity-90 text-xs font-medium relative z-10">
                        {restaurantName ? `Surprise from ${restaurantName}!` : 'Confused? Let us decide for you!'}
                    </p>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/30 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <p className="text-red-600 dark:text-red-400 text-xs font-bold">{error}</p>
                        </div>
                    )}

                    {!result ? (
                        <div className="space-y-6">
                            {/* Budget Slider */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-orange-600">Your Budget</label>
                                    <div className="relative">
                                        <span className="text-2xl font-black text-gray-800 dark:text-white">₹{budget}</span>
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                                    </div>
                                </div>
                                <div className="relative pt-2 pb-5">
                                    <input
                                        type="range"
                                        min="40"
                                        max="1000"
                                        step="10"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        className="w-full h-2 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-500 dark:from-orange-900/20 dark:via-orange-800/30 dark:to-orange-600/40 rounded-full appearance-none cursor-pointer slider-thumb"
                                        style={{
                                            background: `linear-gradient(to right, rgb(251 146 60) 0%, rgb(251 146 60) ${((budget - 40) / 960) * 100}%, rgb(254 215 170) ${((budget - 40) / 960) * 100}%, rgb(254 215 170) 100%)`
                                        }}
                                    />
                                    <div className="absolute -bottom-1 left-0 right-0 flex justify-between text-[9px] font-bold text-gray-400 px-1">
                                        <span>₹40</span>
                                        <span>₹500</span>
                                        <span>₹1000</span>
                                    </div>
                                </div>
                            </div>

                            {/* Category Grid */}
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-2">Select Categories</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { id: 'Jain', label: 'Jain', icon: <Leaf className="w-5 h-5" /> },
                                        { id: 'Non-veg', label: 'Non-veg', icon: <UtensilsCrossed className="w-5 h-5" /> },
                                        { id: 'Vegetarian', label: 'Pure Veg', icon: <Leaf className="w-5 h-5" /> },
                                        { id: 'Beverages', label: 'Beverages', icon: <GlassWater className="w-5 h-5" /> }
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => toggleType(item.id)}
                                            className={`relative py-3 rounded-[1.5rem] border-2 transition-all duration-300 flex flex-col items-center gap-1 overflow-hidden ${selectedTypes.includes(item.id)
                                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 shadow-lg shadow-orange-500/20'
                                                : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-400 hover:border-orange-300 hover:bg-orange-50/50'
                                                }`}
                                        >
                                            {selectedTypes.includes(item.id) && (
                                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"></div>
                                            )}
                                            <span className={`mb-0.5 relative z-10 ${selectedTypes.includes(item.id) ? 'animate-bounce' : ''}`}>
                                                {item.icon}
                                            </span>
                                            <span className="text-[9px] font-black uppercase tracking-tighter relative z-10">
                                                {item.label}
                                            </span>
                                            {selectedTypes.includes(item.id) && (
                                                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={getSurpriseDish}
                                disabled={rolling}
                                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-lg rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.5)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                {rolling ? (
                                    <div className="flex items-center justify-center gap-3 relative z-10">
                                        <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>ROLLING...</span>
                                    </div>
                                ) : (
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        <Dices className="w-5 h-5" />
                                        SURPRISE ME
                                    </span>
                                )}
                            </button>
                        </div>
                    ) : (
                        /* Result Card */
                        <div className="text-center py-2 animate-in slide-in-from-bottom-10 duration-500">
                            <div className="inline-block p-4 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-600/20 text-orange-500 mb-4 ring-8 ring-orange-50 dark:ring-orange-500/5 animate-pulse">
                                <UtensilsCrossed className="w-8 h-8" />
                            </div>

                            {result.items.length === 1 ? (
                                /* Single Item Display */
                                <>
                                    <h3 className="text-xl font-black text-gray-800 dark:text-white leading-tight mb-2 uppercase">
                                        {result.items[0].name}
                                    </h3>
                                    <p className="text-orange-500 font-bold text-xs mb-4 flex items-center justify-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                        {result.items[0].restaurants?.name}
                                    </p>

                                    <div className="text-4xl font-black bg-gradient-to-br from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4">
                                        ₹{result.items[0].price}
                                    </div>

                                    <div className="mb-4 flex items-center justify-center gap-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(result.items[0].id)}
                                                onChange={() => {
                                                    setSelectedItems(prev =>
                                                        prev.includes(result.items[0].id)
                                                            ? prev.filter(id => id !== result.items[0].id)
                                                            : [...prev, result.items[0].id]
                                                    );
                                                }}
                                                className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                                            />
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Select this item</span>
                                        </label>
                                    </div>
                                </>
                            ) : (
                                /* Multiple Items Display */
                                <>
                                    <h3 className="text-lg font-black text-gray-800 dark:text-white leading-tight mb-1 uppercase">
                                        Your Combo Deal!
                                    </h3>
                                    <p className="text-orange-500 font-bold text-xs mb-3 flex items-center justify-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                        {result.items[0].restaurants?.name}
                                    </p>

                                    <div className="bg-orange-50 dark:bg-orange-500/5 rounded-2xl p-3 mb-3 max-h-[140px] overflow-y-auto space-y-1.5 scrollbar-hide">
                                        {result.items.map((item, index) => {
                                            const isSelected = selectedItems.includes(item.id);
                                            return (
                                                <div
                                                    key={item.id}
                                                    className={`flex justify-between items-center py-1.5 px-2.5 rounded-xl transition-all ${isSelected
                                                        ? 'bg-white dark:bg-gray-900 ring-2 ring-orange-500'
                                                        : 'bg-white/50 dark:bg-gray-900/50 opacity-50 hover:opacity-75'
                                                        }`}
                                                >
                                                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 cursor-pointer flex-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => {
                                                                setSelectedItems(prev =>
                                                                    prev.includes(item.id)
                                                                        ? prev.filter(id => id !== item.id)
                                                                        : [...prev, item.id]
                                                                );
                                                            }}
                                                            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                                                        />
                                                        <span>{item.name}</span>
                                                    </label>
                                                    <span className="text-xs font-black text-orange-600">₹{item.price}</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="text-3xl font-black bg-gradient-to-br from-orange-500 to-orange-600 bg-clip-text text-transparent mb-1">
                                        ₹{result.items.filter(item => selectedItems.includes(item.id)).reduce((sum, item) => sum + item.price, 0)}
                                    </div>
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-4">
                                        Total for {selectedItems.length} selected item{selectedItems.length !== 1 ? 's' : ''}
                                    </p>
                                </>
                            )}

                            <div className="space-y-2">
                                {selectedItems.length > 0 ? (
                                    <button
                                        onClick={() => {
                                            const itemsToAdd = result.items.filter(item => selectedItems.includes(item.id));
                                            itemsToAdd.forEach(item => addToCart(item));
                                            onClose();
                                        }}
                                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-500 dark:to-orange-600 text-white py-4 rounded-2xl font-black text-base hover:shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        ADD {result.items.length > 1 ? `SELECTED (${selectedItems.length})` : ''} TO CART
                                    </button>
                                ) : (
                                    <div className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-4 rounded-2xl font-black text-base text-center cursor-not-allowed">
                                        SELECT ITEMS TO ADD TO CART
                                    </div>
                                )}
                                <button
                                    onClick={handleReroll}
                                    disabled={rolling}
                                    className="w-full text-orange-600 font-bold py-2.5 text-xs uppercase tracking-widest hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-xl transition-colors border-2 border-transparent hover:border-orange-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {rolling ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-orange-600/30 border-t-orange-600 rounded-full animate-spin"></div>
                                            Rerolling...
                                        </>
                                    ) : (
                                        <>
                                            <RotateCcw className="w-3.5 h-3.5" />
                                            Try Again
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .slider-thumb::-webkit-slider-thumb {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #f97316, #ea580c);
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
                    transition: all 0.2s;
                }
                .slider-thumb::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 6px 16px rgba(249, 115, 22, 0.6);
                }
                .slider-thumb::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #f97316, #ea580c);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
                    transition: all 0.2s;
                }
                .slider-thumb::-moz-range-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 6px 16px rgba(249, 115, 22, 0.6);
                }
                ::-webkit-scrollbar {
                    display: none !important;
                }
                html, body {
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default SurpriseMe;