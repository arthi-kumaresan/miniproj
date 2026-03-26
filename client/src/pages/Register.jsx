import { motion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, User, Building } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';
import api from '../api';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: 'General'
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', formData);
            login(data);
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-900 overflow-hidden relative">
            {/* Animated Background Orbs */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, -50, 0] }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute top-0 -left-20 w-96 h-96 bg-primary-600/30 blur-[120px] rounded-full"
            />
            <motion.div
                animate={{ scale: [1, 1.5, 1], x: [0, -100, 0], y: [0, 50, 0] }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-accent-purple/20 blur-[150px] rounded-full"
            />

            <GlassCard className="w-full max-w-md !p-10 relative z-10">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-premium flex items-center justify-center mb-6 shadow-xl shadow-primary-500/20">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-slate-400">Join the Compliance Vault secure portal</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-primary-500" />
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-primary-500" />
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Department</label>
                        <div className="relative group">
                            <Building className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-primary-500" />
                            <select
                                name="department"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all appearance-none"
                                value={formData.department}
                                onChange={handleChange}
                                required
                            >
                                <option value="General">General</option>
                                <option value="IT">IT Department</option>
                                <option value="Finance">Finance</option>
                                <option value="Legal">Legal</option>
                                <option value="HR">Human Resources</option>
                                <option value="Operations">Operations</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-primary-500" />
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full premium-btn py-4 flex items-center justify-center space-x-2 mt-4"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                            <>
                                <span>Create Account</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-slate-400 text-sm">
                    Already have an account? <Link to="/login" className="text-primary-400 font-semibold hover:underline">Sign In</Link>
                </div>
            </GlassCard>
        </div>
    );
};

export default Register;
