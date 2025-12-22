import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Info } from 'lucide-react'

const ScenarioStatsTable = ({ data }) => {
    const [expandedRow, setExpandedRow] = useState(null)

    // Data should be an array of objects representing the scenarios from Image 0
    // Example: [{ comparison: 'Actual < Forecast', count: 28, upCount: 9, upProb: 32.14, downCount: 19, downProb: 67.86, avgVolatility: 0.1766 }]

    const rows = data || [
        { comparison: 'Actual < Forecast', count: 28, upCount: 9, upProb: 32.14, downCount: 19, downProb: 67.86, avgVolatility: 0.1766 },
        { comparison: 'Actual = Forecast', count: 23, upCount: 10, upProb: 43.48, downCount: 13, downProb: 56.52, avgVolatility: 0.1542 },
        { comparison: 'Actual > Forecast', count: 33, upCount: 18, upProb: 54.55, downCount: 15, downProb: 45.45, avgVolatility: 0.1571 },
    ]

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800">
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Comparison</th>
                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Frequency</th>
                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Up Count</th>
                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Up Prob.</th>
                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Down Count</th>
                            <th className="px-4 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Down Prob.</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">30m Avg Vol</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {rows.map((row, idx) => (
                            <React.Fragment key={idx}>
                                <tr
                                    className={`group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all ${expandedRow === idx ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}
                                    onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-6 rounded-full bg-brand-primary/20 group-hover:bg-brand-primary transition-colors" />
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{row.comparison}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5 text-center font-display font-black text-slate-600 dark:text-slate-400">{row.count}</td>
                                    <td className="px-4 py-5 text-center font-bold text-slate-600 dark:text-slate-400">{row.upCount}</td>
                                    <td className="px-4 py-5 text-center">
                                        <span className="text-sm font-black text-financial-up">{row.upProb}%</span>
                                    </td>
                                    <td className="px-4 py-5 text-center font-bold text-slate-600 dark:text-slate-400">{row.downCount}</td>
                                    <td className="px-4 py-5 text-center">
                                        <span className="text-sm font-black text-financial-down">{row.downProb}%</span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-3 font-display font-black text-financial-down">
                                            <span>{row.avgVolatility}%</span>
                                            {expandedRow === idx ? <ChevronUp size={16} className="text-slate-300" /> : <ChevronDown size={16} className="text-slate-300" />}
                                        </div>
                                    </td>
                                </tr>
                                {expandedRow === idx && (
                                    <tr className="bg-slate-50/30 dark:bg-slate-900/20">
                                        <td colSpan={7} className="px-8 py-6">
                                            <div className="flex items-start gap-4 animate-in slide-in-from-top-2 duration-300">
                                                <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                    <Info size={16} className="text-brand-primary" />
                                                </div>
                                                <div className="space-y-4 flex-1">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                                                        During this scenario, the asset showed a high correlation with the prediction miss.
                                                        On average, the market reached its peak volatility 12 minutes after the release.
                                                    </p>
                                                    <div className="grid grid-cols-3 gap-6">
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Deviation</p>
                                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">0.42%</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
                                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">68%</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Drift Factor</p>
                                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">+0.05</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ScenarioStatsTable
