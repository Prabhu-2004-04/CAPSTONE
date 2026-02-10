import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Clock, CheckCircle, AlertTriangle, Sparkles, Send,
  Eye, Calendar, BookOpen, BarChart3, XCircle, X, File, CheckCheck
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

type AssignmentStatus = 'Submitted' | 'Not Submitted' | 'Late' | 'Evaluated';

interface Assignment {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  type: 'Theory' | 'Practical' | 'Project';
  issueDate: string;
  dueDate: string;
  submissionMode: 'Online' | 'Offline';
  marksAllotted: number;
  status: AssignmentStatus;
  submittedDate?: string;
  marksObtained?: number;
  grade?: string;
  feedback?: string;
  plagiarismPercent?: number;
  resubmissionAllowed: boolean;
  resubmissionCount: number;
  visibility: 'Published' | 'Draft';
  facultyName: string;
}

const assignments: Assignment[] = [
  {
    id: 'ASG-001', courseCode: 'CS301', courseName: 'Data Structures',
    title: 'Binary Tree Implementation', type: 'Practical', issueDate: '2025-01-15',
    dueDate: '2025-02-01', submissionMode: 'Online', marksAllotted: 25,
    status: 'Evaluated', submittedDate: '2025-01-30', marksObtained: 22, grade: 'A',
    feedback: 'Excellent implementation with proper edge case handling.',
    plagiarismPercent: 5, resubmissionAllowed: false, resubmissionCount: 0,
    visibility: 'Published', facultyName: 'Dr. Sharma'
  },
  {
    id: 'ASG-002', courseCode: 'CS302', courseName: 'Database Systems',
    title: 'ER Diagram & Normalization', type: 'Theory', issueDate: '2025-01-20',
    dueDate: '2025-02-10', submissionMode: 'Online', marksAllotted: 20,
    status: 'Submitted', submittedDate: '2025-02-08', plagiarismPercent: 12,
    resubmissionAllowed: true, resubmissionCount: 0,
    visibility: 'Published', facultyName: 'Prof. Gupta'
  },
  {
    id: 'ASG-003', courseCode: 'CS303', courseName: 'Operating Systems',
    title: 'Process Scheduling Simulation', type: 'Project', issueDate: '2025-01-25',
    dueDate: '2025-02-15', submissionMode: 'Online', marksAllotted: 30,
    status: 'Not Submitted', resubmissionAllowed: true, resubmissionCount: 0,
    visibility: 'Published', facultyName: 'Dr. Patel'
  },
  {
    id: 'ASG-004', courseCode: 'CS304', courseName: 'Computer Networks',
    title: 'TCP/IP Protocol Analysis', type: 'Theory', issueDate: '2025-02-01',
    dueDate: '2025-02-05', submissionMode: 'Offline', marksAllotted: 15,
    status: 'Late', submittedDate: '2025-02-07', plagiarismPercent: 8,
    resubmissionAllowed: false, resubmissionCount: 1,
    visibility: 'Published', facultyName: 'Dr. Verma'
  },
  {
    id: 'ASG-005', courseCode: 'CS305', courseName: 'Software Engineering',
    title: 'Agile Methodology Case Study', type: 'Theory', issueDate: '2025-02-05',
    dueDate: '2025-02-20', submissionMode: 'Online', marksAllotted: 20,
    status: 'Not Submitted', resubmissionAllowed: true, resubmissionCount: 0,
    visibility: 'Published', facultyName: 'Prof. Singh'
  },
];

const aiSuggestions = [
  { assignment: 'Process Scheduling Simulation', tip: 'Start with Round Robin algorithm implementation, then extend to SJF and Priority scheduling. Use a modular approach.', priority: 'High' },
  { assignment: 'Agile Methodology Case Study', tip: 'Compare Scrum vs Kanban with a real-world project example. Include sprint metrics and burndown charts.', priority: 'Medium' },
  { assignment: 'ER Diagram & Normalization', tip: 'Your submission looks good! Consider adding a denormalization section for query optimization discussion.', priority: 'Low' },
];

const statusConfig: Record<AssignmentStatus, { color: string; icon: typeof CheckCircle; bg: string }> = {
  'Submitted': { color: 'text-blue-700', icon: Send, bg: 'bg-blue-100' },
  'Not Submitted': { color: 'text-amber-700', icon: AlertTriangle, bg: 'bg-amber-100' },
  'Late': { color: 'text-red-700', icon: XCircle, bg: 'bg-red-100' },
  'Evaluated': { color: 'text-emerald-700', icon: CheckCircle, bg: 'bg-emerald-100' },
};

