import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, FileText, BarChart3, Calendar, Download, Bell, Settings, LogOut,
  Users, TrendingUp, BookOpen, GraduationCap, ClipboardList, ClipboardPenLine
} from 'lucide-react';
import allianceLogo from '@/assets/alliance-logo.png';

const studentMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ClipboardList, label: 'Assignments', path: '/assignments' },
  { icon: FileText, label: 'My Reports', path: '/my-reports' },
  { icon: BarChart3, label: 'Academic Performance', path: '/academic-performance' },
  { icon: Calendar, label: 'Academic Calendar', path: '/academic-calendar' },
  { icon: Download, label: 'Download Reports', path: '/download-reports' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const teacherMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ClipboardPenLine, label: 'Assignment Management', path: '/assignment-management' },
  { icon: FileText, label: 'Department Reports', path: '/my-reports' },
  { icon: Users, label: 'Student Analytics', path: '/academic-performance' },
  { icon: TrendingUp, label: 'Performance Metrics', path: '/academic-performance' },
  { icon: BarChart3, label: 'Research Output', path: '/my-reports' },
  { icon: Calendar, label: 'Academic Calendar', path: '/academic-calendar' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface DashboardLayoutProps {
  children: ReactNode;
  activeItem: string;
}

const DashboardLayout = ({ children, activeItem }: DashboardLayoutProps) => {
  const { role, user, signOut } = useAuth();
  const navigate = useNavigate();
  const menuItems = role === 'teacher' ? teacherMenuItems : studentMenuItems;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-navy min-h-screen p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <img src={allianceLogo} alt="Alliance University" className="h-10 w-auto bg-white/90 rounded p-1" />
          <div>
            <p className="text-cream/60 text-xs uppercase tracking-wider">Portal</p>
            <p className="text-gold text-sm font-medium capitalize">{role || 'User'}</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                item.label === activeItem
                  ? 'bg-gold/10 text-gold'
                  : 'text-cream/60 hover:text-cream hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-cream/60 hover:text-cream hover:bg-white/5 transition-colors mt-4"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </aside>

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Welcome back, {user?.user_metadata?.full_name || 'User'}
            </h1>
            <p className="text-muted-foreground">
              {role === 'teacher' ? 'Faculty Dashboard' : 'Student Dashboard'} • Academic Year 2024-25
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/notifications')} className="p-2 rounded-lg bg-card shadow-soft hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              {role === 'teacher' ? <BookOpen className="w-5 h-5 text-gold" /> : <GraduationCap className="w-5 h-5 text-gold" />}
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
