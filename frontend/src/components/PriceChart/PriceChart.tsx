import React, { useEffect, useRef } from 'react'
import { createChart, ColorType, CrosshairMode } from 'lightweight-charts'

const PriceChart = ({ data, colors = {} }) => {
    const chartContainerRef = useRef()
    const chartRef = useRef()

    const {
        backgroundColor = 'transparent',
        lineColor = '#3b82f6',
        textColor = '#64748b',
        areaTopColor = 'rgba(59, 130, 246, 0.4)',
        areaBottomColor = 'rgba(59, 130, 246, 0)',
    } = colors

    useEffect(() => {
        if (!chartContainerRef.current) return

        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth })
            }
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
                fontFamily: 'Inter, sans-serif',
            },
            grid: {
                vertLines: { color: 'rgba(148, 163, 184, 0.05)' },
                horzLines: { color: 'rgba(148, 163, 184, 0.05)' },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: {
                    width: 1,
                    color: 'rgba(148, 163, 184, 0.4)',
                    style: 2,
                },
                horzLine: {
                    width: 1,
                    color: 'rgba(148, 163, 184, 0.4)',
                    style: 2,
                },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            timeScale: {
                borderVisible: false,
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderVisible: false,
                scaleMargins: {
                    top: 0.3,
                    bottom: 0.25,
                },
            },
            handleScroll: {
                vertTouchDrag: false,
            },
        })

        const series = chart.addAreaSeries({
            lineColor,
            topColor: areaTopColor,
            bottomColor: areaBottomColor,
            lineWidth: 2,
            priceFormat: {
                type: 'price',
                precision: 2,
                minMove: 0.01,
            },
        })

        series.setData(data)
        chart.timeScale().fitContent()

        chartRef.current = chart

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            chart.remove()
        }
    }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor])

    return <div ref={chartContainerRef} className="w-full h-full min-h-[400px]" />
}

export default PriceChart
