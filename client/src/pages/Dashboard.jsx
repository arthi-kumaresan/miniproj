import { motion, AnimatePresence } from 'framer-motion';
import {
    FileBox,
    Clock,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    TrendingUp,
    ArrowUpRight,
    Loader2,
    RefreshCw,
    ExternalLink
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import api from '../api';

const StatCard = ({ title, value, icon: Icon, color, trend, loading }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const isTrendUp = trend?.startsWith('+');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <GlassCard className="relative group p-0 overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`stat-icon-container ${color}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        <AnimatePresence>
                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl py-1 z-10"
                                >
                                    <button className="w-full px-4 py-2 text-left text-xs text-slate-400 hover:bg-slate-800 flex items-center space-x-2">
                                        <RefreshCw className="w-3 h-3" />
                                        <span>Refresh</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
                    <div className="flex items-baseline justify-between">
                        {loading ? (
                            <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
                        ) : (
                            <>
                                <span className="text-3xl font-bold text-white">{value}</span>
                                <span className={`trend-badge ${!isTrendUp ? 'down' : ''}`}>
                                    {isTrendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                                    {trend}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-${color}-500/50 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        </GlassCard>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, auditRes] = await Promise.all([
                    api.get('/documents/stats'),
                    api.get('/audit/reports?limit=5')
                ]);
                setStats(statsRes.data);
                setActivity(auditRes.data);
            } catch (error) {
                console.error('Dashboard fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-8 pb-10">
            {/* Stat Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Documents" value={stats?.total || 0} icon={FileBox} color="blue" trend="+12%" loading={loading} />
                <StatCard title="Expiring Soon" value={stats?.expiring || 0} icon={Clock} color="orange" trend="+5%" loading={loading} />
                <StatCard title="Approved" value={stats?.approved || 0} icon={CheckCircle2} color="emerald" trend="+18%" loading={loading} />
                <StatCard title="Pending Review" value={stats?.pending || 0} icon={AlertCircle} color="purple" trend="-3%" loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <GlassCard className="lg:col-span-2 min-h-[400px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Compliance Overview</h3>
                            <p className="text-sm text-slate-500">Document upload trend over the last 6 months</p>
                        </div>
                        <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm px-4 py-2 focus:ring-2 focus:ring-primary-500">
                            <option>Last 6 Months</option>
                        </select>
                    </div>

                    <div className="h-[300px] w-full">
                        {loading ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.trendData || []}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E133" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                            border: 'none',
                                            borderRadius: '12px',
                                            color: '#fff'
                                        }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </GlassCard>

                {/* Side Activity */}
                <GlassCard className="flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                        <button
                            onClick={() => navigate('/reports')}
                            className="text-primary-500 text-sm font-semibold hover:underline flex items-center"
                        >
                            View all <ArrowUpRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="flex items-start space-x-4 animate-pulse">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                                        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))
                        ) : activity.length > 0 ? (
                            activity.map((log) => (
                                <div key={log._id} className="flex items-start space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                        <FileBox className="w-5 h-5 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {log.action}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Target: <span className="text-primary-500">{log.target}</span> • {new Date(log.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-center py-10">No recent activity</p>
                        )}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Dashboard;
