import { motion, AnimatePresence } from 'framer-motion';
import {
    UserPlus,
    Search,
    Mail,
    Shield,
    Trash2,
    Edit3,
    X,
    Check,
    Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import GlassCard from '../components/common/GlassCard';
import api from '../api';
import { toast } from 'react-toastify';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Viewer',
        department: 'IT'
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchUsers = async (search = '') => {
        setLoading(true);
        try {
            const { data } = await api.get(`/users${search ? `?search=${search}` : ''}`);
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/users', formData);
            toast.success('User created successfully');
            fetchUsers();
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'Viewer', department: 'IT' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success('User removed');
            setUsers(users.filter(u => u._id !== id));
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <form
                    onSubmit={(e) => { e.preventDefault(); fetchUsers(searchTerm); }}
                    className="relative group flex-1 max-w-md"
                >
                    <Search className="absolute left-4 top-3 w-5 h-5 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search users, emails, or roles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                    />
                </form>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="premium-btn flex items-center space-x-2 shadow-lg shadow-primary-500/20"
                >
                    <UserPlus className="w-5 h-5" />
                    <span>Add New User</span>
                </button>
            </div>

            <GlassCard className="!p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Information</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Access Level</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-10 text-center">
                                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto" />
                                    </td>
                                </tr>
                            ) : users.map((user, idx) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-md">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                                                <div className="flex items-center text-xs text-slate-500 mt-0.5">
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-slate-600 dark:text-slate-400 font-medium">{user.department}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-2">
                                            <Shield className={`w-4 h-4 ${user.role === 'Admin' ? 'text-rose-500' : 'text-blue-500'}`} />
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="flex items-center space-x-1.5 text-xs font-bold text-emerald-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span>ACTIVE</span>
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Add User Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-lg"
                        >
                            <GlassCard className="!p-8 relative">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <h2 className="text-2xl font-bold text-white mb-6">Create New User</h2>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500 transition-all font-medium"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500 transition-all font-medium"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Initial Password</label>
                                        <input
                                            required
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500 transition-all font-medium"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Role</label>
                                            <select
                                                required
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500 transition-all font-medium appearance-none"
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Staff">Compliance Staff</option>
                                                <option value="Auditor">External Auditor</option>
                                                <option value="Viewer">Viewer Only</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Department</label>
                                            <select
                                                required
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500 transition-all font-medium appearance-none"
                                            >
                                                <option>IT</option>
                                                <option>Finance</option>
                                                <option>HR</option>
                                                <option>Legal</option>
                                                <option>Operations</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full premium-btn py-4 mt-4 font-bold text-lg flex items-center justify-center space-x-2"
                                    >
                                        {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                            <>
                                                <Check className="w-6 h-6" />
                                                <span>Create User</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </GlassCard>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagement;
