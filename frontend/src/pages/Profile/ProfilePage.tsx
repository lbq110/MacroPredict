import React from 'react'
import { User, Settings, LogOut, Trophy, TrendingUp, Wallet, History, Star, Shield, ChevronRight } from 'lucide-react'

const ProfilePage = () => {
    // Mock user data - in production this would come from API/auth context
    const mockUser = {
        username: 'demo_trader',
        displayName: 'Demo Trader',
        avatar: null,
        joinedDate: 'December 2024',
        totalPredictions: 47,
        winRate: 62.5,
        totalEarnings: 1250.00,
        rank: 156,
        level: 'Gold Predictor',
    }

    const recentActivity = [
        { id: 1, asset: 'BTC/USD', prediction: 'OVER', result: 'won', amount: 100, payout: 185, date: '2024-12-24' },
        { id: 2, asset: 'ETH/USD', prediction: 'UNDER', result: 'lost', amount: 50, payout: 0, date: '2024-12-23' },
        { id: 3, asset: 'S&P 500', prediction: 'OVER', result: 'won', amount: 200, payout: 360, date: '2024-12-22' },
        { id: 4, asset: 'Gold', prediction: 'UNDER', result: 'won', amount: 75, payout: 142, date: '2024-12-21' },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100">Profile</h1>
                    <p className="text-slate-500 mt-1">Manage your account and view your trading history</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                    <Settings size={18} />
                    Settings
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - User Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Profile Card */}
                    <div className="card-premium p-8 text-center">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {mockUser.displayName.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">{mockUser.displayName}</h2>
                        <p className="text-slate-500 text-sm">@{mockUser.username}</p>

                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-bold">
                            <Star size={14} />
                            {mockUser.level}
                        </div>

                        <p className="text-xs text-slate-400 mt-4">Member since {mockUser.joinedDate}</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="card-premium p-6 space-y-3">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>

                        <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all group">
                            <div className="flex items-center gap-3">
                                <Wallet size={18} className="text-brand-primary" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Deposit Funds</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all group">
                            <div className="flex items-center gap-3">
                                <Shield size={18} className="text-financial-up" />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Security Settings</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all group">
                            <div className="flex items-center gap-3">
                                <LogOut size={18} className="text-rose-500" />
                                <span className="text-sm font-medium text-rose-600 dark:text-rose-400">Sign Out</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Right Column - Stats & Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="card-premium p-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                <TrendingUp size={24} />
                            </div>
                            <p className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">{mockUser.totalPredictions}</p>
                            <p className="text-xs text-slate-500 font-medium">Total Predictions</p>
                        </div>

                        <div className="card-premium p-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-financial-up/10 flex items-center justify-center text-financial-up">
                                <Trophy size={24} />
                            </div>
                            <p className="text-2xl font-display font-bold text-financial-up">{mockUser.winRate}%</p>
                            <p className="text-xs text-slate-500 font-medium">Win Rate</p>
                        </div>

                        <div className="card-premium p-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <Wallet size={24} />
                            </div>
                            <p className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">${mockUser.totalEarnings.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 font-medium">Total Earnings</p>
                        </div>

                        <div className="card-premium p-6 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Star size={24} />
                            </div>
                            <p className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">#{mockUser.rank}</p>
                            <p className="text-xs text-slate-500 font-medium">Global Rank</p>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card-premium p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                    <History size={20} />
                                </div>
                                <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100">Recent Activity</h3>
                            </div>
                            <button className="text-sm font-bold text-brand-primary hover:underline">View All</button>
                        </div>

                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${activity.result === 'won'
                                                ? 'bg-financial-up/20 text-financial-up'
                                                : 'bg-financial-down/20 text-financial-down'
                                            }`}>
                                            {activity.result === 'won' ? '✓' : '✗'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{activity.asset}</p>
                                            <p className="text-xs text-slate-500">
                                                Predicted <span className={activity.prediction === 'OVER' ? 'text-financial-up' : 'text-financial-down'}>{activity.prediction}</span> • {activity.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${activity.result === 'won' ? 'text-financial-up' : 'text-financial-down'}`}>
                                            {activity.result === 'won' ? `+$${activity.payout - activity.amount}` : `-$${activity.amount}`}
                                        </p>
                                        <p className="text-xs text-slate-500">Stake: ${activity.amount}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
