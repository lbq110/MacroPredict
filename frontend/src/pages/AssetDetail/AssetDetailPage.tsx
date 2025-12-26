import React, { useState, useMemo, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Info, ExternalLink, Share2, Star, Loader2, TrendingUp, TrendingDown } from 'lucide-react'

// Import components
import BettingPanel from '../../components/BettingPanel/BettingPanel'
import PriceChart from '../../components/PriceChart/PriceChart'
import MacroEventCard from '../../components/MacroEvents/MacroEventCard'

// Macro event definitions
const macroEvents = {
    cpi: {
        id: 'cpi',
        name: 'Consumer Price Index (CPI)',
        nameCn: '消费者价格指数',
        description: 'US Consumer Price Index - Core inflation measurement',
        nextRelease: '2025-01-15 08:30 EST',
    },
    nfp: {
        id: 'nfp',
        name: 'Non-Farm Payrolls',
        nameCn: '非农就业数据',
        description: 'US Non-Farm Payrolls - Employment report',
        nextRelease: '2025-01-10 08:30 EST',
    },
    fomc: {
        id: 'fomc',
        name: 'Fed Interest Rate Decision',
        nameCn: '美联储利率决议',
        description: 'Federal Reserve FOMC Interest Rate Decision',
        nextRelease: '2025-01-29 14:00 EST',
    },
    gdp: {
        id: 'gdp',
        name: 'GDP Growth Rate',
        nameCn: '国内生产总值',
        description: 'US Gross Domestic Product quarterly report',
        nextRelease: '2025-01-30 08:30 EST',
    },
    earnings: {
        id: 'earnings',
        name: 'Quarterly Earnings',
        nameCn: '季度财报',
        description: 'Company quarterly earnings report',
        nextRelease: '2025-02-20 16:00 EST',
    },
    ecb: {
        id: 'ecb',
        name: 'ECB Interest Rate Decision',
        nameCn: '欧洲央行利率决议',
        description: 'European Central Bank rate decision',
        nextRelease: '2025-01-30 13:45 CET',
    },
    eia: {
        id: 'eia',
        name: 'EIA Crude Oil Inventory',
        nameCn: 'EIA原油库存',
        description: 'Weekly petroleum status report',
        nextRelease: '2025-01-08 10:30 EST',
    },
    opec: {
        id: 'opec',
        name: 'OPEC+ Meeting',
        nameCn: 'OPEC+会议',
        description: 'OPEC+ production decision',
        nextRelease: '2025-02-03 14:00 CET',
    },
    treasury: {
        id: 'treasury',
        name: 'Treasury Auction',
        nameCn: '美债拍卖',
        description: 'US Treasury bond auction results',
        nextRelease: '2025-01-09 13:00 EST',
    },
}

