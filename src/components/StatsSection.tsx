import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { 
  Users, GraduationCap, BookOpen, Trophy, Building2, Globe, 
  Microscope, Laptop, Library, DollarSign, HeartHandshake, 
  Briefcase, FileText, Award, Target, Lightbulb, FlaskConical,
  School, BookOpenCheck, Medal, Sparkles, TrendingUp,
  ChevronDown, ChevronUp, UserCheck, CalendarDays, ClipboardList,
  BadgeCheck, Percent, BarChart3, Activity, Shield, Settings,
  Clock, CheckCircle, AlertTriangle, Brain, Cpu, Eye,
  Layers, GitBranch, Lock, Zap, Star, Gauge, Workflow,
  FileCheck, Upload, PenTool, Hash, Wrench, Wifi, CircleDollarSign
} from 'lucide-react';

type StatItem = {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description: string;
};

type StatCategory = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  stats: StatItem[];
};

const statCategories: StatCategory[] = [
  {
    id: 'institutional',
    title: 'Basic Institutional',
    icon: Building2,
    gradient: 'from-slate-500 to-slate-700',
    stats: [
      { icon: CalendarDays, value: 2025, suffix: '', label: 'Academic Year', description: '2024-25 session' },
      { icon: Building2, value: 12, suffix: '', label: 'Departments', description: 'Active departments' },
      { icon: School, value: 45, suffix: '', label: 'UG Programs', description: 'Undergraduate programs' },
      { icon: BookOpenCheck, value: 30, suffix: '', label: 'PG Programs', description: 'Postgraduate programs' },
      { icon: Microscope, value: 10, suffix: '', label: 'PhD Programs', description: 'Doctoral programs' },
      { icon: BookOpen, value: 85, suffix: '+', label: 'Total Programs', description: 'All programs offered' },
      { icon: Users, value: 850, suffix: '+', label: 'Total Faculty', description: 'Teaching staff' },
      { icon: GraduationCap, value: 12500, suffix: '+', label: 'Total Students', description: 'Student strength' },
    ]
  },
  {
    id: 'faculty',
    title: 'Faculty Parameters',
    icon: UserCheck,
    gradient: 'from-amber-500 to-orange-600',
    stats: [
      { icon: UserCheck, value: 850, suffix: '+', label: 'Faculty Count', description: 'Active faculty members' },
      { icon: Award, value: 340, suffix: '+', label: 'PhD Holders', description: 'Doctoral qualified' },
      { icon: FileText, value: 1200, suffix: '+', label: 'Publications', description: 'Total publications' },
      { icon: CalendarDays, value: 156, suffix: '', label: 'FDPs Attended', description: 'Faculty development' },
      { icon: Globe, value: 89, suffix: '', label: 'Conferences', description: 'Conferences attended' },
      { icon: Trophy, value: 42, suffix: '', label: 'Awards', description: 'Faculty recognitions' },
      { icon: Percent, value: 15, suffix: ':1', label: 'Faculty-Student Ratio', description: 'Auto-calculated' },
      { icon: Medal, value: 28, suffix: '', label: 'Professors', description: 'Full professors' },
      { icon: Star, value: 65, suffix: '', label: 'Associate Profs', description: 'Associate professors' },
    ]
  },
  {
    id: 'students',
    title: 'Student Parameters',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-indigo-600',
    stats: [
      { icon: GraduationCap, value: 12500, suffix: '+', label: 'Total Enrolled', description: 'All programs' },
      { icon: Users, value: 3800, suffix: '+', label: 'New Admissions', description: 'This academic year' },
      { icon: CheckCircle, value: 98, suffix: '%', label: 'Pass Percentage', description: 'Overall pass rate' },
      { icon: AlertTriangle, value: 45, suffix: '', label: 'Dropout Count', description: 'Total dropouts' },
      { icon: Briefcase, value: 3100, suffix: '+', label: 'Placement Count', description: 'Students placed' },
      { icon: BookOpen, value: 420, suffix: '+', label: 'Higher Studies', description: 'Pursuing higher ed' },
      { icon: Target, value: 1800, suffix: '+', label: 'Internships', description: 'Internship participation' },
      { icon: Globe, value: 1200, suffix: '+', label: 'International', description: 'From 45+ countries' },
      { icon: Percent, value: 48, suffix: '%', label: 'Female Students', description: 'Gender diversity' },
    ]
  },
  {
    id: 'assignment-mgmt',
    title: 'Assignment Management',
    icon: ClipboardList,
    gradient: 'from-violet-500 to-purple-600',
    stats: [
      { icon: ClipboardList, value: 4500, suffix: '+', label: 'Total Assignments', description: 'Across all courses' },
      { icon: BookOpen, value: 320, suffix: '', label: 'Course Codes', description: 'Active courses' },
      { icon: FileText, value: 2800, suffix: '', label: 'Theory Assignments', description: 'Theory type' },
      { icon: FlaskConical, value: 1200, suffix: '', label: 'Practical Assignments', description: 'Practical type' },
      { icon: Layers, value: 500, suffix: '', label: 'Project Assignments', description: 'Project-based' },
      { icon: Upload, value: 78, suffix: '%', label: 'Online Submissions', description: 'Online mode' },
      { icon: PenTool, value: 3200, suffix: '', label: 'Rubrics Uploaded', description: 'Evaluation criteria' },
      { icon: Eye, value: 92, suffix: '%', label: 'Published Status', description: 'Published assignments' },
    ]
  },
  {
    id: 'assignment-status',
    title: 'Submission & Status',
    icon: FileCheck,
    gradient: 'from-teal-500 to-cyan-600',
    stats: [
      { icon: CheckCircle, value: 88, suffix: '%', label: 'Submitted', description: 'On-time submissions' },
      { icon: AlertTriangle, value: 7, suffix: '%', label: 'Late Submissions', description: 'Late submission rate' },
      { icon: Clock, value: 5, suffix: '%', label: 'Not Submitted', description: 'Pending submissions' },
      { icon: Upload, value: 52000, suffix: '+', label: 'Files Uploaded', description: 'PDF/DOC/ZIP uploads' },
      { icon: Shield, value: 95, suffix: '%', label: 'Plagiarism Checked', description: 'Checked submissions' },
      { icon: GitBranch, value: 15, suffix: '%', label: 'Resubmissions', description: 'Resubmission rate' },
      { icon: Hash, value: 1.3, suffix: ' avg', label: 'Resubmit Count', description: 'Avg resubmissions' },
    ]
  },
  {
    id: 'assignment-eval',
    title: 'Assignment Evaluation',
    icon: BadgeCheck,
    gradient: 'from-emerald-500 to-green-600',
    stats: [
      { icon: BadgeCheck, value: 92, suffix: '%', label: 'Evaluated', description: 'Evaluation completed' },
      { icon: Clock, value: 8, suffix: '%', label: 'Pending', description: 'Pending evaluation' },
      { icon: BarChart3, value: 72, suffix: '%', label: 'Avg Marks', description: 'Average marks obtained' },
      { icon: Award, value: 35, suffix: '%', label: 'A Grade', description: 'Students with A grade' },
      { icon: FileText, value: 85, suffix: '%', label: 'Feedback Given', description: 'Faculty feedback rate' },
      { icon: Shield, value: 78, suffix: '%', label: 'Moderated', description: 'Internal moderation' },
    ]
  },
  {
    id: 'assignment-analytics',
    title: 'Assignment Analytics',
    icon: BarChart3,
    gradient: 'from-pink-500 to-rose-600',
    stats: [
      { icon: Percent, value: 88, suffix: '%', label: 'Completion Rate', description: 'Assignment completion' },
      { icon: BarChart3, value: 72, suffix: '/100', label: 'Avg Marks', description: 'Per assignment average' },
      { icon: Clock, value: 7, suffix: '%', label: 'Late Rate', description: 'Late submission rate' },
      { icon: Shield, value: 4, suffix: '%', label: 'Plagiarism %', description: 'Average plagiarism' },
      { icon: TrendingUp, value: 15, suffix: '%', label: 'Performance Growth', description: 'YoY improvement' },
    ]
  },
  {
    id: 'research',
    title: 'Research & Innovation',
    icon: FlaskConical,
    gradient: 'from-emerald-500 to-teal-600',
    stats: [
      { icon: FileText, value: 856, suffix: '+', label: 'Total Publications', description: 'All journals' },
      { icon: Globe, value: 520, suffix: '+', label: 'Scopus/WoS Indexed', description: 'Indexed publications' },
      { icon: FlaskConical, value: 45, suffix: '', label: 'Ongoing Projects', description: 'Research projects' },
      { icon: CircleDollarSign, value: 12, suffix: ' Cr', prefix: '₹', label: 'Research Grants', description: 'External funding' },
      { icon: Lightbulb, value: 28, suffix: '', label: 'Patents Filed', description: 'IP filings' },
      { icon: CheckCircle, value: 8, suffix: '', label: 'Patents Granted', description: 'Approved patents' },
      { icon: Briefcase, value: 35, suffix: '', label: 'Consultancy Projects', description: 'Industry consulting' },
      { icon: DollarSign, value: 3.5, suffix: ' Cr', prefix: '₹', label: 'Consultancy Revenue', description: 'Revenue earned' },
    ]
  },
  {
    id: 'academics',
    title: 'Academic Activities',
    icon: BookOpen,
    gradient: 'from-orange-500 to-amber-600',
    stats: [
      { icon: CheckCircle, value: 85, suffix: '%', label: 'Curriculum Revised', description: 'Updated curricula' },
      { icon: Lightbulb, value: 120, suffix: '+', label: 'Innovative Practices', description: 'Teaching innovations' },
      { icon: Laptop, value: 250, suffix: '+', label: 'ICT-enabled Classes', description: 'Tech-enabled rooms' },
      { icon: Users, value: 180, suffix: '+', label: 'Guest Lectures', description: 'Industry experts' },
      { icon: CalendarDays, value: 95, suffix: '+', label: 'Workshops/Seminars', description: 'Events conducted' },
      { icon: Trophy, value: 42, suffix: '', label: 'Gold Medals', description: 'University toppers' },
      { icon: Award, value: 98, suffix: '%', label: 'Pass Rate', description: 'Overall exam result' },
      { icon: Medal, value: 22, suffix: '', label: 'Best Paper Awards', description: 'Faculty achievements' },
    ]
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure',
    icon: Building2,
    gradient: 'from-rose-500 to-pink-600',
    stats: [
      { icon: Building2, value: 250, suffix: '+', label: 'Classrooms', description: 'Including smart rooms' },
      { icon: Laptop, value: 150, suffix: '+', label: 'Smart Classrooms', description: 'Tech-enabled' },
      { icon: FlaskConical, value: 65, suffix: '', label: 'Laboratories', description: 'State-of-the-art labs' },
      { icon: Library, value: 2, suffix: ' Lakh+', label: 'Library Books', description: 'Physical collection' },
      { icon: Globe, value: 50000, suffix: '+', label: 'E-Resources', description: 'Digital resources' },
      { icon: Wifi, value: 10, suffix: ' Gbps', label: 'Internet Bandwidth', description: 'Campus connectivity' },
      { icon: Building2, value: 100, suffix: ' Acres', label: 'Campus Area', description: 'Green campus' },
    ]
  },
  {
    id: 'financial',
    title: 'Financial Parameters',
    icon: DollarSign,
    gradient: 'from-green-500 to-emerald-600',
    stats: [
      { icon: CircleDollarSign, value: 245, suffix: ' Cr', prefix: '₹', label: 'Budget Allocated', description: 'Annual budget' },
      { icon: DollarSign, value: 228, suffix: ' Cr', prefix: '₹', label: 'Expenditure', description: 'Total spent' },
      { icon: Percent, value: 93, suffix: '%', label: 'Utilization', description: 'Budget utilization' },
      { icon: TrendingUp, value: 18, suffix: ' Cr', prefix: '₹', label: 'Revenue Generated', description: 'Dept revenue' },
      { icon: BarChart3, value: 32, suffix: '%', label: 'YoY Growth', description: 'Revenue growth' },
    ]
  },
  {
    id: 'placement',
    title: 'Placements & Industry',
    icon: Briefcase,
    gradient: 'from-violet-500 to-purple-600',
    stats: [
      { icon: Briefcase, value: 500, suffix: '+', label: 'Recruiters', description: 'Companies visited' },
      { icon: DollarSign, value: 54, suffix: ' LPA', label: 'Highest Package', description: 'Domestic placement' },
      { icon: TrendingUp, value: 12, suffix: ' LPA', label: 'Avg Package', description: 'Campus placements' },
      { icon: Users, value: 3100, suffix: '+', label: 'Students Placed', description: 'Campus recruitment' },
      { icon: Award, value: 45, suffix: '+', label: 'Fortune 500', description: 'Companies recruiting' },
      { icon: HeartHandshake, value: 85, suffix: '+', label: 'MoUs Signed', description: 'Industry partnerships' },
      { icon: Globe, value: 120, suffix: '+', label: 'Global Partners', description: 'Universities worldwide' },
      { icon: Target, value: 200, suffix: '+', label: 'Paid Internships', description: 'Industry internships' },
    ]
  },
  {
    id: 'outreach',
    title: 'Extension & Outreach',
    icon: HeartHandshake,
    gradient: 'from-cyan-500 to-sky-600',
    stats: [
      { icon: HeartHandshake, value: 50, suffix: '+', label: 'NSS Programs', description: 'Community service' },
      { icon: Sparkles, value: 25, suffix: '+', label: 'Environmental', description: 'Green initiatives' },
      { icon: Users, value: 8500, suffix: '+', label: 'Student Participation', description: 'In outreach' },
      { icon: Globe, value: 45000, suffix: '+', label: 'Alumni Network', description: 'Global alumni base' },
      { icon: DollarSign, value: 8, suffix: ' Cr', prefix: '₹', label: 'Social Investment', description: 'Community development' },
    ]
  },
  {
    id: 'compliance',
    title: 'Compliance & Quality',
    icon: Shield,
    gradient: 'from-indigo-500 to-blue-600',
    stats: [
      { icon: Shield, value: 100, suffix: '%', label: 'AQAR Submitted', description: 'AQAR compliance' },
      { icon: CheckCircle, value: 100, suffix: '%', label: 'Audit Completed', description: 'Internal audit done' },
      { icon: Wrench, value: 45, suffix: '', label: 'Corrective Actions', description: 'Actions implemented' },
      { icon: Star, value: 12, suffix: '', label: 'Best Practices', description: 'Documented practices' },
      { icon: Award, value: 1, suffix: '', label: 'NAAC A++', description: 'Accreditation grade' },
    ]
  },
  {
    id: 'workflow',
    title: 'Workflow & Tracking',
    icon: Workflow,
    gradient: 'from-gray-500 to-zinc-600',
    stats: [
      { icon: FileCheck, value: 85, suffix: '%', label: 'Reports Approved', description: 'Approval rate' },
      { icon: Clock, value: 10, suffix: '%', label: 'Under Review', description: 'Pending review' },
      { icon: AlertTriangle, value: 5, suffix: '%', label: 'Delayed', description: 'Delay flagged' },
      { icon: Percent, value: 92, suffix: '%', label: 'Completion Rate', description: 'Overall completion' },
      { icon: CalendarDays, value: 15, suffix: ' days', label: 'Avg Approval Time', description: 'Processing time' },
    ]
  },
  // ── Innovative / Conceptual Features ──
  {
    id: 'insight-engine',
    title: '🧠 Assignment Insight Engine',
    icon: Brain,
    gradient: 'from-fuchsia-500 to-pink-600',
    stats: [
      { icon: Brain, value: 4, suffix: ' levels', label: 'Difficulty Detection', description: 'Auto-classified levels' },
      { icon: BarChart3, value: 78, suffix: '/100', label: 'Quality Score', description: "Bloom's Taxonomy based" },
      { icon: Activity, value: 3.2, suffix: '/5', label: 'Cognitive Load', description: 'Estimated load index' },
      { icon: Eye, value: 12, suffix: '%', label: 'Similarity Detected', description: 'Cross-dept matching' },
    ]
  },
  {
    id: 'stress-monitor',
    title: '📊 Stress & Load Monitor',
    icon: Activity,
    gradient: 'from-red-500 to-orange-600',
    stats: [
      { icon: Activity, value: 68, suffix: '/100', label: 'Workload Index', description: 'Student academic load' },
      { icon: Gauge, value: 72, suffix: '/100', label: 'Faculty Load', description: 'Evaluation load index' },
      { icon: AlertTriangle, value: 15, suffix: '', label: 'Overload Alerts', description: 'Early warnings issued' },
      { icon: CalendarDays, value: 85, suffix: '%', label: 'Balanced Schedule', description: 'Scheduling compliance' },
    ]
  },
  {
    id: 'trust-eval',
    title: '🔒 Trust-Based Evaluation',
    icon: Lock,
    gradient: 'from-amber-600 to-yellow-600',
    stats: [
      { icon: Shield, value: 87, suffix: '%', label: 'Confidence Score', description: 'Evaluation confidence' },
      { icon: Eye, value: 3, suffix: '%', label: 'Bias Detected', description: 'Grading bias rate' },
      { icon: Users, value: 45, suffix: '', label: 'Cross-Dept Reviews', description: 'Anonymous moderation' },
      { icon: AlertTriangle, value: 8, suffix: '', label: 'Flagged Evaluations', description: 'Inconsistencies found' },
    ]
  },
  {
    id: 'digital-twin',
    title: '🌐 Academic Digital Twin',
    icon: Cpu,
    gradient: 'from-sky-500 to-blue-600',
    stats: [
      { icon: Cpu, value: 12, suffix: '', label: 'Dept Models', description: 'Virtual activity models' },
      { icon: GitBranch, value: 35, suffix: '', label: 'Simulations Run', description: 'Curriculum changes' },
      { icon: TrendingUp, value: 22, suffix: '', label: 'What-If Analyses', description: 'Outcome predictions' },
    ]
  },
  {
    id: 'integrity',
    title: '📋 Learning Integrity Index',
    icon: Shield,
    gradient: 'from-emerald-600 to-green-700',
    stats: [
      { icon: Shield, value: 92, suffix: '/100', label: 'Integrity Score', description: 'Composite score' },
      { icon: TrendingUp, value: 8, suffix: '%', label: 'Trend Improvement', description: 'Semester-over-semester' },
      { icon: BarChart3, value: 85, suffix: 'th', label: 'Benchmark Percentile', description: 'Cross-program rank' },
    ]
  },
  {
    id: 'effort-recognition',
    title: '⭐ Student Effort Recognition',
    icon: Star,
    gradient: 'from-yellow-500 to-amber-500',
    stats: [
      { icon: Star, value: 72, suffix: '/100', label: 'Effort Score', description: 'Independent of marks' },
      { icon: TrendingUp, value: 340, suffix: '', label: 'Improving Students', description: 'Trajectory detected' },
      { icon: Award, value: 85, suffix: '', label: 'Hidden Merit', description: 'Slow learner recognition' },
    ]
  },
  {
    id: 'blockchain',
    title: '🔗 Assignment Blockchain',
    icon: Lock,
    gradient: 'from-gray-600 to-slate-700',
    stats: [
      { icon: Lock, value: 52000, suffix: '+', label: 'Immutable Records', description: 'Submission records' },
      { icon: Clock, value: 100, suffix: '%', label: 'Tamper-Proof', description: 'Evaluation timestamps' },
      { icon: FileCheck, value: 100, suffix: '%', label: 'Audit Trail', description: 'Transparent disputes' },
    ]
  },
  {
    id: 'ai-oversight',
    title: '🤖 Ethical AI Oversight',
    icon: Cpu,
    gradient: 'from-purple-600 to-indigo-700',
    stats: [
      { icon: FileText, value: 120, suffix: '', label: 'Explainability Reports', description: 'AI decision clarity' },
      { icon: Users, value: 45, suffix: '', label: 'Override Logs', description: 'Human-in-the-loop' },
      { icon: Shield, value: 94, suffix: '/100', label: 'Ethics Compliance', description: 'Automation ethics score' },
    ]
  },
  {
    id: 'intelligence-score',
    title: '🏛️ Institutional Intelligence',
    icon: Gauge,
    gradient: 'from-gold to-amber-600',
    stats: [
      { icon: Gauge, value: 88, suffix: '/100', label: 'Intelligence Score', description: 'Unified KPI' },
      { icon: TrendingUp, value: 12, suffix: '%', label: 'YoY Maturity', description: 'Evolution growth' },
      { icon: Globe, value: 15, suffix: '', label: 'Peer Comparisons', description: 'Simulated benchmarks' },
    ]
  },
];

