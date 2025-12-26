import React, { useState, useMemo, Suspense, lazy } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Info, ExternalLink, Share2, Star, Loader2, TrendingUp, Activity, Target } from 'lucide-react'

// Import components with correct paths
import BettingPanel from '../../components/BettingPanel/BettingPanel'
import PriceChart from '../../components/PriceChart/PriceChart'
import ScenarioStatsTable from '../../components/ScenarioStatsTable/ScenarioStatsTable'
import EventAnalysisChart from '../../components/charts/EventAnalysisChart'

// Asset configuration map with realistic data
const assetConfig: Record<string, {
    name: string;
    description: string;
    basePrice: number;
    volatility: number;
    change: number;
    tradingViewSymbol: string;
}> = {
    // Crypto
    'Crypto:L1:BTC': {
        name: 'BTC',
        description: 'Bitcoin / US Dollar',
        basePrice: 88436.39,
        volatility: 500,
        change: -0.44,
        tradingViewSymbol: 'BTCUSD'
    },
    'Crypto:L1:ETH': {
        name: 'ETH',
        description: 'Ethereum / US Dollar',
        basePrice: 2976.20,
        volatility: 50,
        change: 0.19,
        tradingViewSymbol: 'ETHUSD'
    },
    // Equities
    'Equity:USTECH:NVDA': {
        name: 'NVDA',
        description: 'NVIDIA Corporation',
        basePrice: 875.50,
        volatility: 15,
        change: 3.2,
        tradingViewSymbol: 'NVDA'
    },
    'Equity:Index:SPX': {
        name: 'S&P 500',
        description: 'S&P 500 Index',
        basePrice: 6834.49,
        volatility: 30,
        change: 0.88,
        tradingViewSymbol: 'SPX'
    },
    // Forex
    'Forex:EUR:USD': {
        name: 'EUR/USD',
        description: 'Euro / US Dollar',
        basePrice: 1.09,
        volatility: 0.005,
        change: -0.3,
        tradingViewSymbol: 'EURUSD'
    },
    // Commodities
    'Commodity:Energy:WTI': {
        name: 'WTI',
        description: 'Crude Oil WTI',
        basePrice: 82.45,
        volatility: 2,
        change: 1.5,
        tradingViewSymbol: 'USOIL'
    },
    'Commodity:Metal:XAU': {
        name: 'Gold',
        description: 'Gold / US Dollar',
        basePrice: 4338.38,
        volatility: 20,
        change: 1.2,
        tradingViewSymbol: 'XAUUSD'
    },
    // Rates
    'Rate:US:10Y': {
        name: 'US10Y',
        description: '10Y Treasury',
        basePrice: 4.56,
        volatility: 0.05,
        change: -0.05,
        tradingViewSymbol: 'US10Y'
    }
}

// Default fallback for unknown assets
const defaultAsset = {
    name: 'Unknown',
    description: 'Unknown Asset',
    basePrice: 100,
    volatility: 5,
    change: 0,
    tradingViewSymbol: 'SPY'
}

