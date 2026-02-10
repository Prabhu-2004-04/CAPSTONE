import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

const downloads = [
  { title: 'Annual Report 2024-25', size: '4.2 MB', format: 'PDF' },
  { title: 'Semester Marksheet', size: '1.1 MB', format: 'PDF' },
  { title: 'Attendance Certificate', size: '0.5 MB', format: 'PDF' },
  { title: 'Assignment Summary', size: '2.3 MB', format: 'PDF' },
  { title: 'Research Publications List', size: '0.8 MB', format: 'PDF' },
];

const DownloadReports = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  if (loading) return null;

  const handleDownload = (title: string) => {
    toast.success(`Preparing "${title}" for download...`);
  };

  return (
    <DashboardLayout activeItem="Download Reports">
      <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Download Reports</h1>
      <p className="text-muted-foreground mb-6">Download your academic reports and documents</p>

      <div className="grid md:grid-cols-2 gap-4">
        {downloads.map((item, i) => (
          <motion.div
            key={item.title}
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
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.format} • {item.size}</p>
              </div>
            </div>
            <button
              onClick={() => handleDownload(item.title)}
              className="p-2 rounded-lg bg-gold/10 hover:bg-gold/20 transition-colors"
            >
              <Download className="w-5 h-5 text-gold" />
            </button>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DownloadReports;
