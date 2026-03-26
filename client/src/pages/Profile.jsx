import { motion } from 'framer-motion';
import { User, Mail, Shield, Camera, Edit2, Key, Bell, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/common/GlassCard';

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="relative">
                <div className="h-48 w-full bg-gradient-to-r from-primary-600 to-accent-purple rounded-3xl opacity-20 blur-2xl absolute top-0 left-0"></div>
                <div className="relative flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8 p-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-white text-5xl font-black shadow-2xl ring-4 ring-white dark:ring-slate-900 overflow-hidden">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <button className="absolute bottom-1 right-1 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-primary-500 hover:scale-110 transition-transform">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-center md:text-left space-y-2">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">{user?.name}</h2>
                        <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-500 font-medium">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm uppercase tracking-widest">{user?.role}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <GlassCard className="p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Personal Information</h3>
                            <button className="flex items-center space-x-2 text-sm font-bold text-primary-500 hover:underline">
                                <Edit2 className="w-4 h-4" />
                                <span>Edit info</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Full Name</p>
                                <p className="text-slate-800 dark:text-slate-200 font-medium">{user?.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Email Address</p>
                                <p className="text-slate-800 dark:text-slate-200 font-medium">{user?.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Employee ID</p>
                                <p className="text-slate-800 dark:text-slate-200 font-medium font-mono text-sm">EMP-{user?._id?.slice(-6).toUpperCase()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Department</p>
                                <p className="text-slate-800 dark:text-slate-200 font-medium">Compliance & Risk</p>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-8 space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Security</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                        <Key className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Password</p>
                                        <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Change</button>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                                        <p className="text-xs text-slate-500">Secure your account with 2FA</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-primary-500 text-white rounded-xl text-xs font-bold hover:bg-primary-600 transition-all">Enable</button>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                <div className="space-y-8">
                    <GlassCard className="p-6 space-y-4">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Plan & Usage</h4>
                        <div className="p-4 rounded-2xl bg-primary-500 text-white space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-medium opacity-80 uppercase">Enterprise Plan</span>
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <h5 className="text-2xl font-black">Unlimited</h5>
                                <p className="text-[10px] opacity-70 uppercase font-bold">Docs Storage</p>
                            </div>
                        </div>
                    </GlassCard>

                    <div className="space-y-2">
                        <button className="w-full flex items-center space-x-3 p-4 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="font-bold text-sm">Notifications</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 p-4 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <CreditCard className="w-5 h-5" />
                            <span className="font-bold text-sm">Billing</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
