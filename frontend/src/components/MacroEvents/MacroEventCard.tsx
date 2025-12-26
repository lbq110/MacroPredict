import React, { useState } from 'react'
import { Calendar, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Clock, Info } from 'lucide-react'

interface MacroEventStats {
    count: number;
    avgChange: number;
    upProb: number;
    downProb: number;
}

interface MacroEvent {
    id: string;
    name: string;
    nameCn: string;
    description: string;
    nextRelease: string;
    stats: {
        aboveExpectation: MacroEventStats;
        meetsExpectation: MacroEventStats;
        belowExpectation: MacroEventStats;
    };
}

interface MacroEventCardProps {
    event: MacroEvent;
    assetName: string;
}

const MacroEventCard: React.FC<MacroEventCardProps> = ({ event, assetName }) => {
    const [isExpanded, setIsExpanded] = useState(true)

    const scenarios = [
        {
            label: '高于预期',
            labelEn: 'Above Expectation',
            data: event.stats.aboveExpectation,
            color: 'text-financial-up',
            bgColor: 'bg-financial-up/10'
        },
        {
            label: '符合预期',
            labelEn: 'Meets Expectation',
            data: event.stats.meetsExpectation,
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10'
        },
        {
            label: '低于预期',
            labelEn: 'Below Expectation',
            data: event.stats.belowExpectation,
            color: 'text-financial-down',
            bgColor: 'bg-financial-down/10'
        },
    ]

    return (
        <div className="card-premium overflow-hidden">
            {/* Header */}
            <div
                className="p-6 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                            <Calendar size={22} className="text-brand-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100">
                                {event.name}
                            </h3>
                            <p className="text-sm text-slate-500 mt-0.5">{event.nameCn}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <Clock size={14} className="text-slate-400" />
                                <span className="text-xs font-bold text-slate-500">
                                    下次发布: {event.nextRelease}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        {isExpanded ? (
                            <ChevronUp size={20} className="text-slate-400" />
                        ) : (
                            <ChevronDown size={20} className="text-slate-400" />
                        )}
                    </button>
                </div>
            </div>

            {/* Stats Table */}
            {isExpanded && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 mb-4">
                            <Info size={14} className="text-brand-primary" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                {assetName} 数据发布后涨跌统计
                            </span>
                        </div>

                        {/* Table Header */}
                        <div className="grid grid-cols-5 gap-2 mb-3 px-3">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">数据结果</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">次数</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">平均涨跌</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">上涨概率</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">下跌概率</div>
                        </div>

                        {/* Table Rows */}
                        <div className="space-y-2">
                            {scenarios.map((scenario) => (
                                <div
                                    key={scenario.label}
                                    className={`grid grid-cols-5 gap-2 py-3 px-3 rounded-xl ${scenario.bgColor} items-center`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold text-sm ${scenario.color}`}>
                                            {scenario.label}
                                        </span>
                                    </div>
                                    <div className="text-center font-display font-bold text-slate-700 dark:text-slate-200">
                                        {scenario.data.count}
                                    </div>
                                    <div className="text-center">
                                        <span className={`font-bold text-sm ${scenario.data.avgChange >= 0 ? 'text-financial-up' : 'text-financial-down'}`}>
                                            {scenario.data.avgChange >= 0 ? '+' : ''}{scenario.data.avgChange.toFixed(2)}%
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <TrendingUp size={12} className="text-financial-up" />
                                            <span className="font-bold text-sm text-financial-up">{scenario.data.upProb}%</span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <TrendingDown size={12} className="text-financial-down" />
                                            <span className="font-bold text-sm text-financial-down">{scenario.data.downProb}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MacroEventCard
