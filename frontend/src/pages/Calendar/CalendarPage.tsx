import React, { useState, useMemo } from 'react'
import { Calendar as CalendarIcon, Clock, Filter, ChevronRight, Search, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

const CalendarPage = () => {
    const [selectedImpact, setSelectedImpact] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')

    // Mock data based on PRD 3.3 & global macro indicators
    const allEvents = [
        { id: 1, title: 'Consumer Price Index (CPI) MoM', date: 'Dec 19', time: '13:30', impact: 'High', forecast: '0.3%', previous: '0.1%', asset: 'BTC', assetId: 'Crypto:L1:BTC' },
        { id: 2, title: 'Retail Sales (MoM)', date: 'Dec 19', time: '13:30', impact: 'High', forecast: '0.4%', previous: '0.2%', asset: 'S&P 500', assetId: 'Index:Equity:SP500' },
        { id: 3, title: 'Building Permits', date: 'Dec 19', time: '13:30', impact: 'Medium', forecast: '1.45M', previous: '1.47M', asset: 'US10Y', assetId: 'Rates:Yield:US10Y' },
        { id: 4, title: 'Initial Jobless Claims', date: 'Dec 19', time: '13:30', impact: 'High', forecast: '205K', previous: '202K', asset: 'Nasdaq 100', assetId: 'Index:Equity:NDX' },
        { id: 5, title: 'Philadelphia Fed Manufacturing', date: 'Dec 19', time: '13:30', impact: 'Medium', forecast: '-3.0', previous: '-5.9', asset: 'EUR/USD', assetId: 'Forex:Major:EURUSD' },
        { id: 6, title: 'Existing Home Sales', date: 'Dec 20', time: '15:00', impact: 'Medium', forecast: '3.9M', previous: '3.79M', asset: 'Gold', assetId: 'Commodity:Metals:XAU' },
        { id: 7, title: 'Core PCE Price Index', date: 'Dec 22', time: '13:30', impact: 'High', forecast: '0.2%', previous: '0.2%', asset: 'BTC', assetId: 'Crypto:L1:BTC' },
    ]

    const filteredEvents = useMemo(() => {
        return allEvents.filter(event => {
            const matchesImpact = selectedImpact === 'All' || event.impact === selectedImpact
            const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.asset.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesImpact && matchesSearch
        })
    }, [selectedImpact, searchQuery])

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="max-w-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-glass-sm">
                            <CalendarIcon size={24} />
                        </div>
                        <h2 className="text-4xl font-display font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Economic Calendar</h2>
                    </div>
                    <p className="text-slate-500 font-bold ml-1 text-lg">
                        Real-time macroeconomic tracking with direct prediction market integration.
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search events or assets..."
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-primary/20 transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl">
                        {['All', 'High', 'Medium'].map(impact => (
                            <button
                                key={impact}
                                onClick={() => setSelectedImpact(impact)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${selectedImpact === impact
                                    ? 'bg-white dark:bg-slate-700 shadow-glass-sm text-brand-primary'
                                    : 'text-slate-500 hover:text-slate-800'
                                    }`}
                            >
                                {impact}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* High-Density Table */}
            <div className="card-premium overflow-hidden border border-white/5 rounded-[2.5rem] shadow-glass-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/40">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Time (UTC)</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Macro Indicator</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Impact</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Forecast</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Previous</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Prediction Market</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredEvents.map(event => (
                                <tr key={event.id} className="group hover:bg-slate-50/50 dark:hover:bg-brand-primary/5 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-black text-slate-800 dark:text-slate-100">{event.date}</span>
                                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                                                <Clock size={10} />
                                                {event.time}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-colors">
                                                <Activity size={16} />
                                            </div>
                                            <span className="font-display font-bold text-slate-800 dark:text-slate-200 text-base">{event.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${event.impact === 'High'
                                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                            }`}>
                                            {event.impact}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-display font-black text-slate-700 dark:text-slate-300">{event.forecast}</td>
                                    <td className="px-8 py-6 font-display font-black text-slate-400">{event.previous}</td>
                                    <td className="px-8 py-6 text-right">
                                        <Link
                                            to={`/asset/${event.assetId}`}
                                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white border border-brand-primary/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-glass-sm"
                                        >
                                            {event.asset} Markets
                                            <ChevronRight size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Calendar Meta */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-premium p-8 rounded-[2rem] bg-brand-primary/5 border-brand-primary/10">
                    <h4 className="font-display font-black text-lg mb-3">T-minus 1H Rule</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        All markets automatically close for betting exactly 1 hour before the release time to ensure fair play.
                    </p>
                </div>
                <div className="card-premium p-8 rounded-[2rem]">
                    <h4 className="font-display font-black text-lg mb-3">Settlement (T+30)</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        Winners are calculated based on price movement 30 minutes post-release. Automatic payouts are triggered.
                    </p>
                </div>
                <div className="card-premium p-8 rounded-[2rem]">
                    <h4 className="font-display font-black text-lg mb-3">Data Integrity</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        Verified data sources: Bureau of Labor Statistics, Federal Reserve, and Polygon.io for price feeds.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CalendarPage
