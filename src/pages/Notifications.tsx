import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Bell, Check } from 'lucide-react';

const initialNotifications = [
  { id: 1, title: 'Annual Report 2024-25 has been published', time: '2 hours ago', read: false },
  { id: 2, title: 'Financial Statement updated for Q3', time: '1 day ago', read: false },
  { id: 3, title: 'Research paper submission deadline approaching', time: '3 days ago', read: true },
  { id: 4, title: 'Department meeting scheduled for next Monday', time: '1 week ago', read: true },
  { id: 5, title: 'New assignment posted: Data Structures Lab 5', time: '1 week ago', read: true },
];

const Notifications = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  if (loading) return null;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <DashboardLayout activeItem="Notifications">
      <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Notifications</h1>
      <p className="text-muted-foreground mb-6">
        {notifications.filter(n => !n.read).length} unread notifications
      </p>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`bg-card rounded-xl p-5 shadow-soft flex items-center gap-4 ${!n.read ? 'border-l-4 border-gold' : ''}`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${!n.read ? 'bg-gold/10' : 'bg-muted'}`}>
              <Bell className={`w-5 h-5 ${!n.read ? 'text-gold' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm ${!n.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
            {!n.read && (
              <button onClick={() => markAsRead(n.id)} className="p-2 rounded-lg hover:bg-muted transition-colors" title="Mark as read">
                <Check className="w-4 h-4 text-gold" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
