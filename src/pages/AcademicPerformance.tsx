import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const semesterData = [
  { sem: 'Sem 1', cgpa: 7.8 },
  { sem: 'Sem 2', cgpa: 8.0 },
  { sem: 'Sem 3', cgpa: 8.2 },
  { sem: 'Sem 4', cgpa: 8.45 },
];

const subjectData = [
  { subject: 'Math', marks: 85 },
  { subject: 'Physics', marks: 78 },
  { subject: 'CS', marks: 92 },
  { subject: 'English', marks: 88 },
  { subject: 'Electronics', marks: 74 },
];

const AcademicPerformance = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <DashboardLayout activeItem="Academic Performance">
      <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Academic Performance</h1>
      <p className="text-muted-foreground mb-6">Track your academic progress across semesters</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground mb-4">CGPA Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={semesterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sem" />
              <YAxis domain={[6, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="cgpa" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-foreground mb-4">Subject-wise Marks</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="marks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AcademicPerformance;
