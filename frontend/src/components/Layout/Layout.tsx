import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-brand-light dark:bg-brand-dark transition-colors duration-500 overflow-x-hidden">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1">
                    <div className="p-4 md:p-8 lg:p-10 mx-auto max-w-[1600px] w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout
