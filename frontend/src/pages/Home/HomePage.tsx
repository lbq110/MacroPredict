import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import AssetCard from '../../components/AssetCard/AssetCard'
import { Filter, ArrowUpRight, Globe, Zap, Calendar, TrendingUp, Search } from 'lucide-react'

const HomePage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All')

    // Categories based on PRD 3.1
    const categories = ['All', 'Crypto', 'Equity', 'Index', 'Forex', 'Commodity', 'Rates & Bonds']

    // Mock data for assets with new schema
    const allAssets = [
        {
            id: 1,
            asset_id: 'Crypto:L1:BTC',
            asset_class: 'Crypto',
            asset_subclass: 'L1',
            symbol: 'BTC',
            name: 'Bitcoin',
            price: 88436.39,
            change: -0.44,
            nextEvent: 'Price Prediction',
            eventTime: '2h 15m'
        },
        {
            id: 2,
            asset_id: 'Crypto:L1:ETH',
            asset_class: 'Crypto',
            asset_subclass: 'L1',
            symbol: 'ETH',
            name: 'Ethereum',
            price: 2976.20,
            change: 0.19,
            nextEvent: 'Range Market',
            eventTime: '5h 30m'
        },
        {
            id: 3,
            asset_id: 'Equity:USTech:NVDA',
            asset_class: 'Equity',
            asset_subclass: 'US Tech',
            symbol: 'NVDA',
            name: 'NVIDIA',
            price: 875.50,
            change: 3.2,
            nextEvent: 'Earnings Prediction',
            eventTime: '1d 4h'
        },
        {
            id: 4,
            asset_id: 'Index:Equity:SP500',
            asset_class: 'Index',
            asset_subclass: 'Equity Index',
            symbol: 'S&P 500',
            name: 'S&P 500',
            price: 6834.49,
            change: 0.88,
            nextEvent: 'Weekly Close',
            eventTime: '3d 2h'
        },
        {
            id: 5,
            asset_id: 'Forex:Major:EURUSD',
            asset_class: 'Forex',
            asset_subclass: 'Major Pairs',
            symbol: 'EUR/USD',
            name: 'Euro',
            price: 1.0850,
            change: -0.3,
            nextEvent: 'Range Prediction',
            eventTime: '6h 12m'
        },
        {
            id: 6,
            asset_id: 'Commodity:Energy:WTI',
            asset_class: 'Commodity',
            asset_subclass: 'Energy',
            symbol: 'WTI',
            name: 'Crude Oil',
            price: 82.45,
            change: 1.5,
            nextEvent: 'Price Target',
            eventTime: '12h 45m'
        },
        {
            id: 7,
            asset_id: 'Commodity:Metals:XAU',
            asset_class: 'Commodity',
            asset_subclass: 'Metals',
            symbol: 'Gold',
            name: 'Gold',
            price: 4338.38,
            change: 1.2,
            nextEvent: 'Weekly High/Low',
            eventTime: '1d 4h'
        },
        {
            id: 8,
            asset_id: 'Rates:Yield:US10Y',
            asset_class: 'Rates & Bonds',
            asset_subclass: 'Sovereign Yields',
            symbol: 'US10Y',
            name: '10Y Treasury',
            price: 4.14,
            change: -0.05,
            nextEvent: 'Yield Prediction',
            eventTime: '1d 8h'
        },
    ]

    const filteredAssets = useMemo(() => {
        if (selectedCategory === 'All') return allAssets
        return allAssets.filter(asset => (asset as any).asset_class === selectedCategory)
    }, [selectedCategory])

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative p-10 rounded-[2.5rem] bg-slate-900 border border-white/5 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-secondary/20"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest border border-brand-primary/20">Platform Live</span>
                            <span className="text-slate-500 text-xs font-medium flex items-center gap-1"><Zap size={10} className="text-amber-500" /> High Volatility Expected Today</span>
                        </div>
                        <h1 className="text-5xl font-display font-black text-white mb-6 leading-[1.1]">
                            Predict the <span className="text-gradient-primary">Macro Move</span>.
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            The world's first macroeconomic prediction engine. Trade the outcome of global data releases with high-fidelity analytics and deterministic settlement.
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => document.getElementById('markets-grid')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-primary px-8 py-4 flex items-center gap-2"
                            >
                                Explore Markets <ArrowUpRight size={18} />
                            </button>
                            <Link
                                to="/calendar"
                                className="px-8 py-4 border border-slate-700 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
                            >
                                <Calendar size={18} />
                                Economic Calendar
                            </Link>
                        </div>
                    </div>

                    {/* Upcoming Events Mini-Marquee */}
                    <div className="hidden lg:block space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Upcoming High-Impact Events</span>
                            <TrendingUp size={16} className="text-brand-primary" />
                        </div>
                        {[
                            { name: 'Core CPI (MoM)', time: 'in 2h 14m', impact: 'High' },
                            { name: 'ECB Rate Decision', time: 'in 5h 30m', impact: 'High' },
                            { name: 'Initial Jobless Claims', time: 'in 6h 45m', impact: 'Medium' }
                        ].map((event, i) => (
                            <div key={i} className="glass-panel-dark p-5 rounded-3xl flex items-center justify-between group hover:border-brand-primary/50 transition-all cursor-pointer">
                                <div>
                                    <h4 className="font-bold text-white group-hover:text-brand-primary transition-colors">{event.name}</h4>
                                    <p className="text-xs text-slate-400 mt-0.5">{event.time}</p>
                                </div>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${event.impact === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                                    {event.impact}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Markets Grid Section */}
            <div id="markets-grid" className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                <Globe size={22} />
                            </div>
                            <h2 className="text-3xl font-display font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Active Markets</h2>
                        </div>
                        <p className="text-slate-500 font-bold ml-1">Trade macro data volatility on major global assets.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-x-auto no-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? 'bg-white dark:bg-slate-700 shadow-glass-sm text-brand-primary'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <button className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-500 hover:text-brand-primary transition-all shadow-glass-sm">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredAssets.length > 0 ? filteredAssets.map(asset => (
                        <AssetCard key={asset.id} asset={asset} />
                    )) : (
                        <div className="col-span-full py-20 text-center card-premium rounded-[3rem] border-dashed border-white/10">
                            <Search size={40} className="mx-auto mb-4 text-slate-600" />
                            <p className="text-slate-500 font-display font-bold text-xl uppercase tracking-widest">No assets found in this category</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HomePage
