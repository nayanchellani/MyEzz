import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, Clock, Star, TrendingUp,  Pizza, 
  Coffee, 
  IceCream, 
  Beef, 
  Cake,
  Utensils,
  Circle  ,
  Soup } from 'lucide-react';
import { 
  IoPizzaOutline, 
  IoFastFoodOutline, 
  IoIceCreamOutline, 
  IoCafeOutline, 
  IoSearchOutline,
} from 'react-icons/io5';
import { 
  GiNoodles,
  GiWrappedSweet,
  GiChickenOven,
  GiKebabSpit,
  GiHotMeal,
  GiDumpling,
  GiFlatfish,
  GiBowlOfRice,
  GiHamburger,
  GiSandwich,
  GiSushis,
  GiCircle,
  GiCheeseWedge
} from 'react-icons/gi';
import { supabase } from '../../supabaseClient'; 

const SearchPage = () => {
  const navigate = useNavigate();
  const [localMenuData, setLocalMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  // --- Rolling Placeholder Logic ---
  const placeholders = [
    "Search Delicious Pizza", 
    "Search Juicy Burgers", 
    "Search Hot Momos", 
    "Search Hyderabadi Biryani", 
    "Search Fresh Coffee"
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPlaceholderIndex((p) => (p + 1) % placeholders.length), 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));

    async function fetchMenuForSearch() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('restaurants')
          .select(`id, name, rating, delivery_time, image_url, items:menu_items(name, is_veg)`);
        if (error) throw error;
        setLocalMenuData(data || []);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMenuForSearch();
  }, []);

  const filteredRestaurants = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const term = searchQuery.toLowerCase();
    return localMenuData.filter(vendor => 
      vendor.name.toLowerCase().includes(term) || 
      vendor.items.some(item => item.name.toLowerCase().includes(term))
    );
  }, [searchQuery, localMenuData]);

  const handleSearchAction = (term) => {
    setSearchQuery(term);
    if (term.trim() && !recentSearches.includes(term)) {
      const newRecent = [term, ...recentSearches.slice(0, 5)];
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
    }
  };

  const handleBack = () => {
    if (searchQuery.length > 0) setSearchQuery('');
    else navigate('/');
  };

  const popularCravings = [
    { name: 'Pizza', icon: <Pizza className="w-8 h-8" /> },
    { name: 'Burger', icon: <GiHamburger className="w-8 h-8" /> },
    { name: 'Biryani', icon: <GiBowlOfRice className="w-8 h-8" /> },
    { name: 'Coffee', icon: <Coffee className="w-8 h-8" /> },
    { name: 'Ice Cream', icon: <IceCream className="w-8 h-8" /> },
    { name: 'Momos', icon: <GiDumpling className="w-8 h-8" /> },
    { name: 'Pasta', icon: <Soup className="w-8 h-8" /> },
    { name: 'Sandwich', icon: <GiSandwich className="w-8 h-8" /> },
    { name: 'Noodles', icon: <GiNoodles className="w-8 h-8" /> },
    { name: 'Rolls', icon: <IoFastFoodOutline className="w-8 h-8" /> },
    { name: 'Sushi', icon: <GiSushis className="w-8 h-8" /> },
    { name: 'Chicken', icon: <GiChickenOven className="w-8 h-8" /> },
    { name: 'Cake', icon: <Cake className="w-8 h-8" /> },
    { name: 'Thali', icon: <Utensils className="w-8 h-8" /> },
    { name: 'Fried Rice', icon: <GiBowlOfRice className="w-8 h-8" /> },
    { name: 'Kebab', icon: <GiKebabSpit className="w-8 h-8" /> },
  ];
  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-[#0b0b0b] text-gray-900 dark:text-white overflow-y-auto font-sans transition-colors duration-300">
      
      {/* Search Header */}
      <div className="sticky top-0 bg-white/90 dark:bg-[#0b0b0b]/90 backdrop-blur-md p-4 border-b border-gray-100 dark:border-white/5 z-50">
        <div className="flex items-center gap-3 max-w-3xl mx-auto">
          <button 
            onClick={handleBack} 
            className="p-2 rounded-full border-2 border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/10 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="relative flex-1 h-12">
            <div className="absolute inset-0 bg-gray-100 dark:bg-[#161616] rounded-2xl border border-transparent dark:border-white/5 flex items-center px-4 group focus-within:border-orange-500/50 transition-all shadow-sm dark:shadow-none">
              <Search className="w-4 h-4 text-orange-500 shrink-0" />
              
              <div className="relative flex-1 h-full ml-3">
                <input 
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchAction(searchQuery)}
                  className="absolute inset-0 bg-transparent w-full h-full outline-none text-sm text-gray-800 dark:text-gray-200"
                />
                {!searchQuery && (
                  <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden">
                    <span key={placeholderIndex} className="animate-roll text-sm text-gray-400 dark:text-gray-500">
                      {placeholders[placeholderIndex]}
                    </span>
                  </div>
                )}
              </div>

              {searchQuery && (
                <X onClick={() => setSearchQuery('')} className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-white" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-5 pb-24">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-[#161616] animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Recent Searches */}
            {!searchQuery && recentSearches.length > 0 && (
              <div className="mb-10 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  <span>Recent</span>
                  <button 
  onClick={() => {setRecentSearches([]); localStorage.removeItem('recentSearches');}} 
  className="text-orange-500 text-[11px] font-bold uppercase tracking-wider hover:text-orange-600 transition-colors cursor-pointer"
>
  clear
</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, i) => (
                    <button key={i} onClick={() => handleSearchAction(s)} className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-white/5 rounded-xl text-xs text-gray-600 dark:text-gray-300">
                      <Clock className="w-3 h-3 opacity-40" /> {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Cravings */}
            {!searchQuery && (
              <div className="mb-10 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" /> Popular Cravings
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {popularCravings.map((f) => (
                    <button key={f.name} onClick={() => handleSearchAction(f.name)} className="flex flex-col items-center gap-3 group">
                      <div className="w-16 h-16 bg-white dark:bg-[#161616] border border-gray-100 dark:border-white/5 rounded-[2rem] flex items-center justify-center text-orange-500 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                        {f.icon}
                      </div>
                      <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 group-hover:text-orange-500">{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Result Area */}
            {searchQuery && filteredRestaurants.length === 0 ? (
              /* EMPTY STATE: When no dish/restaurant is found */
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95 duration-300">
                <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
                  <IoSearchOutline className="w-10 h-10 text-orange-500 opacity-50" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                  No matches found for "{searchQuery}"
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[250px] leading-relaxed">
                  Try checking the spelling or use more general keywords.
                </p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-full text-sm font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-transform"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              /* RESTAURANT CARDS */
              <div className="grid gap-4">
                {filteredRestaurants.map((vendor) => (
                  <div 
                    key={vendor.id} 
                    onClick={() => navigate(`/restaurant/${vendor.id}`)}
                    className="flex gap-4 p-4 bg-white dark:bg-[#161616] rounded-3xl border border-gray-100 dark:border-white/5 hover:border-orange-500/20 transition-all cursor-pointer group shadow-sm dark:shadow-none"
                  >
                    <div className="relative shrink-0 h-24 w-24">
                      <img src={vendor.image_url} alt={`${vendor.name} restaurant - order food online`} className="h-full w-full rounded-2xl object-cover" />
                    </div>
                    <div className="flex-1 py-1">
                      <h4 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-orange-500 transition-colors">{vendor.name}</h4>
                      <div className="flex items-center gap-3 mt-1.5 mb-2">
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-500/10 text-green-600 dark:text-green-500 rounded text-[10px] font-black">
                          <Star className="w-3 h-3 fill-current" /> {vendor.rating || '4.0'}
                        </div>
                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-tight">
                          {vendor.delivery_time || '30 MINS'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-500 line-clamp-1 italic font-medium">
                        {vendor.items.length > 0 ? vendor.items.slice(0, 3).map(i => i.name).join(', ') : "Special Delicacies"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;