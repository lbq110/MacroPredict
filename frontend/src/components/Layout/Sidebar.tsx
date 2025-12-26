import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutGrid, Calendar, History, TrendingUp, Settings, X } from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <aside className={`
            fixed inset-y-0 left-0 z-[60] w-72 bg-white dark:bg-brand-dark border-r border-slate-200 dark:border-white/5 
            transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="h-20 flex items-center justify-between px-8 border-b border-slate-200/50 dark:border-white/5">
                <span className="font-display font-black text-slate-800 dark:text-slate-100 tracking-tight text-xl">Main Menu</span>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                <NavLink
                    to="/"
                    onClick={() => onClose?.()}
                    className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                    <LayoutGrid size={22} />
                    <span className="font-display font-bold text-sm tracking-wide">Markets</span>
                </NavLink>
                <NavLink
                    to="/portfolio"
                    onClick={() => onClose?.()}
                    className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                    <History size={22} />
                    <span className="font-display font-bold text-sm tracking-wide">Portfolio</span>
                </NavLink>
                <NavLink
                    to="/calendar"
                    onClick={() => onClose?.()}
                    className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                    <Calendar size={22} />
                    <span className="font-display font-bold text-sm tracking-wide">Calendar</span>
                </NavLink>
                <NavLink
                    to="/rankings"
                    onClick={() => onClose?.()}
                    className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                    <TrendingUp size={22} />
                    <span className="font-display font-bold text-sm tracking-wide">Rankings</span>
                </NavLink>
                <NavLink
                    to="/profile"
                    onClick={() => onClose?.()}
                    className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'}`}
                >
                    <Settings size={22} />
                    <span className="font-display font-bold text-sm tracking-wide">Profile</span>
                </NavLink>
            </nav>

            <div className="p-6 border-t border-slate-200/50 dark:border-white/5">
                <button
                    onClick={() => alert('Settings coming soon in MVP v1.1')}
                    className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-300 font-bold text-sm"
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
