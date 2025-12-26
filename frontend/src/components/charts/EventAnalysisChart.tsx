import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    LineController,
    BarController,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Download, Info } from 'lucide-react'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    PointElement,
    LineElement,
    LineController,
    Title,
    Tooltip,
    Legend
)

interface EventAnalysisChartProps {
    data?: {
        labels: string[];
        datasets: any[];
    };
}

const EventAnalysisChart: React.FC<EventAnalysisChartProps> = ({ data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#64748b',
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 11,
                        weight: 'bold',
                        family: 'Inter',
                    },
                },
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleFont: { size: 12, weight: 'bold' },
                bodyFont: { size: 12 },
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { size: 10, weight: 'bold' } },
            },
            y: {
                grid: { color: 'rgba(226, 232, 240, 0.05)' },
                ticks: {
                    color: '#64748b',
                    font: { size: 10 },
                    callback: (value) => value + '%'
                },
            },
        },
    }

    const chartData = data || {
        labels: ['2024-12', '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-11'],
        datasets: [
            {
                type: 'bar',
                label: 'Actual',
                data: [3.2, 3.3, 3.1, 2.8, 2.8, 2.9, 2.9, 3.1, 3.1, 3.0, 3.0],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 4,
                barThickness: 32,
            },
            {
                type: 'line',
                label: 'Forecast',
                data: [3.3, 3.1, 3.2, 3.0, 2.8, 2.9, 2.9, 3.0, 3.1, 3.1, 3.0],
                borderColor: '#f97316',
                backgroundColor: '#f97316',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                tension: 0, // Straight lines as in Image 1
            },
        ],
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-100">Historical Trend</h3>
                    <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400">
                        <Info size={14} />
                    </div>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all">
                    <Download size={14} />
                    Export Image
                </button>
            </div>

            <div className="h-[350px] w-full">
                <Bar options={options} data={chartData} />
            </div>
        </div>
    )
}

export default EventAnalysisChart