const AssetDetailPage = () => {
    const { id } = useParams()
    const [timeframe, setTimeframe] = useState('1D')

    // Get asset config based on id
    const assetData = useMemo(() => {
        if (!id) return defaultAsset
        // Try exact match first
        if (assetConfig[id]) return assetConfig[id]
        // Try to find by partial match (e.g., if route uses different format)
        const foundKey = Object.keys(assetConfig).find(key =>
            key.toLowerCase().includes(id.toLowerCase()) ||
            id.toLowerCase().includes(key.split(':').pop()?.toLowerCase() || '')
        )
        return foundKey ? assetConfig[foundKey] : defaultAsset
    }, [id])

    // Generate price data based on asset's base price and volatility
    const priceData = useMemo(() => {
        const data = []
        let price = assetData.basePrice
        const now = Math.floor(Date.now() / 1000)
        for (let i = 0; i < 100; i++) {
            price += (Math.random() - 0.5) * assetData.volatility
            // Ensure price doesn't go negative
            price = Math.max(price, assetData.basePrice * 0.8)
            data.push({ time: now - (100 - i) * 3600, value: price })
        }
        return data
    }, [assetData])

    // Current price (last value from price data)
    const currentPrice = useMemo(() => {
        return priceData.length > 0 ? priceData[priceData.length - 1].value : assetData.basePrice
    }, [priceData, assetData])

    // Format price based on asset type
    const formatPrice = (price: number) => {
        if (price >= 1000) {
            return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        } else if (price >= 10) {
            return price.toFixed(2)
        } else if (price >= 1) {
            return price.toFixed(4)
        } else {
            return price.toFixed(6)
        }
    }

    // Mock data for historical stats
    const statsData = [
        { comparison: 'Actual < Forecast', count: 28, upCount: 9, upProb: 32.14, downCount: 19, downProb: 67.86, avgVolatility: 0.1766 },
        { comparison: 'Actual = Forecast', count: 23, upCount: 10, upProb: 43.48, downCount: 13, downProb: 56.52, avgVolatility: 0.1542 },
        { comparison: 'Actual > Forecast', count: 33, upCount: 18, upProb: 54.55, downCount: 15, downProb: 45.45, avgVolatility: 0.1571 },
    ]

    const isPositiveChange = assetData.change >= 0

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link to="/" className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-glass-sm transition-all duration-300 group">
                        <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">{id || assetData.name}</h2>
                            <button className="text-slate-300 hover:text-amber-400 dark:text-slate-600 dark:hover:text-amber-400 transition-colors">
                                <Star size={22} />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-slate-500 font-medium text-sm">{assetData.description}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                            <div className={`flex items-center gap-1 font-bold text-sm ${isPositiveChange ? 'text-financial-up' : 'text-financial-down'}`}>
                                <TrendingUp size={14} className={isPositiveChange ? '' : 'rotate-180'} />
                                {isPositiveChange ? '+' : ''}{assetData.change.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => alert('Sharing market...')}
                        className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 transition-all"
                    >
                        <Share2 size={20} />
                    </button>
                    <a
                        href={`https://www.tradingview.com/symbols/${assetData.tradingViewSymbol}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all shadow-glass-sm"
                    >
                        <ExternalLink size={18} />
                        View on TradingView
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Chart & Stats */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Main Chart Card */}
                    <div className="card-premium flex flex-col p-1 overflow-visible">
                        <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                {['1H', '1D', '1W', '1M', 'ALL'].map(tf => (
                                    <button
                                        key={tf}
                                        onClick={() => setTimeframe(tf)}
                                        className={`px-5 py-2 text-xs font-black rounded-lg transition-all duration-300 ${timeframe === tf
                                            ? 'bg-white dark:bg-slate-700 text-brand-primary shadow-glass-sm'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-financial-up animate-pulse"></span>
                                    Live Price
                                </div>
                                <div className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                    ${formatPrice(currentPrice)}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 px-4 pb-4 min-h-[450px]">
                            <Suspense fallback={
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                                    <Loader2 className="animate-spin" size={32} />
                                    <span className="text-sm font-bold uppercase tracking-widest">Initializing Feed...</span>
                                </div>
                            }>
                                <PriceChart data={priceData} />
                            </Suspense>
                        </div>
                    </div>

                    {/* Prediction Context */}
                    <div className="space-y-8">
                        {/* Summary Stats Table */}
                        <div className="card-premium p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                        <TrendingUp size={22} />
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">Post-Release Asset Reactions</h3>
                                </div>
                            </div>
                            <ScenarioStatsTable data={statsData} />
                        </div>

                        {/* Trend Chart */}
                        <div className="grid grid-cols-1 gap-8">
                            <div className="card-premium p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                        <Activity size={22} />
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">Market Sentiment</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-sm font-bold text-financial-up uppercase tracking-wider">Bullish</span>
                                        <span className="text-2xl font-display font-black text-slate-800 dark:text-slate-100">68%</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-financial-up shadow-[0_0_12px_rgba(16,185,129,0.4)]" style={{ width: '68%' }}></div>
                                        <div className="h-full bg-financial-down opacity-30" style={{ width: '32%' }}></div>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        Based on the last 24h prediction volume. Traders are expecting a positive outcome for the upcoming release.
                                    </p>
                                </div>
                            </div>

                            <div className="card-premium p-8">
                                <EventAnalysisChart />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Console */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="sticky top-28 space-y-8">
                        <div className="card-premium p-8 shadow-glass-lg border-brand-primary/20 bg-white/100 dark:bg-slate-900/100">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">Predict Result</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Info size={14} className="text-brand-primary" />
                                        <p className="text-xs font-bold text-brand-primary uppercase tracking-widest">Next Event: Dec 19</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-[1.5rem] mb-8 border border-slate-200 dark:border-slate-700/50">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Major Macro Event</p>
                                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Consumer Price Index (CPI)</h4>
                                <p className="text-xs text-slate-500 font-medium">Core Inflation data release by the BLS.</p>
                            </div>

                            <BettingPanel asset={id} />
                        </div>

                        <div className="card-premium p-8 bg-brand-primary/5 border-brand-primary/10">
                            <h3 className="font-display font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">Market Info</h3>
                            <div className="space-y-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Prediction market for {assetData.name} based on US inflation volatility.
                                </p>
                                <div className="flex items-center gap-3 text-brand-primary font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all cursor-pointer">
                                    View Event Methodology <ChevronRight size={14} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssetDetailPage

