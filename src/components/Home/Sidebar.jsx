import React from 'react';
import { Heart, X, Dices } from 'lucide-react';

export const FilterCheckbox = ({ label, description, checked, onChange }) => (
    <div className="relative">
        {checked && <div className="absolute left-[-1rem] top-0 h-full w-1 bg-orange-500"></div>}
        <label className="flex items-start space-x-3 cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="form-checkbox h-5 w-5 text-orange-500 rounded-sm border-gray-300 bg-gray-100 focus:ring-orange-500" />
            <span className="text-gray-700 dark:text-gray-200">
                {label}
                {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
            </span>
        </label>
    </div>
);

const Sidebar = ({ selectedCuisines, setSelectedCuisines, isOpen, onClose, showFavorites, setShowFavorites, onSurpriseMe, showVegetarian, setShowVegetarian }) => {

    const handleCuisineChange = (cuisine) => {
        setSelectedCuisines(prev =>
            prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
        );
    };

    const clearFilters = () => {
        setSelectedCuisines([]);
        setShowFavorites(false);
        setShowVegetarian(false);
    };

    return (
        <>
            {/* 1. Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[60] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
                style={{ transitionProperty: 'opacity' }}
            />

            {/* 2. Sidebar Container */}
            <aside
                className={`
                    fixed top-0 left-0 h-full
                    w-[85%] sm:w-80 md:w-96
                    bg-white dark:bg-[#1a2230]/95 backdrop-blur-2xl
                    border-r border-gray-100 dark:border-slate-800/50
                    z-[70]
                    transform transition-all duration-500 ease-in-out
                    ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full invisible pointer-events-none'} 
                    flex flex-col
                `}
                style={{
                    visibility: isOpen ? 'visible' : 'hidden',
                    willChange: 'transform'
                }}
            >
                {/* Header - White text in dark mode */}
                <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Filters</h2>
                        <div className="h-1 w-8 bg-orange-500 rounded-full mt-1" />
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-orange-500 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <section>
                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-[0.2em] mb-4">Feeling Adventurous?</h3>
                        <button
                            onClick={() => {
                                onSurpriseMe();
                                onClose();
                            }}
                            className="w-full group px-6 py-4 text-sm font-black rounded-2xl border-2 whitespace-nowrap
                                       flex items-center justify-center gap-3 transition-all duration-300 ease-out backdrop-blur-md
                                       bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400/50
                                       hover:shadow-[0_10px_25px_rgba(249,115,22,0.4)] active:scale-95"
                        >
                            <Dices className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="uppercase tracking-wider">Surprise Me</span>
                        </button>
                    </section>

                    <section>
                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-[0.2em] mb-4">Cuisine</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {["Jain", "Non-Jain", "Beverages"].map(cuisine => {
                                const isSelected = selectedCuisines.includes(cuisine);
                                return (
                                    <button
                                        key={cuisine}
                                        onClick={() => handleCuisineChange(cuisine)}
                                        className={`px-4 py-3 text-sm font-bold rounded-2xl border transition-all duration-200 active:scale-90 ${isSelected
                                            ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20'
                                            : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-100 hover:border-orange-500/50'
                                            }`}
                                    >
                                        {cuisine}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-[0.2em] mb-4">Preferences</h3>
                        <div className="space-y-3">
                            {/* Vegetarian Toggle */}
                            <button
                                onClick={() => setShowVegetarian(!showVegetarian)}
                                className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${showVegetarian
                                    ? 'bg-green-500/10 border-green-500 text-green-600 dark:text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-100'
                                    }`}
                            >
                                <span className="font-bold flex items-center gap-3">
                                    <span className="text-lg">🥗</span>
                                    Vegetarian
                                </span>
                                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${showVegetarian ? 'bg-green-500' : 'bg-slate-700'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${showVegetarian ? 'left-6' : 'left-1'}`} />
                                </div>
                            </button>

                            {/* Favourites Toggle */}
                            <button
                                onClick={() => setShowFavorites(!showFavorites)}
                                className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all duration-300 ${showFavorites
                                    ? 'bg-rose-500/10 border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-100'
                                    }`}
                            >
                                <span className="font-bold flex items-center gap-3">
                                    <Heart className={`w-5 h-5 ${showFavorites ? 'fill-current animate-pulse' : ''}`} />
                                    Favourites
                                </span>
                                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${showFavorites ? 'bg-rose-500' : 'bg-slate-700'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${showFavorites ? 'left-6' : 'left-1'}`} />
                                </div>
                            </button>
                        </div>
                    </section>
                </div>
                
                <div className="p-6 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <button
                        onClick={onClose}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all"
                    >
                        Apply Filters
                    </button>

                    <button
                        onClick={clearFilters}
                        className="w-full bg-transparent border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-white font-bold py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm"
                    >
                        Clear All Filters
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;