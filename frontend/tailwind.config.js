/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#3b82f6', // Bright Blue
                    secondary: '#6366f1', // Indigo
                    dark: '#0f172a', // Slate 900
                    light: '#f8fafc', // Slate 50
                    surface: '#1e293b', // Slate 800
                },
                financial: {
                    up: '#10b981', // Emerald 500
                    down: '#ef4444', // Red 500
                    neutral: '#94a3b8', // Slate 400
                    accent: '#8b5cf6', // Violet 500
                }
            },
            boxShadow: {
                'glass-sm': '0 2px 10px 0 rgba(31, 38, 135, 0.07)',
                'glass-md': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
