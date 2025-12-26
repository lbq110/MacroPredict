import React from 'react'
import { RouteObject } from 'react-router-dom'
import HomePage from '../pages/Home/HomePage'
import AssetDetailPage from '../pages/AssetDetail/AssetDetailPage'
import CalendarPage from '../pages/Calendar/CalendarPage'
import PortfolioPage from '../pages/Portfolio/PortfolioPage'
import RankingsPage from '../pages/Rankings/RankingsPage'
import ProfilePage from '../pages/Profile/ProfilePage'
import TwitterCallback from '../pages/Auth/TwitterCallback'
import Layout from '../components/Layout/Layout'

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'asset/:id',
                element: <AssetDetailPage />,
            },
            {
                path: 'portfolio',
                element: <PortfolioPage />,
            },
            {
                path: 'calendar',
                element: <CalendarPage />,
            },
            {
                path: 'rankings',
                element: <RankingsPage />,
            },
            {
                path: 'profile',
                element: <ProfilePage />,
            },
            {
                path: 'auth/twitter/callback',
                element: <TwitterCallback />,
            },
        ],
    },
]