// Asset configuration with macro events
const assetConfig: Record<string, {
    name: string;
    description: string;
    basePrice: number;
    volatility: number;
    change: number;
    tradingViewSymbol: string;
    macroEventIds: string[];
    macroStats: Record<string, {
        aboveExpectation: { count: number; avgChange: number; upProb: number; downProb: number };
        meetsExpectation: { count: number; avgChange: number; upProb: number; downProb: number };
        belowExpectation: { count: number; avgChange: number; upProb: number; downProb: number };
    }>;
}> = {
    // Crypto - BTC
    'Crypto:L1:BTC': {
        name: 'BTC',
        description: 'Bitcoin / US Dollar',
        basePrice: 98436.39,
        volatility: 500,
        change: -0.44,
        tradingViewSymbol: 'BTCUSD',
        macroEventIds: ['cpi', 'nfp', 'fomc'],
        macroStats: {
            cpi: {
                aboveExpectation: { count: 28, avgChange: -2.1, upProb: 32, downProb: 68 },
                meetsExpectation: { count: 23, avgChange: 0.3, upProb: 52, downProb: 48 },
                belowExpectation: { count: 33, avgChange: 1.8, upProb: 65, downProb: 35 },
            },
            nfp: {
                aboveExpectation: { count: 31, avgChange: -1.5, upProb: 38, downProb: 62 },
                meetsExpectation: { count: 18, avgChange: 0.2, upProb: 50, downProb: 50 },
                belowExpectation: { count: 35, avgChange: 2.1, upProb: 68, downProb: 32 },
            },
            fomc: {
                aboveExpectation: { count: 12, avgChange: -3.2, upProb: 25, downProb: 75 },
                meetsExpectation: { count: 42, avgChange: 0.5, upProb: 55, downProb: 45 },
                belowExpectation: { count: 18, avgChange: 2.8, upProb: 72, downProb: 28 },
            },
        },
    },
    // Crypto - ETH
    'Crypto:L1:ETH': {
        name: 'ETH',
        description: 'Ethereum / US Dollar',
        basePrice: 3376.20,
        volatility: 50,
        change: 0.19,
        tradingViewSymbol: 'ETHUSD',
        macroEventIds: ['cpi', 'nfp', 'fomc'],
        macroStats: {
            cpi: {
                aboveExpectation: { count: 26, avgChange: -2.5, upProb: 30, downProb: 70 },
                meetsExpectation: { count: 22, avgChange: 0.4, upProb: 51, downProb: 49 },
                belowExpectation: { count: 30, avgChange: 2.2, upProb: 67, downProb: 33 },
            },
            nfp: {
                aboveExpectation: { count: 29, avgChange: -1.8, upProb: 35, downProb: 65 },
                meetsExpectation: { count: 16, avgChange: 0.3, upProb: 52, downProb: 48 },
                belowExpectation: { count: 33, avgChange: 2.5, upProb: 70, downProb: 30 },
            },
            fomc: {
                aboveExpectation: { count: 11, avgChange: -3.8, upProb: 22, downProb: 78 },
                meetsExpectation: { count: 40, avgChange: 0.6, upProb: 54, downProb: 46 },
                belowExpectation: { count: 16, avgChange: 3.2, upProb: 75, downProb: 25 },
            },
        },
    },
    // Equities - NVDA
    'Equity:USTECH:NVDA': {
        name: 'NVDA',
        description: 'NVIDIA Corporation',
        basePrice: 138.50,
        volatility: 5,
        change: 3.2,
        tradingViewSymbol: 'NVDA',
        macroEventIds: ['earnings', 'gdp', 'fomc'],
        macroStats: {
            earnings: {
                aboveExpectation: { count: 18, avgChange: 8.5, upProb: 85, downProb: 15 },
                meetsExpectation: { count: 8, avgChange: -1.2, upProb: 40, downProb: 60 },
                belowExpectation: { count: 6, avgChange: -12.3, upProb: 10, downProb: 90 },
            },
            gdp: {
                aboveExpectation: { count: 22, avgChange: 2.1, upProb: 68, downProb: 32 },
                meetsExpectation: { count: 25, avgChange: 0.3, upProb: 52, downProb: 48 },
                belowExpectation: { count: 19, avgChange: -1.5, upProb: 35, downProb: 65 },
            },
            fomc: {
                aboveExpectation: { count: 14, avgChange: -2.8, upProb: 30, downProb: 70 },
                meetsExpectation: { count: 38, avgChange: 0.8, upProb: 58, downProb: 42 },
                belowExpectation: { count: 15, avgChange: 3.5, upProb: 75, downProb: 25 },
            },
        },
    },
    // Equities - S&P 500
    'Equity:Index:SPX': {
        name: 'S&P 500',
        description: 'S&P 500 Index',
        basePrice: 5983.49,
        volatility: 30,
        change: 0.88,
        tradingViewSymbol: 'SPX',
        macroEventIds: ['cpi', 'nfp', 'gdp'],
        macroStats: {
            cpi: {
                aboveExpectation: { count: 30, avgChange: -0.8, upProb: 38, downProb: 62 },
                meetsExpectation: { count: 28, avgChange: 0.2, upProb: 55, downProb: 45 },
                belowExpectation: { count: 26, avgChange: 0.9, upProb: 65, downProb: 35 },
            },
            nfp: {
                aboveExpectation: { count: 32, avgChange: 0.5, upProb: 58, downProb: 42 },
                meetsExpectation: { count: 20, avgChange: 0.1, upProb: 52, downProb: 48 },
                belowExpectation: { count: 30, avgChange: -0.6, upProb: 40, downProb: 60 },
            },
            gdp: {
                aboveExpectation: { count: 24, avgChange: 1.2, upProb: 72, downProb: 28 },
                meetsExpectation: { count: 22, avgChange: 0.2, upProb: 54, downProb: 46 },
                belowExpectation: { count: 18, avgChange: -1.5, upProb: 28, downProb: 72 },
            },
        },
    },
    // Forex - EUR/USD
    'Forex:EUR:USD': {
        name: 'EUR/USD',
        description: 'Euro / US Dollar',
        basePrice: 1.04,
        volatility: 0.005,
        change: -0.3,
        tradingViewSymbol: 'EURUSD',
        macroEventIds: ['ecb', 'cpi', 'nfp'],
        macroStats: {
            ecb: {
                aboveExpectation: { count: 15, avgChange: -0.8, upProb: 25, downProb: 75 },
                meetsExpectation: { count: 35, avgChange: 0.1, upProb: 50, downProb: 50 },
                belowExpectation: { count: 12, avgChange: 0.6, upProb: 70, downProb: 30 },
            },
            cpi: {
                aboveExpectation: { count: 28, avgChange: 0.4, upProb: 62, downProb: 38 },
                meetsExpectation: { count: 24, avgChange: 0.0, upProb: 50, downProb: 50 },
                belowExpectation: { count: 32, avgChange: -0.3, upProb: 35, downProb: 65 },
            },
            nfp: {
                aboveExpectation: { count: 30, avgChange: -0.5, upProb: 32, downProb: 68 },
                meetsExpectation: { count: 18, avgChange: 0.0, upProb: 50, downProb: 50 },
                belowExpectation: { count: 34, avgChange: 0.4, upProb: 68, downProb: 32 },
            },
        },
    },
    // Commodities - WTI
    'Commodity:Energy:WTI': {
        name: 'WTI',
        description: 'Crude Oil WTI',
        basePrice: 72.45,
        volatility: 2,
        change: 1.5,
        tradingViewSymbol: 'USOIL',
        macroEventIds: ['eia', 'opec', 'gdp'],
        macroStats: {
            eia: {
                aboveExpectation: { count: 45, avgChange: -1.2, upProb: 30, downProb: 70 },
                meetsExpectation: { count: 8, avgChange: 0.1, upProb: 50, downProb: 50 },
                belowExpectation: { count: 42, avgChange: 1.5, upProb: 72, downProb: 28 },
            },
            opec: {
                aboveExpectation: { count: 8, avgChange: -3.5, upProb: 20, downProb: 80 },
                meetsExpectation: { count: 15, avgChange: 0.2, upProb: 52, downProb: 48 },
                belowExpectation: { count: 10, avgChange: 4.2, upProb: 82, downProb: 18 },
            },
            gdp: {
                aboveExpectation: { count: 22, avgChange: 1.0, upProb: 65, downProb: 35 },
                meetsExpectation: { count: 24, avgChange: 0.1, upProb: 52, downProb: 48 },
                belowExpectation: { count: 20, avgChange: -0.8, upProb: 38, downProb: 62 },
            },
        },
    },
    // Commodities - Gold
    'Commodity:Metal:XAU': {
        name: 'Gold',
        description: 'Gold / US Dollar',
        basePrice: 2638.38,
        volatility: 20,
        change: 1.2,
        tradingViewSymbol: 'XAUUSD',
        macroEventIds: ['fomc', 'cpi', 'nfp'],
        macroStats: {
            fomc: {
                aboveExpectation: { count: 14, avgChange: -1.8, upProb: 28, downProb: 72 },
                meetsExpectation: { count: 40, avgChange: 0.3, upProb: 55, downProb: 45 },
                belowExpectation: { count: 16, avgChange: 2.2, upProb: 78, downProb: 22 },
            },
            cpi: {
                aboveExpectation: { count: 26, avgChange: 0.8, upProb: 62, downProb: 38 },
                meetsExpectation: { count: 22, avgChange: 0.1, upProb: 52, downProb: 48 },
                belowExpectation: { count: 30, avgChange: -0.5, upProb: 38, downProb: 62 },
            },
            nfp: {
                aboveExpectation: { count: 28, avgChange: -0.6, upProb: 35, downProb: 65 },
                meetsExpectation: { count: 16, avgChange: 0.1, upProb: 50, downProb: 50 },
                belowExpectation: { count: 32, avgChange: 0.9, upProb: 68, downProb: 32 },
            },
        },
    },
    // Rates - US10Y
    'Rate:US:10Y': {
        name: 'US10Y',
        description: '10Y Treasury',
        basePrice: 4.56,
        volatility: 0.05,
        change: -0.05,
        tradingViewSymbol: 'US10Y',
        macroEventIds: ['fomc', 'cpi', 'treasury'],
        macroStats: {
            fomc: {
                aboveExpectation: { count: 12, avgChange: 3.5, upProb: 75, downProb: 25 },
                meetsExpectation: { count: 42, avgChange: 0.2, upProb: 52, downProb: 48 },
                belowExpectation: { count: 18, avgChange: -2.8, upProb: 22, downProb: 78 },
            },
            cpi: {
                aboveExpectation: { count: 28, avgChange: 1.2, upProb: 70, downProb: 30 },
                meetsExpectation: { count: 24, avgChange: 0.1, upProb: 52, downProb: 48 },
                belowExpectation: { count: 32, avgChange: -0.8, upProb: 32, downProb: 68 },
            },
            treasury: {
                aboveExpectation: { count: 35, avgChange: -0.5, upProb: 38, downProb: 62 },
                meetsExpectation: { count: 20, avgChange: 0.1, upProb: 50, downProb: 50 },
                belowExpectation: { count: 30, avgChange: 0.6, upProb: 65, downProb: 35 },
            },
        },
    },
}

