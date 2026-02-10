import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { FileText, BarChart3, Calendar, Download } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Dashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  const quickStats = role === 'teacher' ? [
    { label: 'Total Students', value: '342', change: '+12%' },
    { label: 'Average Performance', value: '78.5%', change: '+3.2%' },
    { label: 'Research Papers', value: '28', change: '+5' },
    { label: 'Department Rank', value: '#3', change: '↑2' },
  ] : [
    { label: 'Current CGPA', value: '8.45', change: '+0.12' },
    { label: 'Attendance', value: '92%', change: '+2%' },
    { label: 'Assignments', value: '18/20', change: '2 pending' },
    { label: 'Semester Rank', value: '#15', change: '↑3' },
  ];

  return (
    <DashboardLayout activeItem="Dashboard">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-6 shadow-soft"
          >
            <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-serif font-bold text-foreground">{stat.value}</p>
              <span className="text-sm text-emerald-500 font-medium">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { title: 'Annual Report 2024-25 Published', time: '2 hours ago' },
              { title: 'Financial Statement Updated', time: '1 day ago' },
              { title: 'Research Paper Submission Deadline', time: '3 days ago' },
              { title: 'Department Meeting Scheduled', time: '1 week ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button onClick={() => navigate('/download-reports')} className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:border-gold hover:bg-gold/5 transition-all">
              <Download className="w-5 h-5 text-gold" />
              <span className="text-sm font-medium text-foreground">Download Annual Report</span>
            </button>
            <button onClick={() => navigate('/academic-performance')} className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:border-gold hover:bg-gold/5 transition-all">
              <BarChart3 className="w-5 h-5 text-gold" />
              <span className="text-sm font-medium text-foreground">View Analytics</span>
            </button>
            <button onClick={() => navigate('/academic-calendar')} className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:border-gold hover:bg-gold/5 transition-all">
              <Calendar className="w-5 h-5 text-gold" />
              <span className="text-sm font-medium text-foreground">Academic Calendar</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
