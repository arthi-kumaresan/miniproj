import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    ShieldCheck,
    Clock,
    BarChart3,
    Users,
    Settings,
    LogOut,
    ChevronDown,
    AlertTriangle,
    Moon,
    Sun
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['Admin', 'Staff', 'Auditor', 'Viewer'] },
        { name: 'Documents', icon: FileText, path: '/documents', roles: ['Admin', 'Staff', 'Auditor', 'Viewer'] },
        { name: 'Approvals', icon: ShieldCheck, path: '/approvals', roles: ['Admin', 'Auditor'] },
        { name: 'Expiring Soon', icon: Clock, path: '/expiring', roles: ['Admin', 'Staff', 'Auditor'] },
        { name: 'Audit Reports', icon: BarChart3, path: '/reports', roles: ['Admin', 'Auditor'] },
        { name: 'User Management', icon: Users, path: '/users', roles: ['Admin'] },
    ].filter(item => !item.roles || (user && item.roles.includes(user.role)));

    return (
        <div className="w-64 h-screen bg-slate-900 text-white flex flex-col p-4 shadow-2xl relative overflow-hidden shrink-0">
            {/* Background Gradient Detail */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/20 blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-purple/20 blur-3xl -ml-12 -mb-12"></div>

            {/* Logo */}
            <div className="flex items-center space-x-3 mb-10 px-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-purple-500/30">
                    C
                </div>
                <span className="text-xl font-bold tracking-tight">Compliance<span className="text-primary-500">Vault</span></span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`sidebar-item ${isActive ? 'active' : ''}`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.name}</span>
                            {item.name === 'Expiring Soon' && (
                                <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Controls */}
            <div className="mt-auto space-y-3 pt-6 border-t border-slate-800">
                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="w-full sidebar-item justify-between text-sm"
                >
                    <div className="flex items-center space-x-3">
                        {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                        <span className="text-slate-400">{darkMode ? 'Light' : 'Dark'} Mode</span>
                    </div>
                    <div className={`w-9 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-primary-500' : 'bg-slate-700'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${darkMode ? 'right-0.5' : 'left-0.5'}`}></div>
                    </div>
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full sidebar-item text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
