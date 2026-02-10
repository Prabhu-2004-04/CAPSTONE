import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Palette } from 'lucide-react';

const settingsSections = [
  { icon: User, title: 'Profile Settings', description: 'Update your name, email, and profile picture' },
  { icon: Lock, title: 'Security', description: 'Change password and manage two-factor authentication' },
  { icon: Bell, title: 'Notification Preferences', description: 'Manage email and push notification settings' },
  { icon: Palette, title: 'Appearance', description: 'Switch between light and dark themes' },
];

const Settings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <DashboardLayout activeItem="Settings">
      <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Settings</h1>
      <p className="text-muted-foreground mb-6">Manage your account preferences</p>

      <div className="space-y-4">
        {settingsSections.map((section, i) => (
          <motion.button
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="w-full bg-card rounded-xl p-5 shadow-soft flex items-center gap-4 text-left hover:border-gold/30 border border-transparent transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <section.icon className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="font-medium text-foreground">{section.title}</p>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
