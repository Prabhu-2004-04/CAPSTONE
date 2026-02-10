import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

const events = [
  { title: 'Mid-Semester Exams', date: 'Feb 15 – Feb 25, 2025', type: 'Exam' },
  { title: 'Spring Festival', date: 'Mar 5, 2025', type: 'Event' },
  { title: 'Assignment Submission Deadline', date: 'Mar 10, 2025', type: 'Deadline' },
  { title: 'Guest Lecture – AI in Education', date: 'Mar 18, 2025', type: 'Lecture' },
  { title: 'End-Semester Exams', date: 'Apr 20 – May 5, 2025', type: 'Exam' },
  { title: 'Summer Break Begins', date: 'May 15, 2025', type: 'Holiday' },
];

const typeColors: Record<string, string> = {
  Exam: 'bg-red-100 text-red-700',
  Event: 'bg-blue-100 text-blue-700',
  Deadline: 'bg-amber-100 text-amber-700',
  Lecture: 'bg-purple-100 text-purple-700',
  Holiday: 'bg-emerald-100 text-emerald-700',
};

const AcademicCalendar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <DashboardLayout activeItem="Academic Calendar">
      <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Academic Calendar</h1>
      <p className="text-muted-foreground mb-6">Important dates and events for 2024-25</p>

      <div className="space-y-4">
        {events.map((event, i) => (
          <motion.div
            key={event.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-card rounded-xl p-5 shadow-soft flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{event.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full ${typeColors[event.type]}`}>
              {event.type}
            </span>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AcademicCalendar;
