import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Clock, ChevronRight, Activity } from 'lucide-react'

const AssetCard = ({ asset }) => {
    const isUp = asset.change >= 0

    return (
        <Link
            to={`/asset/${asset.asset_id || asset.id}`}
            className="card-premium group p-6 flex flex-col relative overflow-hidden"
        >
            {/* Hover Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/0 via-brand-primary/5 to-brand-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700/50 group-hover:bg-brand-primary transition-all duration-300">
                        <Activity className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-white" />
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-brand-primary transition-colors">{asset.symbol}</h3>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">{asset.name}</p>
                    </div>
                </div>

                <div className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg ${isUp
                    ? 'bg-financial-up/10 text-financial-up border border-financial-up/20'
                    : 'bg-financial-down/10 text-financial-down border border-financial-down/20'
                    }`}>
                    {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {isUp ? '+' : ''}{asset.change}%
                </div>
            </div>

            <div className="mb-8 relative z-10">
                <div className="flex flex-col">
                    <span className="text-3xl font-display font-bold tracking-tight text-slate-800 dark:text-slate-100">
                        ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Live Market Price</span>
                </div>
            </div>

            <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/80 relative z-10">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-2">
                    <Clock size={12} />
                    <span className="text-[9px] uppercase font-black tracking-[0.2em]">Next Settlement</span>
                </div>

                <div className="flex justify-between items-center group/btn">
                    <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[140px]">{asset.nextEvent}</p>
                        <p className="text-xs font-semibold text-brand-primary mt-0.5">Expires in {asset.eventTime}</p>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-lg group-hover:bg-brand-primary group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                        <ChevronRight size={18} />
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default AssetCard
