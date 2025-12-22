import React, { useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Info, ShieldCheck } from 'lucide-react'

const BettingPanel = ({ asset }) => {
    const [betType, setBetType] = useState('UP') // UP or DOWN
    const [amount, setAmount] = useState(100)

    const estimatedPayout = amount * 0.85

    return (
        <div className="space-y-8">
            {/* Bet Type Selector */}
            <div className="flex gap-3 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[1.25rem] border border-slate-200 dark:border-slate-800/50">
                <button
                    onClick={() => setBetType('UP')}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-display font-bold transition-all duration-300 ${betType === 'UP'
                        ? 'bg-financial-up text-white shadow-lg shadow-financial-up/25 scale-[1.02]'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                        }`}
                >
                    <ArrowUpRight size={22} />
                    <span>OVER</span>
                </button>
                <button
                    onClick={() => setBetType('DOWN')}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-display font-bold transition-all duration-300 ${betType === 'DOWN'
                        ? 'bg-financial-down text-white shadow-lg shadow-financial-down/25 scale-[1.02]'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                        }`}
                >
                    <ArrowDownRight size={22} />
                    <span>UNDER</span>
                </button>
            </div>

            {/* Input Section */}
            <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-1">Investment Amount</label>
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
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Min: $10</span>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Available: $12,450.00</span>
                </div>
            </div>

            {/* Summary Card */}
            <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Potential Gain</span>
                    <div className="flex items-end gap-1">
                        <span className="text-lg font-display font-black text-financial-up">+${estimatedPayout.toFixed(2)}</span>
                        <span className="text-[10px] font-bold text-slate-400 mb-1">(1.85x)</span>
                    </div>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Platform Fee</span>
                    <span className="font-black text-slate-800 dark:text-slate-200">2.5%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-500 uppercase tracking-wider">Lock Duration</span>
                    <span className="font-black text-slate-800 dark:text-slate-200">~2.4 Hours</span>
                </div>
            </div>

            {/* CTA Button */}
            <button className={`w-full py-5 rounded-2xl text-lg font-display font-bold text-white shadow-xl transition-all duration-300 transform active:scale-[0.98] ${betType === 'UP'
                    ? 'bg-financial-up shadow-financial-up/20 hover:shadow-financial-up/40'
                    : 'bg-financial-down shadow-financial-down/20 hover:shadow-financial-down/40'
                }`}>
                Confirm {betType === 'UP' ? 'OVER' : 'UNDER'} Prediction
            </button>

            <div className="flex items-start gap-3 p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                <ShieldCheck size={18} className="text-brand-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Your predictions are secured by a decentralized oracle network. Settlements are final and based on official US Bureau of Labor Statistics data.
                </p>
            </div>
        </div>
    )
}

export default BettingPanel