const Assignments = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNote, setUploadNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pendingAssignments = assignments.filter(a => a.status === 'Not Submitted' || (a.status !== 'Evaluated' && a.resubmissionAllowed));

  const handleUploadSubmit = () => {
    if (!uploadTarget) { toast.error('Please select an assignment'); return; }
    if (!uploadFile) { toast.error('Please select a file to upload'); return; }
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploadOpen(false);
      setUploadFile(null);
      setUploadNote('');
      setUploadTarget('');
      toast.success('Assignment submitted successfully!');
    }, 1500);
  };

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  if (loading) return null;

  const completionRate = Math.round((assignments.filter(a => a.status === 'Submitted' || a.status === 'Evaluated' || a.status === 'Late').length / assignments.length) * 100);
  const avgMarks = Math.round(assignments.filter(a => a.marksObtained).reduce((acc, a) => acc + ((a.marksObtained! / a.marksAllotted) * 100), 0) / assignments.filter(a => a.marksObtained).length);
  const lateCount = assignments.filter(a => a.status === 'Late').length;

  return (
    <DashboardLayout activeItem="Assignments">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">My Assignments</h1>
          <p className="text-muted-foreground mt-1">Track submissions, view evaluations, and get AI-powered suggestions</p>
        </div>
        <Button onClick={() => setUploadOpen(true)} className="bg-gold text-navy hover:bg-gold/90 gap-2">
          <Upload className="w-4 h-4" /> Upload Assignment
        </Button>
      </div>

      {/* Upload Assignment Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Upload Assignment</DialogTitle>
            <DialogDescription>Select an assignment and upload your file (PDF, DOC, ZIP).</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Select Assignment</label>
              <Select value={uploadTarget} onValueChange={setUploadTarget}>
                <SelectTrigger><SelectValue placeholder="Choose assignment..." /></SelectTrigger>
                <SelectContent>
                  {pendingAssignments.map(a => (
                    <SelectItem key={a.id} value={a.id}>{a.courseCode} – {a.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Upload File</label>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.zip,.rar" className="hidden" onChange={e => setUploadFile(e.target.files?.[0] || null)} />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all"
              >
                {uploadFile ? (
                  <div className="flex items-center gap-3">
                    <File className="w-8 h-8 text-gold" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{uploadFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setUploadFile(null); }} className="p-1 hover:bg-muted rounded-full"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to browse or drag & drop</p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, ZIP (Max 20MB)</p>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Notes (Optional)</label>
              <Textarea placeholder="Any comments for your faculty..." value={uploadNote} onChange={e => setUploadNote(e.target.value)} className="resize-none" rows={3} />
            </div>
            <Button onClick={handleUploadSubmit} disabled={uploading} className="w-full bg-gold text-navy hover:bg-gold/90 gap-2">
              {uploading ? <><Clock className="w-4 h-4 animate-spin" /> Submitting...</> : <><CheckCheck className="w-4 h-4" /> Submit Assignment</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Completion Rate', value: `${completionRate}%`, icon: BarChart3 },
          { label: 'Average Score', value: `${avgMarks}%`, icon: CheckCircle },
          { label: 'Pending', value: assignments.filter(a => a.status === 'Not Submitted').length, icon: Clock },
          { label: 'Late Submissions', value: lateCount, icon: AlertTriangle },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card rounded-xl p-5 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <kpi.icon className="w-5 h-5 text-gold" />
              <span className="text-sm text-muted-foreground">{kpi.label}</span>
            </div>
            <p className="text-2xl font-serif font-bold text-foreground">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="assignments" className="w-full">
        <TabsList className="mb-6 bg-card">
          <TabsTrigger value="assignments">All Assignments</TabsTrigger>
          <TabsTrigger value="submissions">Submission Status</TabsTrigger>
          <TabsTrigger value="ai-suggestions">AI Suggestions</TabsTrigger>
        </TabsList>

        {/* All Assignments Tab */}
        <TabsContent value="assignments">
          <div className="space-y-4">
            {assignments.map((a, i) => {
              const sc = statusConfig[a.status];
              return (
                <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl p-5 shadow-soft cursor-pointer hover:ring-1 hover:ring-gold/30 transition-all"
                  onClick={() => setSelectedAssignment(selectedAssignment?.id === a.id ? null : a)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mt-1">
                        <FileText className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{a.title}</p>
                        <p className="text-sm text-muted-foreground">{a.courseCode} • {a.courseName} • {a.facultyName}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {a.dueDate}</span>
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {a.type}</span>
                          <span>Max Marks: {a.marksAllotted}</span>
                          <span>{a.submissionMode}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {a.marksObtained !== undefined && (
                        <span className="text-sm font-bold text-foreground">{a.marksObtained}/{a.marksAllotted}</span>
                      )}
                      <span className={`text-xs px-3 py-1 rounded-full ${sc.bg} ${sc.color} flex items-center gap-1`}>
                        <sc.icon className="w-3 h-3" /> {a.status}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedAssignment?.id === a.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      className="mt-4 pt-4 border-t border-border grid md:grid-cols-2 gap-4"
                    >
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Assignment ID:</span> <span className="font-medium text-foreground">{a.id}</span></p>
                        <p><span className="text-muted-foreground">Issue Date:</span> <span className="font-medium text-foreground">{a.issueDate}</span></p>
                        <p><span className="text-muted-foreground">Due Date:</span> <span className="font-medium text-foreground">{a.dueDate}</span></p>
                        <p><span className="text-muted-foreground">Submission Mode:</span> <span className="font-medium text-foreground">{a.submissionMode}</span></p>
                        {a.submittedDate && <p><span className="text-muted-foreground">Submitted:</span> <span className="font-medium text-foreground">{a.submittedDate}</span></p>}
                        <p><span className="text-muted-foreground">Resubmission:</span> <span className="font-medium text-foreground">{a.resubmissionAllowed ? `Allowed (${a.resubmissionCount} used)` : 'Not Allowed'}</span></p>
                      </div>
                      <div className="space-y-2 text-sm">
                        {a.plagiarismPercent !== undefined && (
                          <div>
                            <span className="text-muted-foreground">Plagiarism Check:</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={a.plagiarismPercent} className="h-2 flex-1" />
                              <span className={`font-medium ${a.plagiarismPercent > 20 ? 'text-red-600' : 'text-emerald-600'}`}>{a.plagiarismPercent}%</span>
                            </div>
                          </div>
                        )}
                        {a.grade && <p><span className="text-muted-foreground">Grade:</span> <span className="font-bold text-foreground text-lg">{a.grade}</span></p>}
                        {a.feedback && (
                          <div>
                            <span className="text-muted-foreground">Faculty Feedback:</span>
                            <p className="mt-1 p-3 bg-muted/50 rounded-lg text-foreground italic">{a.feedback}</p>
                          </div>
                        )}
                      </div>
                      {a.status === 'Not Submitted' && (
                        <div className="md:col-span-2 flex gap-3">
                          <button className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg font-medium text-sm hover:bg-gold/90 transition-colors">
                            <Upload className="w-4 h-4" /> Submit Assignment
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-medium text-sm text-foreground hover:bg-muted transition-colors">
                            <Eye className="w-4 h-4" /> View Details
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Submission Status Tab */}
        <TabsContent value="submissions">
          <div className="bg-card rounded-xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Assignment</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Course</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Due Date</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Submitted</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Plagiarism</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Marks</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => {
                    const sc = statusConfig[a.status];
                    return (
                      <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-mono text-xs text-muted-foreground">{a.id}</td>
                        <td className="p-4 font-medium text-foreground">{a.title}</td>
                        <td className="p-4 text-muted-foreground">{a.courseCode}</td>
                        <td className="p-4 text-muted-foreground">{a.dueDate}</td>
                        <td className="p-4 text-muted-foreground">{a.submittedDate || '—'}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${sc.bg} ${sc.color}`}>{a.status}</span>
                        </td>
                        <td className="p-4">
                          {a.plagiarismPercent !== undefined ? (
                            <span className={a.plagiarismPercent > 20 ? 'text-red-600 font-medium' : 'text-emerald-600'}>{a.plagiarismPercent}%</span>
                          ) : '—'}
                        </td>
                        <td className="p-4 font-medium text-foreground">{a.marksObtained !== undefined ? `${a.marksObtained}/${a.marksAllotted}` : '—'}</td>
                        <td className="p-4 font-bold text-foreground">{a.grade || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* AI Suggestions Tab */}
        <TabsContent value="ai-suggestions">
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-r from-gold/10 to-transparent rounded-xl p-5 border border-gold/20 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-gold" />
                <h3 className="text-lg font-semibold text-foreground">AI-Powered Assignment Insights</h3>
              </div>
              <p className="text-sm text-muted-foreground">Personalized suggestions based on your assignment history, deadlines, and performance patterns.</p>
            </motion.div>

            {aiSuggestions.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-5 shadow-soft border-l-4 border-gold"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-foreground">{s.assignment}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${s.priority === 'High' ? 'bg-red-100 text-red-700' : s.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {s.priority} Priority
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{s.tip}</p>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Assignments;