const CountUp = ({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const stepValue = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current * 10) / 10);
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  const displayValue = Number.isInteger(value) ? Math.floor(count).toLocaleString() : count.toFixed(1);

  return (
    <span ref={ref}>
      {prefix}{displayValue}{suffix}
    </span>
  );
};

// Split categories into implemented and innovative
const implementedCategories = statCategories.filter(c => !['insight-engine', 'stress-monitor', 'trust-eval', 'digital-twin', 'integrity', 'effort-recognition', 'blockchain', 'ai-oversight', 'intelligence-score'].includes(c.id));
const innovativeCategories = statCategories.filter(c => ['insight-engine', 'stress-monitor', 'trust-eval', 'digital-twin', 'integrity', 'effort-recognition', 'blockchain', 'ai-oversight', 'intelligence-score'].includes(c.id));

export const StatsSection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [expandedCategory, setExpandedCategory] = useState<string | null>('institutional');
  const [showInnovative, setShowInnovative] = useState(false);

  const totalParams = statCategories.reduce((acc, c) => acc + c.stats.length, 0);
  const activeCategories = showInnovative ? innovativeCategories : implementedCategories;

  return (
    <section id="overview" className="py-24 bg-background relative">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container mx-auto px-4 lg:px-8 relative" ref={containerRef}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-gold font-medium tracking-widest uppercase text-sm mb-4"
          >
            At a Glance
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-heading"
          >
            Year in Numbers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            {totalParams}+ key metrics across {statCategories.length} categories covering implemented parameters 
            and innovative conceptual features.
          </motion.p>
        </div>

        {/* Toggle: Implemented vs Innovative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex rounded-xl bg-card shadow-soft p-1.5 gap-1">
            <button
              onClick={() => { setShowInnovative(false); setExpandedCategory('institutional'); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                !showInnovative ? 'bg-navy text-cream shadow-md' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              📊 Implemented Parameters
            </button>
            <button
              onClick={() => { setShowInnovative(true); setExpandedCategory('insight-engine'); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                showInnovative ? 'bg-navy text-cream shadow-md' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🚀 Innovative Features
            </button>
          </div>
        </motion.div>

        {/* Category Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {activeCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
              className={`group relative inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden ${
                expandedCategory === cat.id
                  ? 'bg-navy text-cream shadow-elevated scale-105'
                  : 'bg-card text-foreground shadow-soft hover:shadow-card hover:-translate-y-1'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${cat.gradient} text-white transition-transform duration-300 group-hover:scale-110`}>
                <cat.icon className="w-4 h-4" />
              </span>
              <span className="hidden sm:inline">{cat.title}</span>
              <span className="sm:hidden text-xs">{cat.title.split(' ').slice(0, 2).join(' ')}</span>
              {expandedCategory === cat.id ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1 opacity-50" />
              )}
              {expandedCategory === cat.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: 'var(--gradient-gold)' }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Stats Grid */}
        {statCategories.map((cat) => (
          expandedCategory === cat.id && (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {showInnovative && (
                <div className="mb-6 text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Conceptual / Experimental Feature
                  </span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {cat.stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 * index }}
                    className="stat-card group cursor-pointer hover:shadow-card hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-navy mb-1">
                      <CountUp value={stat.value} suffix={stat.suffix || ''} prefix={stat.prefix || ''} />
                    </h3>
                    
                    <p className="text-sm font-semibold text-foreground mb-0.5">
                      {stat.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        ))}

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm mb-4">
            Showing {expandedCategory ? statCategories.find(c => c.id === expandedCategory)?.stats.length : 0} parameters 
            from <span className="font-semibold text-foreground">{totalParams}</span> total across {statCategories.length} categories
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {activeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setExpandedCategory(cat.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
                  expandedCategory === cat.id
                    ? 'bg-gold text-navy-dark'
                    : 'bg-muted text-muted-foreground hover:bg-gold/20 hover:text-gold-dark'
                }`}
              >
                {cat.title} ({cat.stats.length})
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
