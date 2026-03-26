import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    Calendar,
    Search,
    Download,
    Mail,
    Loader2,
    CheckCircle2,
    FileText
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import GlassCard from '../components/common/GlassCard';
import api from '../api';
import { toast } from 'react-toastify';

const SeverityBadge = ({ severity }) => {
    const configs = {
        critical: { label: 'CRITICAL', style: 'bg-red-500 text-white shadow-red-500/20' },
        warning: { label: 'WARNING', style: 'bg-amber-500 text-white shadow-amber-500/20' },
        info: { label: 'NOTICE', style: 'bg-blue-500 text-white shadow-blue-500/20' },
        expired: { label: 'EXPIRED', style: 'bg-slate-800 text-white shadow-slate-950/20' }
    };

    const config = configs[severity] || configs.info;

    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter shadow-sm ${config.style}`}>
            {config.label}
        </span>
    );
};

const ExpiringDocuments = () => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchExpiring = async () => {
            try {
                const { data } = await api.get('/documents/expiring');
                setDocs(data);
            } catch (error) {
                toast.error('Failed to fetch expiring documents');
            } finally {
                setLoading(false);
            }
        };
        fetchExpiring();
    }, []);

    const filteredDocs = useMemo(() => {
        return docs.filter(doc =>
            doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.complianceType?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [docs, searchQuery]);

    const handleSendAlert = (docName) => {
        toast.success(`Alert sent successfully for ${docName}`);
    };

    const handleDownload = (docName) => {
        toast.info(`Downloading ${docName}...`);
        // Simulate download
        setTimeout(() => {
            toast.success('Download complete!');
        }, 1500);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Expiry Monitoring</h2>
                    <p className="text-slate-500">Track and manage upcoming document expirations</p>
                </div>

                {/* Search Bar */}
                <div className="relative group w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search expiring documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto" />
                    </div>
                ) : (
                    filteredDocs.length > 0 ? (
                        filteredDocs.map((doc, idx) => (
                            <motion.div
                                key={doc._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <GlassCard className={`relative overflow-hidden group border-l-4 ${doc.severity === 'critical' ? 'border-l-red-500' : doc.severity === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500'} hover:shadow-2xl transition-all duration-300`}>
                                    <div className="absolute top-4 right-4">
                                        <SeverityBadge severity={doc.severity} />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800/50 inline-block">
                                            <FileText className={`w-6 h-6 ${doc.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-1">
                                                {doc.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{doc.department} • {doc.complianceType}</p>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                    {doc.severity === 'expired' ? 'Expired' : 'Expires'}: {new Date(doc.expiryDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span className={`text-xs font-black ${doc.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`}>
                                                {doc.severity === 'expired' ? 'EXPIRED' : `${doc.daysLeft}d Left`}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-2 pt-2">
                                            <button
                                                onClick={() => handleSendAlert(doc.name)}
                                                className="flex-1 py-2 px-4 rounded-lg bg-primary-500 text-white text-xs font-bold hover:bg-primary-600 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/25 active:scale-95 transition-all"
                                            >
                                                <Mail className="w-3 h-3" />
                                                <span>Send Alert</span>
                                            </button>
                                            <button
                                                onClick={() => handleDownload(doc.name)}
                                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary-500 hover:border-primary-500/50 transition-all active:scale-95 transition-all"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-slate-100 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Results Found</h3>
                            <p className="text-slate-500">Try adjusting your search query or filters.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ExpiringDocuments;
