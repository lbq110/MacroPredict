import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            walletBalance: 12450.00,

            login: (userData, token) => set({
                user: userData,
                token,
                isAuthenticated: true
            }),

            logout: () => set({
                user: null,
                token: null,
                isAuthenticated: false
            }),

            updateBalance: (amount) => set((state) => ({
                walletBalance: state.walletBalance + amount
            })),
        }),
        {
            name: 'macropredict-auth',
        }
    )
)

export const useMarketStore = create((set) => ({
    prices: {}, // { 'btc-usd': 64230.50, ... }
    activeEvents: [],

    updatePrice: (symbol, price) => set((state) => ({
        prices: { ...state.prices, [symbol]: price }
    })),

    setEvents: (events) => set({ activeEvents: events }),
}))
