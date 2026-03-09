import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Lock, Bell, Palette, Save, X, Eye, EyeOff, Moon, Sun,
  Mail, Smartphone, AlertTriangle, CheckCircle, Loader2
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  full_name: string;
  email: string;
  department?: string;
  enrollment_number?: string;
  employee_id?: string;
  avatar_url?: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  assignment_deadlines: boolean;
  grade_notifications: boolean;
  system_updates: boolean;
  marketing_emails: boolean;
}

const Settings = () => {
  const { user, loading, role } = useAuth();
  const navigate = useNavigate();

  // Settings state
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Profile settings
  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    email: '',
    department: '',
    enrollment_number: '',
    employee_id: '',
    avatar_url: ''
  });

  // Password settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    assignment_deadlines: true,
    grade_notifications: true,
    system_updates: false,
    marketing_emails: false
  });

  // Theme settings
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadNotificationSettings();
      loadThemeSettings();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: user!.email || '',
          department: data.department || '',
          enrollment_number: data.enrollment_number || '',
          employee_id: data.employee_id || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadNotificationSettings = async () => {
    // In a real app, this would load from user preferences table
    // For now, we'll use localStorage as a placeholder
    const saved = localStorage.getItem(`notifications_${user!.id}`);
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  };

  const loadThemeSettings = () => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
    if (saved) {
      setTheme(saved);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    setLoadingStates(prev => ({ ...prev, profile: true }));

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          full_name: profile.full_name,
          email: profile.email,
          department: profile.department,
          enrollment_number: profile.enrollment_number,
          employee_id: profile.employee_id,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Profile updated successfully!');
      setActiveDialog(null);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoadingStates(prev => ({ ...prev, profile: false }));
    }
  };

  const updatePassword = async () => {
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoadingStates(prev => ({ ...prev, password: true }));

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully!');
      setActiveDialog(null);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setLoadingStates(prev => ({ ...prev, password: false }));
    }
  };

  const updateNotifications = async () => {
    setLoadingStates(prev => ({ ...prev, notifications: true }));

    try {
      // In a real app, save to database
      localStorage.setItem(`notifications_${user!.id}`, JSON.stringify(notifications));

      toast.success('Notification preferences updated!');
      setActiveDialog(null);
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Failed to update preferences');
    } finally {
      setLoadingStates(prev => ({ ...prev, notifications: false }));
    }
  };

  const updateTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Apply theme
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (systemTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    toast.success('Theme updated successfully!');
  };

  if (loading) return null;

  const settingsSections = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Update your name, email, and profile information',
      action: () => setActiveDialog('profile')
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Change password and manage account security',
      action: () => setActiveDialog('password')
    },
    {
      icon: Bell,
      title: 'Notification Preferences',
      description: 'Manage email and push notification settings',
      action: () => setActiveDialog('notifications')
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Switch between light and dark themes',
      action: () => setActiveDialog('theme')
    },
  ];

  return (
    <DashboardLayout activeItem="Settings">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and security</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settingsSections.map((section, i) => (
          <motion.button
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={section.action}
            className="bg-card rounded-xl p-5 shadow-soft flex items-center gap-4 text-left hover:border-gold/30 border border-transparent transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-gold/10 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
              <section.icon className="w-6 h-6 text-gold" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{section.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Profile Settings Dialog */}
      <Dialog open={activeDialog === 'profile'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Profile Settings</DialogTitle>
            <DialogDescription>Update your personal information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
              <Input
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            {role === 'student' ? (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Department</label>
                  <Input
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    placeholder="e.g., Computer Science"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Enrollment Number</label>
                  <Input
                    value={profile.enrollment_number}
                    onChange={(e) => setProfile({ ...profile, enrollment_number: e.target.value })}
                    placeholder="Enter enrollment number"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Employee ID</label>
                <Input
                  value={profile.employee_id}
                  onChange={(e) => setProfile({ ...profile, employee_id: e.target.value })}
                  placeholder="Enter employee ID"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setActiveDialog(null)}>Cancel</Button>
              <Button
                onClick={updateProfile}
                disabled={loadingStates.profile}
                className="bg-gold text-navy hover:bg-gold/90"
              >
                {loadingStates.profile ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Settings Dialog */}
      <Dialog open={activeDialog === 'password'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Change Password</DialogTitle>
            <DialogDescription>Update your account password</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Current Password</label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">New Password</label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Confirm New Password</label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setActiveDialog(null)}>Cancel</Button>
              <Button
                onClick={updatePassword}
                disabled={loadingStates.password}
                className="bg-gold text-navy hover:bg-gold/90"
              >
                {loadingStates.password ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notification Settings Dialog */}
      <Dialog open={activeDialog === 'notifications'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Notification Preferences</DialogTitle>
            <DialogDescription>Choose how you want to be notified</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email_notifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email_notifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.push_notifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push_notifications: checked })}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-foreground mb-4">Notification Types</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Assignment Deadlines</p>
                    <p className="text-sm text-muted-foreground">Reminders about upcoming deadlines</p>
                  </div>
                  <Switch
                    checked={notifications.assignment_deadlines}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, assignment_deadlines: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Grade Notifications</p>
                    <p className="text-sm text-muted-foreground">When assignments are graded</p>
                  </div>
                  <Switch
                    checked={notifications.grade_notifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, grade_notifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">System Updates</p>
                    <p className="text-sm text-muted-foreground">Platform updates and maintenance</p>
                  </div>
                  <Switch
                    checked={notifications.system_updates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, system_updates: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">Newsletters and promotional content</p>
                  </div>
                  <Switch
                    checked={notifications.marketing_emails}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketing_emails: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="ghost" onClick={() => setActiveDialog(null)}>Cancel</Button>
              <Button
                onClick={updateNotifications}
                disabled={loadingStates.notifications}
                className="bg-gold text-navy hover:bg-gold/90"
              >
                {loadingStates.notifications ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Theme Settings Dialog */}
      <Dialog open={activeDialog === 'theme'} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Appearance Settings</DialogTitle>
            <DialogDescription>Choose your preferred theme</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => updateTheme('light')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'light'
                    ? 'border-gold bg-gold/10'
                    : 'border-border hover:border-gold/50'
                }`}
              >
                <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm font-medium">Light</p>
              </button>

              <button
                onClick={() => updateTheme('dark')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-gold bg-gold/10'
                    : 'border-border hover:border-gold/50'
                }`}
              >
                <Moon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-medium">Dark</p>
              </button>

              <button
                onClick={() => updateTheme('system')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'system'
                    ? 'border-gold bg-gold/10'
                    : 'border-border hover:border-gold/50'
                }`}
              >
                <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  <Moon className="w-4 h-4 text-blue-500 -ml-1" />
                </div>
                <p className="text-sm font-medium">System</p>
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Current theme: <span className="font-medium capitalize">{theme}</span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Settings;
