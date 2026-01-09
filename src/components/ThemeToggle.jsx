import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const SunIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
);

const MoonIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
);

const ThemeToggle = ({ className = '' }) => {
    const { theme, toggleTheme } = useTheme();

    // Log current theme on component mount and when theme changes
    useEffect(() => {
        console.log('ThemeToggle rendered with theme:', theme);
    }, [theme]);

    // Enhanced click handler with debugging
    const handleToggleClick = (e) => {
        e.preventDefault();
        console.log('Theme toggle button clicked');
        toggleTheme();
    };

    const isDark = theme === 'dark';

    return (
        <button
            onClick={handleToggleClick}
            className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF6600] focus:ring-offset-2 ${isDark ? 'bg-gray-700' : 'bg-[#FF6600]'
                } ${className}`}
            aria-label="Toggle theme"
            data-testid="theme-toggle"
        >
            {/* Toggle Track with Icons */}
            <div className="absolute inset-0 flex items-center justify-between px-1.5">
                <SunIcon className={`${isDark ? 'text-gray-400' : 'text-white'} transition-colors duration-300`} />
                <MoonIcon className={`${isDark ? 'text-white' : 'text-[#FF6600]/50'} transition-colors duration-300`} />
            </div>

            {/* Sliding Toggle Circle */}
            <motion.div
                className="absolute left-0.5 bg-white rounded-full h-6 w-6 shadow-md flex items-center justify-center"
                initial={false}
                animate={{
                    x: isDark ? 28 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                }}
            >
                {isDark ? (
                    <MoonIcon className="text-gray-700" />
                ) : (
                    <SunIcon className="text-[#FF6600]" />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
