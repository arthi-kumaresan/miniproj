import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Moon, Languages, Shield, Smartphone, HelpCircle } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

const SettingItem = ({ icon: Icon, title, description, action }) => (
    <div className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group">
        <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shadow-sm">
                <Icon className="w-6 h-6 text-slate-500 group-hover:text-primary-500 transition-colors" />
            </div>
            <div>
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-tighter text-sm">{title}</h4>
                <p className="text-xs text-slate-500">{description}</p>
            </div>
        </div>
        {action}
    </div>
);

const Settings = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Settings</h2>
                <p className="text-slate-500">Manage your application preferences and security</p>
            </div>

            <GlassCard className="overflow-hidden bg-white/50 dark:bg-slate-900/50 divide-y divide-slate-100 dark:divide-slate-800 ring-1 ring-slate-200 dark:ring-slate-800">
                <SettingItem
                    icon={Moon}
                    title="Appearance"
                    description="Toggle between light and dark mode themes"
                    action={
                        <div className="w-12 h-6 bg-slate-200 dark:bg-primary-500 rounded-full relative p-1 transition-colors">
                            <div className="w-4 h-4 bg-white rounded-full translate-x-6 dark:translate-x-0 transition-transform shadow-sm"></div>
                        </div>
                    }
                />
                <SettingItem
                    icon={Bell}
                    title="Notifications"
                    description="Configure how you receive expiry alerts"
                    action={<span className="text-primary-500 font-bold text-xs">Configure</span>}
                />
                <SettingItem
                    icon={Languages}
                    title="Language"
                    description="Select your preferred application language"
                    action={<span className="text-slate-500 font-bold text-xs uppercase tracking-widest">English (US)</span>}
                />
                <SettingItem
                    icon={Shield}
                    title="Privacy"
                    description="Manage your data and visibility settings"
                    action={<span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Default</span>}
                />
                <SettingItem
                    icon={Smartphone}
                    title="Device Management"
                    description="See and manage your active login sessions"
                    action={<span className="text-slate-500 font-bold text-xs uppercase tracking-widest">3 Active</span>}
                />
                <SettingItem
                    icon={HelpCircle}
                    title="Support & FAQ"
                    description="Get help with the application or read documentation"
                    action={<span className="text-primary-500 font-bold text-xs">View</span>}
                />
            </GlassCard>

            <div className="flex justify-end pt-4 space-x-4">
                <button className="px-6 py-2.5 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Reset Defaults</button>
                <button className="px-8 py-2.5 rounded-2xl bg-primary-500 text-white text-sm font-black shadow-lg shadow-primary-500/25 hover:bg-primary-600 transition-all active:scale-95">Save Changes</button>
            </div>
        </div>
    );
};

export default Settings;
