import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { FileText, Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const reports = [
  { title: 'Annual Report 2024-25', date: 'Jan 2025', status: 'Published' },
  { title: 'Semester Performance Report', date: 'Dec 2024', status: 'Published' },
  { title: 'Assignment Summary Report', date: 'Nov 2024', status: 'Draft' },
  { title: 'Research Output Report', date: 'Oct 2024', status: 'Published' },
];

const MyReports = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <DashboardLayout activeItem="My Reports">
      <h1 className="text-2xl font-serif font-bold text-foreground mb-2">My Reports</h1>
      <p className="text-muted-foreground mb-6">View and download your academic reports</p>

      <div className="space-y-4">
        {reports.map((report, i) => (
          <motion.div
            key={report.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-xl p-5 shadow-soft flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-medium text-foreground">{report.title}</p>
                <p className="text-sm text-muted-foreground">{report.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full ${report.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {report.status}
              </span>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="View">
                <Eye className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Download">
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default MyReports;
