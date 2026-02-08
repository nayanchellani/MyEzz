import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { User, LogOut, Moon, Sun } from 'lucide-react';
import ThemeToggle from '../Shared/ThemeToggle';

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
                className="relative text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors p-2 rounded-full"
                style={{ minWidth: "48px", minHeight: "48px" }}
            >
                {profilePhoto ? (
                    <img
                        src={profilePhoto}
                        alt="Profile"
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-orange-200 dark:ring-orange-800"
                    />
                ) : (
                    <User className="h-6 w-6" />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">

                    {/* User Info Header */}
                    <div className="p-5 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-gray-800 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            {profilePhoto ? (
                                <img
                                    src={profilePhoto}
                                    alt="Profile"
                                    className="h-12 w-12 rounded-full object-cover ring-3 ring-orange-200 dark:ring-orange-700"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                    <User className="h-6 w-6 text-orange-500" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-white dark:text-white truncate">Hello, {userName}!</p>
                                <p className="text-sm text-orange-100 dark:text-gray-400 truncate">{userEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        {/* Dark Mode Toggle */}
                        <div className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Dark Mode</span>
                            </div>
                            <ThemeToggle />
                        </div>

                        {/* Divider */}
                        <div className="mx-4 my-1 border-t border-gray-100 dark:border-gray-800"></div>

                        {/* My Profile */}
                        <button
                            onClick={onMyProfile}
                            className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors group"
                        >
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                                <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">My Profile</span>
                        </button>

                        {/* Divider */}
                        <div className="mx-4 my-1 border-t border-gray-100 dark:border-gray-800"></div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                        >
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                                <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="text-sm font-medium text-red-600 dark:text-red-400">Logout</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
