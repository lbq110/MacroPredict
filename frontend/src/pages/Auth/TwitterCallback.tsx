import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const TwitterCallback = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [error, setError] = useState('')

    useEffect(() => {
        const code = searchParams.get('code')
        const state = searchParams.get('state') // Not verifying state for now as we didn't send it, but good practice

        if (code) {
            handleLogin(code)
        } else {
            setError('No code provided in callback URL')
        }
    }, [searchParams])

    const handleLogin = async (code: string) => {
        try {
            // Use environment variable for API URL, fallback to localhost for development
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
            const redirectUri = window.location.origin + '/auth/twitter/callback';

            const response = await fetch(`${apiBaseUrl}/auth/login/twitter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code,
                    redirect_uri: redirectUri,
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.detail || 'Login failed')
            }

            const data = await response.json()
            // Store token and user info
            localStorage.setItem('token', data.token)
            localStorage.setItem('userId', data.userId)
            if (data.avatar) {
                localStorage.setItem('userAvatar', data.avatar)
            }
            if (data.username) {
                localStorage.setItem('username', data.username)
            }

            // Dispatch event to notify Header of login state change
            window.dispatchEvent(new Event('loginStateChanged'))

            // Redirect to home or dashboard
            navigate('/')

        } catch (err: any) {
            setError(err.message)
            console.error('Twitter login error:', err)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
            <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold mb-4">Verifying Twitter Login...</h2>
                {error ? (
                    <div className="text-red-500 mb-4">
                        <p>{error}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            Return Home
                        </button>
                    </div>
                ) : (
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500 dark:text-slate-400">Please wait while we log you in...</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TwitterCallback
