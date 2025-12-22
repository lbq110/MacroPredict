import { useEffect, useRef, useCallback } from 'react'
import { useMarketStore } from '../store'

const useWebSocket = (url) => {
    const socketRef = useRef(null)
    const updatePrice = useMarketStore((state) => state.updatePrice)

    const connect = useCallback(() => {
        if (!url) return

        socketRef.current = new WebSocket(url)

        socketRef.current.onopen = () => {
            console.log('WebSocket Connected')
        }

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data)

            // Expected payload: { type: 'PRICE_UPDATE', symbol: 'btc-usd', price: 64230.50 }
            if (data.type === 'PRICE_UPDATE') {
                updatePrice(data.symbol, data.price)
            }

            // Other event types like 'EVENT_TRIGGERED' or 'BET_SETTLED'
        }

        socketRef.current.onerror = (error) => {
            console.error('WebSocket Error:', error)
        }

        socketRef.current.onclose = () => {
            console.log('WebSocket Disconnected. Reconnecting...')
            setTimeout(connect, 3000) // Simple reconnection logic
        }
    }, [url, updatePrice])

    useEffect(() => {
        connect()
        return () => {
            if (socketRef.current) {
                socketRef.current.close()
            }
        }
    }, [connect])

    const sendMessage = (message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message))
        }
    }

    return { sendMessage }
}

export default useWebSocket
