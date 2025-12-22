import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const EventAnalysisChart = ({ data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#94a3b8',
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#1e293b',
                titleColor: '#f8fafc',
                bodyColor: '#f8fafc',
                padding: 12,
                cornerRadius: 8,
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                },
            },
            y: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                },
                ticks: {
                    color: '#94a3b8',
                },
            },
        },
    }

    const chartData = {
        labels: data.map(d => d.date),
        datasets: [
            {
                label: 'Actual',
                data: data.map(d => d.actual),
                backgroundColor: '#3b82f6',
                borderRadius: 4,
            },
            {
                label: 'Forecast',
                data: data.map(d => d.forecast),
                backgroundColor: 'rgba(148, 163, 184, 0.5)',
                borderRadius: 4,
            },
        ],
    }

    return (
        <div className="h-[300px]">
            <Bar options={options} data={chartData} />
        </div>
    )
}

export default EventAnalysisChart
