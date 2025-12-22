import React from 'react'
import { Wallet, ChevronDown, PlusCircle } from 'lucide-react'

const WalletWidget = ({ balance = 12450.00 }) => {
    return (
        <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Available Balance</span>
                <span className="text-sm font-display font-black text-slate-800 dark:text-slate-100">
                    ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>

            <button className="flex items-center gap-2 p-1.5 pr-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl hover:shadow-glass-sm transition-all group">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                    <Wallet size={18} />
                </div>
                <div className="flex items-center gap-1.5">
                    <PlusCircle size={14} className="text-slate-400 group-hover:text-brand-primary transition-colors" />
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Top Up</span>
                </div>
            </button>
        </div>
    )
}

export default WalletWidget
