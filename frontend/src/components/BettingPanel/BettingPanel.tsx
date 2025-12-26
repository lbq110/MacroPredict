import React, { useState, useMemo } from 'react'
import { TrendingDown, Minus, TrendingUp, Info, ShieldCheck, Zap, Users, Target } from 'lucide-react'

interface BettingPanelProps {
    asset?: string;
    forecastValue?: number;
    forecastLabel?: string;
}

const BettingPanel: React.FC<BettingPanelProps> = ({
    asset,
    forecastValue = 3.1,
    forecastLabel = 'CPI 预期值'
}) => {
    const [selectedBet, setSelectedBet] = useState<'below' | 'meets' | 'above' | null>(null)
    const [amount, setAmount] = useState(100)

    // Simulated bet pool distribution (in real app, this comes from backend)
    const betPool = useMemo(() => ({
        below: { amount: 15000, percentage: 25 },
        meets: { amount: 12000, percentage: 20 },
        above: { amount: 33000, percentage: 55 },
        total: 60000
    }), [])

    // Dynamic odds calculation - less bets = higher odds
    const calculateOdds = (betType: 'below' | 'meets' | 'above') => {
        const baseOdds = {
            below: 2.5,
            meets: 4.0, // Higher base odds for exact match (harder)
            above: 1.8
        }

        // Adjust odds based on bet distribution
        const percentage = betPool[betType].percentage
        let multiplier = 1

        if (percentage <= 10) multiplier = 5.0  // Very low bets = 5x multiplier
        else if (percentage <= 20) multiplier = 2.5
        else if (percentage <= 30) multiplier = 1.5
        else if (percentage >= 60) multiplier = 0.6 // Too many bets = lower odds
        else if (percentage >= 50) multiplier = 0.8

        return (baseOdds[betType] * multiplier).toFixed(1)
    }

    const odds = {
        below: calculateOdds('below'),
        meets: calculateOdds('meets'),
        above: calculateOdds('above')
    }

    const potentialPayout = selectedBet
        ? (amount * parseFloat(odds[selectedBet])).toFixed(2)
        : '0.00'

    const betOptions = [
        {
            id: 'below' as const,
            label: '低于预期',
            labelEn: 'Dovish',
            description: `实际 < ${forecastValue}%`,
            impact: '利好 · 通常上涨',
            icon: TrendingDown,
            color: 'financial-up',
            bgGradient: 'from-emerald-500 to-teal-600',
        },
        {
            id: 'meets' as const,
            label: '符合预期',
            labelEn: 'Neutral',
            description: `实际 = ${forecastValue}%`,
            impact: '横盘 · 波动后回归',
            icon: Minus,
            color: 'amber-500',
            bgGradient: 'from-amber-400 to-orange-500',
        },
        {
            id: 'above' as const,
            label: '高于预期',
            labelEn: 'Hawkish',
            description: `实际 > ${forecastValue}%`,
            impact: '利空 · 通常下跌',
            icon: TrendingUp,
            color: 'financial-down',
            bgGradient: 'from-rose-500 to-red-600',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Forecast Value Display */}
            <div className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-2xl p-4 border border-brand-primary/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target size={18} className="text-brand-primary" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{forecastLabel}</span>
                    </div>
                    <span className="text-2xl font-display font-black text-brand-primary">{forecastValue}%</span>
                </div>
            </div>

            {/* Bet Type Selector - 3 Options */}
            <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">
                    选择预测方向
                </label>
                <div className="space-y-2">
                    {betOptions.map((option) => {
                        const Icon = option.icon
                        const isSelected = selectedBet === option.id
                        const currentOdds = odds[option.id]
                        const poolPercent = betPool[option.id].percentage

                        return (
                            <button
                                key={option.id}
                                onClick={() => setSelectedBet(option.id)}
                                className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${isSelected
                                        ? `border-${option.color} bg-gradient-to-r ${option.bgGradient} text-white shadow-lg scale-[1.02]`
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected
                                                ? 'bg-white/20'
                                                : `bg-${option.color}/10`
                                            }`}>
                                            <Icon size={20} className={isSelected ? 'text-white' : `text-${option.color}`} />
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-display font-bold ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                                                    {option.label}
                                                </span>
                                                <span className={`text-xs font-medium ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                                                    {option.labelEn}
                                                </span>
                                            </div>
                                            <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                                                {option.description} · {option.impact}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className={`text-xl font-display font-black ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-100'
                                            }`}>
                                            {currentOdds}x
                                        </div>
                                        <div className={`flex items-center gap-1 text-[10px] ${isSelected ? 'text-white/70' : 'text-slate-400'
                                            }`}>
                                            <Users size={10} />
                                            <span>{poolPercent}% 押注</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Dynamic Odds Indicator */}
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
                <Zap size={16} className="text-amber-500" />
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                    赔率动态变化 · 押注人数越少，赔率越高
                </p>
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">
                    投注金额
                </label>
                <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 font-display font-bold text-xl">$</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-brand-dark border-2 border-slate-200 dark:border-slate-800/50 rounded-2xl py-5 pl-12 pr-6 text-2xl font-display font-bold focus:outline-none focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all duration-300"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                        {[50, 100, 500].map(val => (
                            <button
                                key={val}
                                onClick={() => setAmount(val)}
                                className="px-2 py-1 text-[10px] font-black bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md hover:bg-brand-primary hover:text-white transition-all"
                            >
                                ${val}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between items-center px-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">最低: $10</span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">可用余额: $12,450.00</span>
                </div>
            </div>

            {/* Summary Card */}
            {selectedBet && (
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">预期收益</span>
                        <div className="flex items-end gap-1">
                            <span className="text-lg font-display font-black text-financial-up">+${potentialPayout}</span>
                            <span className="text-[10px] font-bold text-slate-400 mb-1">({odds[selectedBet]}x)</span>
                        </div>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500 uppercase tracking-wider">平台手续费</span>
                        <span className="font-black text-slate-800 dark:text-slate-200">2.5%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-500 uppercase tracking-wider">结算时间</span>
                        <span className="font-black text-slate-800 dark:text-slate-200">数据发布后5分钟</span>
                    </div>
                </div>
            )}

            {/* CTA Button */}
            <button
                disabled={!selectedBet}
                className={`w-full py-5 rounded-2xl text-lg font-display font-bold text-white shadow-xl transition-all duration-300 transform active:scale-[0.98] ${!selectedBet
                        ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed shadow-none'
                        : selectedBet === 'below'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20 hover:shadow-emerald-500/40'
                            : selectedBet === 'meets'
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-amber-500/20 hover:shadow-amber-500/40'
                                : 'bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/20 hover:shadow-rose-500/40'
                    }`}
            >
                {selectedBet
                    ? `确认下注 · ${betOptions.find(o => o.id === selectedBet)?.label}`
                    : '请选择预测方向'}
            </button>

            <div className="flex items-start gap-3 p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                <ShieldCheck size={18} className="text-brand-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    预测结算基于美国劳工统计局官方数据。赔率实时更新，以下注确认时的赔率为准。
                </p>
            </div>
        </div>
    )
}

export default BettingPanel
