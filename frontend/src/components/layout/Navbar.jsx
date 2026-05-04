import React, { useContext } from 'react';
import { Menu, Bell, LogOut, LogIn } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Navbar = ({ setSidebarOpen, setAuthModalOpen }) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="sticky top-0 bg-white border-b border-slate-200 z-30 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 -mb-px">

                    {/* Header: Left side */}
                    <div className="flex">
                        <button
                            className="text-slate-500 hover:text-slate-600 lg:hidden"
                            aria-controls="sidebar"
                            onClick={(e) => { e.stopPropagation(); setSidebarOpen(true); }}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* Header: Right side */}
                    <div className="flex items-center space-x-3">
                        <button className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full transition duration-150 relative">
                            <span className="sr-only">Notifications</span>
                            <Bell size={18} className="text-slate-500" />
                            {user && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></div>}
                        </button>
                        
                        <div className="w-px h-6 bg-slate-200 mx-2"></div>

                        {user ? (
                            <div className="flex items-center gap-2 group cursor-pointer relative" onClick={logout}>
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold sidebar-expanded:opacity-100 transition duration-150">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden sm:block text-sm font-medium text-slate-700">
                                    {user?.name}
                                </div>
                                <LogOut size={16} className="text-slate-400 hover:text-brand-500 transition ml-2" title="Logout" />
                            </div>
                        ) : (
                            <button 
                                onClick={() => setAuthModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition"
                            >
                                <LogIn size={16} />
                                <span>Sign In</span>
                            </button>
                        )}

                    </div>

                </div>
            </div>
        </header>
    );
};

export default Navbar;
