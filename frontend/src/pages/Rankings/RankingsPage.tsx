import React, { useState } from 'react'
import { Trophy, TrendingUp, Users, Medal, Zap, Target, ArrowUpRight } from 'lucide-react'

const RankingsPage = () => {
    const [timeframe, setTimeframe] = useState('All-Time')

    const traders = [
        { rank: 1, name: 'MacroPredictor_Alpha', profit: '+242.5%', trades: 156, winRate: '72%', accuracy: '89.4%', status: 'Pro' },
        { rank: 2, name: 'CPI_Wizard', profit: '+198.2%', trades: 84, winRate: '68%', accuracy: '85.1%', status: 'Elite' },
        { rank: 3, name: 'Trend_Sentinel', profit: '+176.4%', trades: 210, winRate: '64%', accuracy: '82.7%', status: 'Pro' },
        { rank: 4, name: 'RateWatch_Pro', profit: '+162.1%', trades: 45, winRate: '75%', accuracy: '91.2%', status: 'Legend' },
        { rank: 5, name: 'NFP_Hunter', profit: '+145.8%', trades: 112, winRate: '61%', accuracy: '78.5%', status: 'Elite' },
        { rank: 6, name: 'ZeroDay_Trader', profit: '+123.4%', trades: 342, winRate: '58%', accuracy: '74.2%', status: 'Pro' },
    ]

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header / Stats Overlay */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-glass-sm">
                            <Trophy size={24} />
                        </div>
                        <h2 className="text-4xl font-display font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Leaderboards</h2>
                    </div>
                    <p className="text-slate-500 font-bold ml-1 text-lg">
                        The elite predictors of the MacroPredict ecosystem. Accurate, consistent, and data-driven.
                    </p>
                </div>

                <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl">
                    {['Daily', 'Weekly', 'Monthly', 'All-Time'].map(tf => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${timeframe === tf
                                ? 'bg-white dark:bg-slate-700 shadow-glass-sm text-brand-primary'
                                : 'text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Spotlight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-premium p-8 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Medal size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                            <Medal size={28} />
                        </div>
                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Platform Champion</h3>
                        <p className="text-2xl font-display font-black text-slate-800 dark:text-white mb-2">MacroPredictor_Alpha</p>
                        <div className="flex items-center gap-2 text-emerald-500 font-bold">
                            <ArrowUpRight size={16} />
                            +242.5% PNL
                        </div>
                    </div>
                </div>

                <div className="card-premium p-8 bg-gradient-to-br from-brand-primary/10 to-transparent border-brand-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary mb-6">
                            <Zap size={28} />
                        </div>
                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Accuracy Leader</h3>
                        <p className="text-2xl font-display font-black text-slate-800 dark:text-white mb-2">RateWatch_Pro</p>
                        <div className="flex items-center gap-2 text-brand-primary font-bold">
                            <Target size={16} />
                            91.2% Success Rate
                        </div>
                    </div>
                </div>

                <div className="card-premium p-8 bg-gradient-to-br from-brand-secondary/10 to-transparent border-brand-secondary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-brand-secondary/20 rounded-2xl flex items-center justify-center text-brand-secondary mb-6">
                            <Users size={28} />
                        </div>
                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Active Universe</h3>
                        <p className="text-2xl font-display font-black text-slate-800 dark:text-white mb-2">12,450 Predictors</p>
                        <div className="flex items-center gap-2 text-brand-secondary font-bold">
                            <TrendingUp size={16} />
                            +15.4% Org Growth
                        </div>
                    </div>
                </div>
            </div>

            {/* Rankings Table */}
            <div className="card-premium overflow-hidden border border-white/5 rounded-[2.5rem] shadow-glass-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/40">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Rank</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Trader Identity</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Total PNL</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Precision</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Win Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {traders.map(t => (
                                <tr key={t.rank} className="group hover:bg-slate-50/50 dark:hover:bg-brand-primary/5 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-black text-sm border ${t.rank === 1 ? 'bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-500/20' :
                                                t.rank === 2 ? 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-400/20' :
                                                    t.rank === 3 ? 'bg-orange-800/80 text-orange-200 border-orange-900/20' :
                                                        'bg-slate-100 dark:bg-slate-800 text-slate-500 border-white/5'
                                            }`}>
                                            #{t.rank}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white/5 flex items-center justify-center overflow-hidden">
                                                <div className="w-full h-full bg-gradient-to-tr from-brand-primary to-brand-secondary opacity-50"></div>
                                            </div>
                                            <span className="font-display font-bold text-slate-800 dark:text-slate-100 text-base">{t.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${t.status === 'Legend' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                                                t.status === 'Elite' ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' :
                                                    'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                                            }`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-display font-black text-emerald-500 text-lg">{t.profit}</td>
                                    <td className="px-8 py-6 font-display font-black text-brand-primary">{t.accuracy}</td>
                                    <td className="px-8 py-6 font-display font-black text-slate-400 text-right">{t.winRate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default RankingsPage
