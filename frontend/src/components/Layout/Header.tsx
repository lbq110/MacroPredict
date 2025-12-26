import React, { useState, useEffect, useRef } from 'react'
import { Search, Bell, Menu, LogOut, User, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
    onMenuToggle: () => void;
}

interface UserData {
    avatar?: string;
    username?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Check login status on mount and when storage changes
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            const avatar = localStorage.getItem('userAvatar');
            const username = localStorage.getItem('username');

            if (token) {
                setIsLoggedIn(true);
                setUserData({
                    avatar: avatar || undefined,
                    username: username || 'User'
                });
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
        };

        checkLoginStatus();

        // Listen for storage changes (for cross-tab sync)
        window.addEventListener('storage', checkLoginStatus);

        // Custom event for same-tab updates
        window.addEventListener('loginStateChanged', checkLoginStatus);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
            window.removeEventListener('loginStateChanged', checkLoginStatus);
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setUserData(null);
        setShowDropdown(false);
        window.dispatchEvent(new Event('loginStateChanged'));
        navigate('/');
    };

    const handleTwitterLogin = () => {
        const clientId = import.meta.env.VITE_TWITTER_CLIENT_ID || 'MOCK_CLIENT_ID';
        const redirectUri = window.location.origin + '/auth/twitter/callback';
        const state = 'state';
        const scope = 'tweet.read users.read offline.access';
        const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&code_challenge=challenge&code_challenge_method=plain`;
        window.location.href = authUrl;
    };

    return (
        <header className="h-20 sticky top-0 flex items-center justify-between px-4 md:px-8 bg-white/70 dark:bg-brand-dark/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 z-40">
            <div className="flex items-center gap-4 md:gap-8 flex-1">
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                >
                    <Menu size={20} />
                </button>

                <h1 className="text-xl md:text-2xl font-display font-black text-gradient-primary tracking-tight whitespace-nowrap">MacroPredict</h1>

                <div className="hidden lg:flex items-center gap-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 px-4 py-2.5 rounded-2xl w-full max-w-md group focus-within:ring-2 focus-within:ring-brand-primary/20 transition-all">
                    <Search size={18} className="text-slate-400 group-focus-within:text-brand-primary" />
                    <input
                        type="text"
                        placeholder="Search markets, events..."
                        className="bg-transparent border-none outline-none text-sm font-medium w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                        onKeyDown={(e) => e.key === 'Enter' && alert(`Searching for: ${e.currentTarget.value}`)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
                {isLoggedIn ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {userData?.avatar ? (
                                <img
                                    src={userData.avatar}
                                    alt="Avatar"
                                    className="w-9 h-9 rounded-full object-cover border-2 border-brand-primary"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                                    <User size={18} className="text-white" />
                                </div>
                            )}
                            <ChevronDown size={16} className={`text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                                <button
                                    onClick={() => {
                                        setShowDropdown(false);
                                        navigate('/profile');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <User size={16} />
                                    <span>Profile</span>
                                </button>
                                <hr className="my-1 border-slate-200 dark:border-slate-700" />
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-financial-down hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={handleTwitterLogin}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                    >
                        <span>Sign in with X</span>
                    </button>
                )}

                <button className="relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl hover:bg-slate-50 transition-all">
                    <Bell size={20} className="text-slate-500" />
                    <span className="absolute top-2 right-2 w-2 h-2 md:w-2.5 md:h-2.5 bg-financial-down rounded-full border-2 border-white dark:border-slate-800"></span>
                </button>
            </div>
        </header>
    )
}

export default Header