// Default fallback
const defaultAsset = {
    name: 'Unknown',
    description: 'Unknown Asset',
    basePrice: 100,
    volatility: 5,
    change: 0,
    tradingViewSymbol: 'SPY',
    macroEventIds: ['cpi', 'nfp', 'fomc'],
    macroStats: {
        cpi: {
            aboveExpectation: { count: 20, avgChange: -1.0, upProb: 40, downProb: 60 },
            meetsExpectation: { count: 20, avgChange: 0.0, upProb: 50, downProb: 50 },
            belowExpectation: { count: 20, avgChange: 1.0, upProb: 60, downProb: 40 },
        },
        nfp: {
            aboveExpectation: { count: 20, avgChange: -1.0, upProb: 40, downProb: 60 },
            meetsExpectation: { count: 20, avgChange: 0.0, upProb: 50, downProb: 50 },
            belowExpectation: { count: 20, avgChange: 1.0, upProb: 60, downProb: 40 },
        },
        fomc: {
            aboveExpectation: { count: 20, avgChange: -1.0, upProb: 40, downProb: 60 },
            meetsExpectation: { count: 20, avgChange: 0.0, upProb: 50, downProb: 50 },
            belowExpectation: { count: 20, avgChange: 1.0, upProb: 60, downProb: 40 },
        },
    },
}

