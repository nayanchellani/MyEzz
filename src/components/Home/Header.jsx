import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, CartIcon } from '../Shared/Icons';
import ProfileDropdown from '../User/ProfileDropdown';
const logo = "/myezzlogopage0001removebgpreview2329-xmz0h-400w.png";

const Header = ({ onCartClick, cartItems, isProfileOpen, onProfileToggle, onProfileClose, onMyProfile, onLogoClick, userLocation, onLocationClick }) => {
  const navigate = useNavigate();

  const placeholders = [
    "Search pizza 🍕",
    "Search burgers 🍔",
    "Search momos 🥟",
    "Search biryani 🍛",
    "Search soup 🍲",
    "Search coffee ☕"
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm p-2 px-4 sm:p-4 sm:px-8 flex justify-between items-center sticky top-0 z-50 transition-colors duration-200">

      {/* Logo & Location */}
      <div className="flex items-center gap-4">
        <button onClick={onLogoClick} className="focus:outline-none shrink-0">
          <img src={logo} alt="MyEzz Logo" className="h-10 sm:h-20" />
        </button>
        <button onClick={onLocationClick} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all group max-w-[120px] sm:max-w-[200px]">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full group-hover:bg-orange-500 transition-colors">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 dark:text-orange-400 group-hover:text-white" />
          </div>
          <div className="text-left overflow-hidden hidden sm:block">
            <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">Deliver to</p>
            <p className="text-sm font-bold dark:text-gray-200 truncate">{userLocation?.address?.split(',')[0] || 'Add your location'}</p>
          </div>
        </button>
      </div>

      {/* Animated Search Bar */}
      <div
        onClick={() => navigate('/search')}
        className="relative flex-1 max-w-xl mx-4 cursor-pointer group h-11" // Fixed height for smooth transition
      >
        <div className="absolute inset-0 bg-white dark:bg-gray-800 border border-gray-100 dark:border-transparent rounded-full shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none group-hover:border-orange-200 dark:group-hover:border-orange-500/30 transition-all flex items-center px-4">
          <SearchIcon className="text-gray-300 dark:text-gray-400 group-hover:text-orange-500 transition-colors" />

          {/* Rolling Animation Container */}
          <div className="ml-3 flex-1 overflow-hidden h-full relative">
            <div
              key={index} // Key change triggers the animation
              className="animate-roll absolute inset-0 flex items-center text-sm font-medium text-gray-300 dark:text-gray-500"
            >
              {placeholders[index]}
            </div>
          </div>
        </div>
      </div>

      {/* Actions (Cart & Profile) */}
      <div className="flex items-center space-x-3 shrink-0">
        <button onClick={onCartClick} className="relative text-gray-600 dark:text-gray-300 hover:text-orange-500 hidden md:block transition-colors">
          <CartIcon />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>
        <ProfileDropdown isOpen={isProfileOpen} onToggle={onProfileToggle} onClose={onProfileClose} onMyProfile={onMyProfile} />
      </div>
    </header>
  );
};

export default Header;