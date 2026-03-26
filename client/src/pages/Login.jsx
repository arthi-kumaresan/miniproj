import { motion } from 'framer-motion';
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';
import api from '../api';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 overflow-hidden relative">
            {/* Animated Background Orbs */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, -50, 0] }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute top-0 -left-20 w-96 h-96 bg-primary-600/10 blur-[120px] rounded-full"
            />

            <GlassCard className="w-full max-w-md !p-10 relative z-10">
                <div className="flex flex-col items-center mb-8 text-center text-white">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-6 shadow-xl shadow-primary-500/20">
                        <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Access the Compliance Vault secure portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-primary-500" />
                            <input
                                type="email"
                                placeholder="name@company.com"
                                className="glass-input pl-12"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 transition-colors group-focus-within:text-primary-500" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="glass-input pl-12"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="premium-btn w-full py-4 flex items-center justify-center space-x-2" disabled={loading}>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center text-slate-400 text-sm">
                    Don't have an account? <Link to="/register" className="text-primary-400 font-semibold hover:underline">Create Account</Link>
                </div>
            </GlassCard>
        </div>
    );
};

export default Login;