const AssetDetailPage = () => {
    const { id } = useParams()
    const [timeframe, setTimeframe] = useState('1D')

    // Get asset config based on id
    const assetData = useMemo(() => {
        if (!id) return defaultAsset
        if (assetConfig[id]) return assetConfig[id]
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
            price = Math.max(price, assetData.basePrice * 0.8)
            data.push({ time: now - (100 - i) * 3600, value: price })
        }
        return data
    }, [assetData])

    // Current price
    const currentPrice = useMemo(() => {
        return priceData.length > 0 ? priceData[priceData.length - 1].value : assetData.basePrice
    }, [priceData, assetData])

    // Format price
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

    // Get macro events for this asset
    const assetMacroEvents = useMemo(() => {
        return assetData.macroEventIds.map(eventId => {
            const eventDef = macroEvents[eventId as keyof typeof macroEvents]
            const stats = assetData.macroStats[eventId]
            return {
                ...eventDef,
                stats,
            }
        })
    }, [assetData])

    const isPositiveChange = assetData.change >= 0

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link to="/" className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-glass-sm transition-all duration-300 group">
                        <ChevronLeft size={24} className="text-slate-600 dark:text-slate-300 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">{assetData.name}</h2>
                            <button className="text-slate-300 hover:text-amber-400 dark:text-slate-600 dark:hover:text-amber-400 transition-colors">
                                <Star size={22} />
                            </button>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-slate-500 font-medium text-sm">{assetData.description}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                            <div className={`flex items-center gap-1 font-bold text-sm ${isPositiveChange ? 'text-financial-up' : 'text-financial-down'}`}>
                                {isPositiveChange ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
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
                {/* Left Column: Chart & Macro Events */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Price Chart Card */}
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
                                    实时价格
                                </div>
                                <div className="text-3xl font-display font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                    ${formatPrice(currentPrice)}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 px-4 pb-4 min-h-[350px]">
                            <Suspense fallback={
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                                    <Loader2 className="animate-spin" size={32} />
                                    <span className="text-sm font-bold uppercase tracking-widest">加载价格数据...</span>
                                </div>
                            }>
                                <PriceChart data={priceData} />
                            </Suspense>
                        </div>
                    </div>

                    {/* Macro Events Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-display font-bold text-slate-800 dark:text-slate-100">
                                影响 {assetData.name} 价格的宏观数据
                            </h3>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                {assetMacroEvents.length} 个关键指标
                            </span>
                        </div>

                        <div className="space-y-4">
                            {assetMacroEvents.map((event) => (
                                <MacroEventCard
                                    key={event.id}
                                    event={event}
                                    assetName={assetData.name}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Betting Panel */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="sticky top-28 space-y-8">
                        <div className="card-premium p-8 shadow-glass-lg border-brand-primary/20 bg-white/100 dark:bg-slate-900/100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-display font-bold text-slate-800 dark:text-slate-100">数据狙击手</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Info size={14} className="text-brand-primary" />
                                        <p className="text-xs font-bold text-brand-primary uppercase tracking-widest">下一事件: CPI 1月15日</p>
                                    </div>
                                </div>
                            </div>

                            <BettingPanel
                                asset={id}
                                forecastValue={3.1}
                                forecastLabel="CPI 预期值"
                            />
                        </div>

                        <div className="card-premium p-8 bg-brand-primary/5 border-brand-primary/10">
                            <h3 className="font-display font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">市场信息</h3>
                            <div className="space-y-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    基于宏观经济数据发布的 {assetData.name} 价格预测市场。
                                </p>
                                <div className="flex items-center gap-3 text-brand-primary font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all cursor-pointer">
                                    查看预测方法 <ChevronRight size={14} />
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
