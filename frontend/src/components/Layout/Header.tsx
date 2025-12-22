import React from 'react'
import { Search, Bell, Menu } from 'lucide-react'
import WalletWidget from '../Wallet/WalletWidget'

interface HeaderProps {
    onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
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
                {/* Simple check for login status (in real app, use Context/Store) */}
                {localStorage.getItem('token') ? (
                    <WalletWidget />
                ) : (
                    <button
                        onClick={() => {
                            // Twitter OAuth URL construction
                            const clientId = import.meta.env.VITE_TWITTER_CLIENT_ID || 'MOCK_CLIENT_ID';
                            const redirectUri = window.location.origin + '/auth/twitter/callback';
                            const state = 'state'; // Should be random
                            const scope = 'tweet.read users.read offline.access'; // Adjust scopes as needed
                            // Using plain manually for simplicity matching backend hardcoded verifier "challenge"
                            const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&code_challenge=challenge&code_challenge_method=plain`;

                            window.location.href = authUrl;
                        }}
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
