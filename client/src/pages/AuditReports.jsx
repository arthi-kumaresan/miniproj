import { motion } from 'framer-motion';
import {
    BarChart3,
    PieChart as PieChartIcon,
    ArrowDownToLine,
    ShieldCheck,
    History,
    Search,
    Loader2
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { useState, useEffect } from 'react';
import GlassCard from '../components/common/GlassCard';
import api from '../api';

const AuditReports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/audit/stats');
                setStats(data);
            } catch (error) {
                console.error('Audit stats fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Compliance Analytics</h2>
                    <p className="text-slate-500">Comprehensive audit trail and performance metrics</p>
                </div>
                <button className="premium-btn flex items-center space-x-2">
                    <ArrowDownToLine className="w-5 h-5" />
                    <span>Export Audit Report</span>
                </button>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Status Distribution */}
                        <GlassCard className="min-h-[400px]">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="p-2 rounded-xl bg-primary-500/10 text-primary-500">
                                    <PieChartIcon className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Status Distribution</h3>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={stats?.statusData || []}
                                            innerRadius={80}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {(stats?.statusData || []).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center space-x-6 mt-4">
                                {(stats?.statusData || []).map((s, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                                        <span className="text-xs font-semibold text-slate-500">{s.name} ({s.value})</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Dept Distribution */}
                        <GlassCard className="min-h-[400px]">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                                    <BarChart3 className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Departmental Compliance</h3>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats?.deptData || []}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E133" />
                                        <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                                        <Tooltip
                                            cursor={{ fill: '#CBD5E111' }}
                                            contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', color: '#fff' }}
                                        />
                                        <Bar dataKey="docs" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Audit Trail */}
                    <GlassCard className="!p-0 overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
                                    <History className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Audit Trail</h3>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 dark:bg-slate-900/30">
                                    <tr>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Target</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {(stats?.auditLogs || []).map((log, idx) => (
                                        <tr key={log._id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                                            <td className="px-8 py-4 text-sm font-bold text-primary-500">{log.action}</td>
                                            <td className="px-8 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                                                        {log.userName?.charAt(0) || 'U'}
                                                    </div>
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">{log.userName}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{log.target}</td>
                                            <td className="px-8 py-4 text-sm text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                                            <td className="px-8 py-4">
                                                <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-800 line-clamp-1">
                                                    {log.details || 'System log entry'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </>
            )}
        </div>
    );
};

export default AuditReports;
