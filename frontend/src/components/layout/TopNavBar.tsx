import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface TopNavBarProps {
    onSearchChange?: (query: string) => void;
    onMenuClick?: () => void;
}

export default function TopNavBar({ onSearchChange, onMenuClick }: TopNavBarProps) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange?.(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, onSearchChange]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 md:px-6 flex items-center justify-between shrink-0">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">menu</span>
                </button>

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">apartment</span>
                    </div>
                    <div className="hidden sm:block">
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                            Bebang Sistem Informasi
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PT Prima Sarana Gemilang</p>
                    </div>
                </div>
            </div>

            {/* Center Section - Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Cari modul, karyawan, atau data..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                    >
                        <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                            notifications
                        </span>
                    </button>
                    {isNotificationOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 z-50">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Notifikasi</h3>
                            </div>
                            <div className="p-8 text-center">
                                <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">
                                    notifications_off
                                </span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Tidak ada notifikasi baru
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Settings */}
                <button
                    onClick={() => navigate('/settings')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:flex"
                >
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">settings</span>
                </button>

                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                        {isDarkMode ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>

                {/* Divider */}
                <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2"></div>

                {/* User Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {user?.fullName || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'Unknown'}</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-lg">person</span>
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 z-50">
                            <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                                <p className="font-medium text-gray-900 dark:text-white">{user?.fullName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || user?.nik}</p>
                            </div>
                            <div className="p-2">
                                <button
                                    onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">person</span>
                                    My Profile
                                </button>
                                <button
                                    onClick={() => { navigate('/settings'); setIsProfileOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">settings</span>
                                    Settings
                                </button>
                            </div>
                            <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">logout</span>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
