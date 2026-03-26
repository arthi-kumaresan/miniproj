import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, User as UserIcon, Settings, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../common/GlassCard';

const pageTitles = {
    '/dashboard': { title: 'Dashboard', subtitle: 'Compliance Analytics Overview' },
    '/documents': { title: 'Documents', subtitle: 'Manage compliance documents' },
    '/approvals': { title: 'Approvals', subtitle: 'Review pending submissions' },
    '/expiring': { title: 'Expiry Alerts', subtitle: 'Monitor expiring documents' },
    '/reports': { title: 'Audit & Reports', subtitle: 'Compliance analytics & audit trail' },
    '/users': { title: 'User Management', subtitle: 'Manage users and roles' },
    '/profile': { title: 'My Profile', subtitle: 'Manage your personal information' },
    '/settings': { title: 'Settings', subtitle: 'Manage your application preferences' },
};

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const page = pageTitles[location.pathname] || { title: 'Dashboard', subtitle: '' };

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Background Decorative Gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-purple/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none"></div>

                {/* Top Bar */}
                <header className="h-16 flex items-center justify-between px-8 z-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{page.title}</h2>
                        <p className="text-xs text-slate-500">{page.subtitle}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="hidden md:flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 border border-transparent focus-within:border-primary-500/50 transition-all">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input
                                placeholder="Quick search..."
                                className="bg-transparent text-sm focus:outline-none w-36 text-slate-700 dark:text-slate-300 placeholder-slate-400"
                            />
                        </div>

                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2 rounded-xl transition-colors ${showNotifications ? 'bg-primary-500/10 text-primary-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">5</span>
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Notifications</h4>
                                        <button className="text-xs text-primary-500 font-semibold hover:underline">Mark all read</button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0">
                                                <div className="flex space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                                                        <Bell className="w-4 h-4 text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">Document "Annual Tax Return" is expiring in 5 days.</p>
                                                        <p className="text-[10px] text-slate-500 mt-1">2 hours ago</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-3 text-xs font-bold text-slate-500 hover:text-primary-500 border-t border-slate-100 dark:border-slate-800 transition-colors">
                                        View All Notifications
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Profile Avatar */}
                        <div className="relative" ref={profileRef}>
                            <div
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-3 cursor-pointer group"
                            >
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple text-white flex items-center justify-center font-semibold text-sm group-hover:ring-2 group-hover:ring-primary-500/50 transition-all shadow-lg">
                                    {user?.name?.[0] || 'A'}
                                </div>
                                <div className="hidden lg:block text-left">
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">{user?.name || 'User'}</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{user?.role || 'Guest'}</p>
                                </div>
                                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                            </div>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <UserIcon className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{user?.name}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-[120px]">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={() => { navigate('/profile'); setShowProfileMenu(false); }}
                                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <UserIcon className="w-4 h-4" />
                                            <span>My Profile</span>
                                        </button>
                                        <button
                                            onClick={() => { navigate('/settings'); setShowProfileMenu(false); }}
                                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </button>
                                        <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 relative z-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
