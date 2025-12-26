import React from 'react'
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle, History, Wallet, TrendingUp, BarChart3, Activity } from 'lucide-react'

const PortfolioPage = () => {
    const activeBets = [
        { id: 1, asset: 'BTC/USD', type: 'UP', amount: 500, entry: 64230.50, current: 64450.20, expiry: '1.5h', pnl: 12.50 },
        { id: 2, asset: 'ETH/USD', type: 'DOWN', amount: 200, entry: 3450.20, current: 3420.10, expiry: '4.2h', pnl: 8.40 },
    ]

    const history = [
        { id: 101, asset: 'GOLD', type: 'UP', amount: 1000, result: 'WIN', payout: 1850.00, date: 'Dec 18, 2024' },
        { id: 102, asset: 'SPX', type: 'DOWN', amount: 300, result: 'LOSS', payout: 0, date: 'Dec 17, 2024' },
        { id: 103, asset: 'EUR/USD', type: 'UP', amount: 1500, result: 'WIN', payout: 2775.00, date: 'Dec 16, 2024' },
    ]

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Portfolio Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card-premium p-8 bg-brand-primary overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Wallet size={120} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-2">Total Net Worth</p>
                        <h2 className="text-4xl font-display font-black text-white">$14,350.50</h2>
                        <div className="flex items-center gap-2 mt-4 text-white/80">
                            <TrendingUp size={16} />
                            <span className="text-sm font-bold">+12.4% this month</span>
                        </div>
                    </div>
                </div>

                <div className="card-premium p-8 flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">Locked in Bets</p>
                        <h2 className="text-3xl font-display font-black text-slate-800 dark:text-slate-100">$700.00</h2>
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
                            <Clock size={20} />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending settlement from 2 events.</p>
                    </div>
                </div>

                <div className="card-premium p-8 flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">Total Profit</p>
                        <h2 className="text-3xl font-display font-black text-financial-up">+$2,145.20</h2>
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-financial-up">
                            <BarChart3 size={20} />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Outperforming 78% of traders.</p>
                    </div>
                </div>
            </div>

            {/* Active Positions */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                        <Activity size={18} />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">Active Positions</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeBets.map(bet => (
                        <div key={bet.id} className="card-premium p-6 group hover:border-brand-primary/30 transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${bet.type === 'UP' ? 'bg-financial-up text-white' : 'bg-financial-down text-white'
                                        }`}>
                                        {bet.type === 'UP' ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
                                    </div>
                                    <div>
                                        <h4 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">{bet.asset}</h4>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{bet.type} PREDICTION</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unrealized PnL</div>
                                    <div className={`text-sm font-black font-display ${bet.pnl > 0 ? 'text-financial-up' : 'text-financial-down'}`}>
                                        {bet.pnl > 0 ? '+' : ''}${bet.pnl.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Invested</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">${bet.amount}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Entry</p>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">${bet.entry}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Left</p>
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-brand-primary">
                                        <Clock size={12} />
                                        {bet.expiry}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* History Table */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <History size={18} />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">Settled Predictions</h3>
                </div>

                <div className="card-premium overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset & Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Side</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Result</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Payout</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {history.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="font-display font-bold text-slate-800 dark:text-slate-100">{item.asset}</div>
                                            <div className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{item.date}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black ${item.type === 'UP' ? 'bg-financial-up/10 text-financial-up' : 'bg-financial-down/10 text-financial-down'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-slate-600 dark:text-slate-400">${item.amount}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                {item.result === 'WIN' ? (
                                                    <CheckCircle2 size={16} className="text-financial-up" />
                                                ) : (
                                                    <AlertCircle size={16} className="text-financial-down" />
                                                )}
                                                <span className={`text-xs font-black uppercase tracking-widest ${item.result === 'WIN' ? 'text-financial-up' : 'text-financial-down'
                                                    }`}>
                                                    {item.result}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={`px-8 py-6 text-sm font-display font-black text-right ${item.payout > 0 ? 'text-financial-up' : 'text-slate-400'
                                            }`}>
                                            {item.payout > 0 ? `+$${item.payout.toFixed(2)}` : '$0.00'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortfolioPage
