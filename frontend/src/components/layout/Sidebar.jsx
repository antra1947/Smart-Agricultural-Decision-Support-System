import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Store, Sprout, ShieldAlert, MessageCircle, Settings, CloudRain } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const { user } = useContext(AuthContext);

    const routes = [
        { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/advisory', name: 'Crop Advisory', icon: <CloudRain size={20} /> },
        { path: '/disease', name: 'Disease Detection', icon: <ShieldAlert size={20} /> },
        { path: '/chat', name: 'AI Chatbot', icon: <MessageCircle size={20} /> },
        { path: '/marketplace', name: 'Marketplace', icon: <Store size={20} /> },
        { path: '/farm', name: 'Farm Management', icon: <Sprout size={20} /> },
    ];

    if (user?.role === 'admin') {
        routes.push({ path: '/admin', name: 'Admin Panel', icon: <Settings size={20} /> });
    }

    return (
        <>
            {/* Sidebar backdrop (mobile only) */}
            <div
                className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                aria-hidden="true"
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <div
                id="sidebar"
                className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-72 lg:sidebar-expanded:!w-72 2xl:!w-72 shrink-0 bg-brand-900 text-white transition-all duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}
            >
                {/* Sidebar header */}
                <div className="flex justify-between md:justify-center pr-3 sm:px-2 py-6">
                    <div className="flex flex-col px-4">
                        <div className="flex items-center gap-2">
                            <Sprout size={32} className="text-brand-500" />
                            <span className="text-2xl font-bold text-white tracking-tight">SmartCrop</span>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-brand-300 font-medium mt-2 pl-1">Smart Farming ka Naya Tarika</span>
                    </div>
                </div>

                {/* Links */}
                <div className="space-y-8 mt-4">
                    <div>
                        <h3 className="text-xs uppercase text-slate-400 font-semibold pl-6 mb-3">Pages</h3>
                        <ul className="mt-3 space-y-1 px-4">
                            {routes.map(r => (
                                <li key={r.path} className="px-2 py-2 rounded-lg mb-0.5 last:mb-0 hover:bg-brand-700 transition">
                                    <NavLink
                                        end={r.path === '/'}
                                        to={r.path}
                                        className={({ isActive }) => 'block truncate ' + (isActive ? 'text-brand-100 font-medium' : 'text-slate-300')}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {r.icon}
                                            <span className="text-sm font-medium">{r.name}</span>
                                        </div>
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
