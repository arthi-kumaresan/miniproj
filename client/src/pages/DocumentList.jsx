import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    Plus,
    Download,
    Eye,
    Edit3,
    Trash2,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import GlassCard from '../components/common/GlassCard';
import UploadModal from '../components/documents/UploadModal';
import API from '../api';
import { toast } from 'react-toastify';

const StatusBadge = ({ status }) => {
    const styles = {
        Approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        Rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.Pending}`}>
            {status}
        </span>
    );
};

const DocumentList = () => {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDocuments = async (search = '') => {
        setLoading(true);
        try {
            const { data } = await API.get(`/documents${search ? `?search=${search}` : ''}`);
            setDocuments(data);
        } catch (error) {
            toast.error('Failed to fetch documents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDocuments(searchTerm);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;
        try {
            await API.delete(`/documents/${id}`);
            toast.success('Document deleted');
            setDocuments(docs => docs.filter(d => d._id !== id));
        } catch (error) {
            toast.error('Failed to delete document');
        }
    };

    const handleDownload = async (id, name) => {
        try {
            const response = await API.get(`/documents/${id}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to download document');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <form onSubmit={handleSearch} className="relative group flex-1 max-w-md">
                    <Search className="absolute left-4 top-3 w-5 h-5 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search documents, IDs, or departments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                    />
                </form>

                <div className="flex items-center space-x-3">
                    <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm">
                        <Filter className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsUploadOpen(true)}
                        className="premium-btn flex items-center space-x-2 shadow-lg shadow-primary-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Upload New</span>
                    </button>
                </div>
            </div>

            <GlassCard className="!p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Document Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Upload Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center">
                                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : documents.length > 0 ? (
                                documents.map((doc, idx) => (
                                    <motion.tr
                                        key={doc._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600">
                                                    <ShieldCheck className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">{doc.name}</p>
                                                    <p className="text-xs text-slate-500">ID: ...{doc._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-slate-600 dark:text-slate-400 font-medium">{doc.department}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-slate-500 dark:text-slate-500">{doc.complianceType}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-slate-500 dark:text-slate-500">{new Date(doc.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={doc.status} />
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleDownload(doc._id, doc.name)}
                                                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-primary-500 transition-all"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doc._id)}
                                                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500">No documents found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            <UploadModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onUploaded={() => fetchDocuments()}
            />
        </div>
    );
};

export default DocumentList;
