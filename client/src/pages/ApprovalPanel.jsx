import { motion } from 'framer-motion';
import {
    CheckCircle2,
    XCircle,
    Clock,
    User,
    FileText,
    ExternalLink,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import GlassCard from '../components/common/GlassCard';
import api from '../api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ApprovalPanel = () => {
    const [pendingDocs, setPendingDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [comment, setComment] = useState({});
    const { user } = useAuth();

    const fetchPending = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/documents?status=Pending');
            setPendingDocs(data);
        } catch (error) {
            toast.error('Failed to fetch pending documents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleAction = async (id, action) => {
        setActionLoading(id);
        try {
            await api.put(`/documents/${id}/${action}`, {
                comments: comment[id] || `${action.charAt(0).toUpperCase() + action.slice(1)}ed by ${user?.name || 'Authorized User'}`
            });
            toast.success(`Document ${action}ed`);
            setPendingDocs(docs => docs.filter(d => d._id !== id));
        } catch (error) {
            toast.error(`Failed to ${action} document`);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Approval Queue</h2>
                    <p className="text-slate-500">Review and verify document submissions</p>
                </div>
                <div className="flex items-center space-x-2 bg-amber-500/10 text-amber-600 px-4 py-2 rounded-xl border border-amber-500/20">
                    <Clock className="w-5 h-5" />
                    <span className="font-bold">{pendingDocs.length} Pending</span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto" />
                        <p className="mt-4 text-slate-500">Loading pending requests...</p>
                    </div>
                ) : pendingDocs.length > 0 ? (
                    pendingDocs.map((doc, idx) => (
                        <motion.div
                            key={doc._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <GlassCard className="h-full flex flex-col group hover:border-primary-500/30 transition-all duration-300">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white">{doc.name}</h3>
                                            <p className="text-xs text-slate-500">{doc.department} • {doc.complianceType}</p>
                                        </div>
                                    </div>
                                    <a
                                        href={doc.filePath ? `${import.meta.env.VITE_API_URL}${doc.filePath}` : '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary-500 transition-all"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase mb-1">
                                            <User className="w-3 h-3" />
                                            <span>Uploaded By</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{doc.uploadedBy?.name || 'Unknown'}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase mb-1">
                                            <Clock className="w-3 h-3" />
                                            <span>Submitted</span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{new Date(doc.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex-1 mb-6">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Reviewer Remarks</h4>
                                    <textarea
                                        value={comment[doc._id] || ''}
                                        onChange={(e) => setComment({ ...comment, [doc._id]: e.target.value })}
                                        placeholder="Add approval or rejection remarks..."
                                        className="w-full h-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => handleAction(doc._id, 'reject')}
                                        disabled={actionLoading === doc._id}
                                        className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl border border-red-500/30 text-red-500 font-bold hover:bg-red-500/10 transition-all disabled:opacity-50"
                                    >
                                        {actionLoading === doc._id ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                <XCircle className="w-5 h-5" />
                                                <span>Reject</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleAction(doc._id, 'approve')}
                                        disabled={actionLoading === doc._id}
                                        className="flex-1 flex items-center justify-center space-x-2 p-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                                    >
                                        {actionLoading === doc._id ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span>Approve</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-emerald-500/5 rounded-3xl border border-emerald-500/10 border-dashed">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">All Caught Up!</h3>
                        <p className="text-slate-500">There are no pending documents in the queue.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApprovalPanel;
