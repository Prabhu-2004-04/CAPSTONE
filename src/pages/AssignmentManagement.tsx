import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { motion } from 'framer-motion';
import {
  FileText, CheckCircle, Clock, Eye, Pencil, Send, Plus, BarChart3, Users,
  AlertTriangle, Sparkles
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface StudentSubmission {
  studentId: string;
  name: string;
  status: 'Submitted' | 'Not Submitted' | 'Late';
  submittedDate?: string;
  marksObtained?: number;
  grade?: string;
  plagiarismPercent?: number;
  evaluationStatus: 'Pending' | 'Evaluated';
  feedback?: string;
}

interface TeacherAssignment {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  type: 'Theory' | 'Practical' | 'Project';
  issueDate: string;
  dueDate: string;
  marksAllotted: number;
  visibility: 'Published' | 'Draft';
  totalStudents: number;
  submittedCount: number;
  evaluatedCount: number;
  avgMarks?: number;
  submissions: StudentSubmission[];
}

const gradingRanges = [
  { grade: 'O', range: '90-100', color: 'bg-emerald-500' },
  { grade: 'A+', range: '80-89', color: 'bg-emerald-400' },
  { grade: 'A', range: '70-79', color: 'bg-blue-500' },
  { grade: 'B+', range: '60-69', color: 'bg-blue-400' },
  { grade: 'B', range: '50-59', color: 'bg-amber-500' },
  { grade: 'C', range: '40-49', color: 'bg-amber-400' },
  { grade: 'F', range: '0-39', color: 'bg-red-500' },
];

const initialTeacherAssignments: TeacherAssignment[] = [
  {
    id: 'ASG-001', courseCode: 'CS301', courseName: 'Data Structures',
    title: 'Binary Tree Implementation', type: 'Practical', issueDate: '2025-01-15',
    dueDate: '2025-02-01', marksAllotted: 25, visibility: 'Published',
    totalStudents: 45, submittedCount: 42, evaluatedCount: 40, avgMarks: 19.5,
    submissions: [
      { studentId: 'STU-001', name: 'Aarav Mehta', status: 'Submitted', submittedDate: '2025-01-30', marksObtained: 22, grade: 'A', plagiarismPercent: 5, evaluationStatus: 'Evaluated', feedback: 'Excellent work' },
      { studentId: 'STU-002', name: 'Priya Sharma', status: 'Submitted', submittedDate: '2025-01-29', marksObtained: 24, grade: 'O', plagiarismPercent: 3, evaluationStatus: 'Evaluated', feedback: 'Outstanding implementation' },
      { studentId: 'STU-003', name: 'Rahul Verma', status: 'Late', submittedDate: '2025-02-03', marksObtained: 18, grade: 'B+', plagiarismPercent: 12, evaluationStatus: 'Evaluated', feedback: 'Good but late penalty applied' },
      { studentId: 'STU-004', name: 'Sneha Patel', status: 'Submitted', submittedDate: '2025-01-31', evaluationStatus: 'Pending', plagiarismPercent: 8 },
      { studentId: 'STU-005', name: 'Arjun Kumar', status: 'Not Submitted', evaluationStatus: 'Pending' },
    ],
  },
  {
    id: 'ASG-006', courseCode: 'CS301', courseName: 'Data Structures',
    title: 'Graph Traversal Algorithms', type: 'Project', issueDate: '2025-02-05',
    dueDate: '2025-02-25', marksAllotted: 30, visibility: 'Draft',
    totalStudents: 45, submittedCount: 0, evaluatedCount: 0,
    submissions: [],
  },
];

const AssignmentManagement = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedAssignment, setSelectedAssignment] = useState<TeacherAssignment | null>(null);
  const [activeEvalTab, setActiveEvalTab] = useState('evaluate');
  const [teacherAssignments, setTeacherAssignments] = useState<TeacherAssignment[]>(initialTeacherAssignments);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    courseCode: '',
    courseName: '',
    title: '',
    type: 'Theory' as TeacherAssignment['type'],
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: '',
    marksAllotted: 0,
    visibility: 'Draft' as TeacherAssignment['visibility'],
    totalStudents: 0,
  });

  const createAssignment = () => {
    if (!form.title || !form.courseCode || !form.dueDate || !form.marksAllotted || !form.totalStudents) {
      toast.error('Please fill required fields');
      return;
    }

    const newAssignment: TeacherAssignment = {
      id: `ASG-${Date.now()}`,
      courseCode: form.courseCode,
      courseName: form.courseName,
      title: form.title,
      type: form.type,
      issueDate: form.issueDate,
      dueDate: form.dueDate,
      marksAllotted: form.marksAllotted,
      visibility: form.visibility,
      totalStudents: form.totalStudents,
      submittedCount: 0,
      evaluatedCount: 0,
      submissions: [],
    } as TeacherAssignment;

    setTeacherAssignments((s) => [newAssignment, ...s]);
    toast.success('Assignment created');
    setCreateOpen(false);
    setForm({ courseCode: '', courseName: '', title: '', type: 'Theory', issueDate: new Date().toISOString().slice(0, 10), dueDate: '', marksAllotted: 0, visibility: 'Draft', totalStudents: 0 });
  };

  // Evaluation modal state
  const [evalOpen, setEvalOpen] = useState(false);
  const [evalMode, setEvalMode] = useState<'edit' | 'view'>('edit');
  const [evalTarget, setEvalTarget] = useState<{ assignmentId: string; studentId: string } | null>(null);
  const [evalForm, setEvalForm] = useState({ marksObtained: 0, grade: '', feedback: '' });

  const openEvaluate = (assignmentId: string, submission: StudentSubmission) => {
    setEvalMode('edit');
    setEvalTarget({ assignmentId, studentId: submission.studentId });
    setEvalForm({ marksObtained: submission.marksObtained ?? 0, grade: submission.grade ?? '', feedback: submission.feedback ?? '' });
    setEvalOpen(true);
  };

  const openView = (assignmentId: string, submission: StudentSubmission) => {
    setEvalMode('view');
    setEvalTarget({ assignmentId, studentId: submission.studentId });
    setEvalForm({ marksObtained: submission.marksObtained ?? 0, grade: submission.grade ?? '', feedback: submission.feedback ?? '' });
    setEvalOpen(true);
  };

  const saveEvaluation = () => {
    if (!evalTarget) return;
    const updatedAssignments = teacherAssignments.map(a => {
      if (a.id !== evalTarget.assignmentId) return a;
      let evaluatedCount = a.evaluatedCount || 0;
      const submissions = a.submissions.map(s => {
        if (s.studentId !== evalTarget.studentId) return s;
        if (s.evaluationStatus !== 'Evaluated') evaluatedCount += 1;
        return {
          ...s,
          marksObtained: evalForm.marksObtained,
          grade: evalForm.grade,
          feedback: evalForm.feedback,
          evaluationStatus: 'Evaluated' as const,
        } as StudentSubmission;
      });
      const marks = submissions.filter(x => x.marksObtained !== undefined).map(x => x.marksObtained || 0);
      const avgMarks = marks.length ? Math.round((marks.reduce((acc, v) => acc + v, 0) / marks.length) * 10) / 10 : undefined;
      return { ...a, submissions, evaluatedCount, avgMarks } as TeacherAssignment;
    });

    setTeacherAssignments(updatedAssignments);
    const updatedSelected = updatedAssignments.find(a => a.id === evalTarget.assignmentId) || null;
    setSelectedAssignment(updatedSelected);
    setEvalOpen(false);
    toast.success('Evaluation saved');
  };

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <DashboardLayout activeItem="Assignment Management">
      <h1 className="text-2xl font-serif font-bold text-foreground mb-2">Assignment Management</h1>
      <p className="text-muted-foreground mb-6">Create, evaluate, grade, and publish assignments</p>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 bg-card">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="evaluate">Evaluate</TabsTrigger>
          <TabsTrigger value="grading">Grading Range</TabsTrigger>
          <TabsTrigger value="publish">Publish</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Assignments', value: teacherAssignments.length, icon: FileText },
              { label: 'Published', value: teacherAssignments.filter(a => a.visibility === 'Published').length, icon: Send },
              { label: 'Pending Evaluation', value: teacherAssignments.reduce((acc, a) => acc + a.submissions.filter(s => s.evaluationStatus === 'Pending').length, 0), icon: Clock },
              { label: 'Total Students', value: teacherAssignments[0]?.totalStudents || 0, icon: Users },
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

          <div className="space-y-4">
              {teacherAssignments.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl p-5 shadow-soft"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-foreground">{a.title}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${a.visibility === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {a.visibility}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{a.courseCode} • {a.courseName} • {a.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">Due: {a.dueDate} • Max Marks: {a.marksAllotted}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm text-muted-foreground">{a.submittedCount}/{a.totalStudents} submitted</p>
                    <Progress value={(a.submittedCount / a.totalStudents) * 100} className="h-2 w-32" />
                    <p className="text-xs text-muted-foreground">{a.evaluatedCount} evaluated{a.avgMarks ? ` • Avg: ${a.avgMarks}` : ''}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button onClick={() => setCreateOpen(true)} className="mt-6 flex items-center gap-2 px-5 py-3 bg-gold text-navy rounded-lg font-medium text-sm hover:bg-gold/90 transition-colors">
            <Plus className="w-4 h-4" /> Create New Assignment
          </button>

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-serif">Create Assignment</DialogTitle>
                <DialogDescription>Fill assignment details and save.</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Course Code</label>
                  <Input value={form.courseCode} onChange={e => setForm({ ...form, courseCode: e.target.value })} placeholder="CS301" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Course Name</label>
                  <Input value={form.courseName} onChange={e => setForm({ ...form, courseName: e.target.value })} placeholder="Data Structures" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground block mb-1">Title</label>
                  <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Assignment Title" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Type</label>
                  <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Theory">Theory</SelectItem>
                      <SelectItem value="Practical">Practical</SelectItem>
                      <SelectItem value="Project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Visibility</label>
                  <Select value={form.visibility} onValueChange={v => setForm({ ...form, visibility: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Issue Date</label>
                  <Input type="date" value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Due Date</label>
                  <Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Max Marks</label>
                  <Input type="number" value={form.marksAllotted || ''} onChange={e => setForm({ ...form, marksAllotted: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-1">Total Students</label>
                  <Input type="number" value={form.totalStudents || ''} onChange={e => setForm({ ...form, totalStudents: Number(e.target.value) })} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground block mb-1">Description (optional)</label>
                  <Textarea placeholder="Brief assignment description" />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={createAssignment} className="bg-gold text-navy hover:bg-gold/90">Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* Evaluate Tab */}
        <TabsContent value="evaluate">
          <div className="mb-4">
            <label className="text-sm text-muted-foreground mb-2 block">Select Assignment</label>
            <div className="flex gap-2 flex-wrap">
              {teacherAssignments.filter(a => a.visibility === 'Published').map(a => (
                <button key={a.id} onClick={() => setSelectedAssignment(a)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${selectedAssignment?.id === a.id ? 'border-gold bg-gold/10 text-foreground' : 'border-border text-muted-foreground hover:border-gold/50'}`}>
                  {a.title}
                </button>
              ))}
            </div>
          </div>

          {selectedAssignment && (
            <div className="bg-card rounded-xl shadow-soft overflow-hidden">
              <div className="p-4 border-b border-border bg-muted/30">
                <h3 className="font-medium text-foreground">{selectedAssignment.title} — Student Submissions</h3>
                <p className="text-sm text-muted-foreground">{selectedAssignment.submittedCount}/{selectedAssignment.totalStudents} submitted • {selectedAssignment.evaluatedCount} evaluated</p>
              </div>
              {/* Evaluation Dialog */}
              <Dialog open={evalOpen} onOpenChange={setEvalOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="font-serif">{evalMode === 'view' ? 'View Evaluation' : 'Evaluate Student'}</DialogTitle>
                    <DialogDescription>{selectedAssignment?.title}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-3 mt-2">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Marks Obtained</label>
                      <Input type="number" value={evalForm.marksObtained || ''} onChange={e => setEvalForm({ ...evalForm, marksObtained: Number(e.target.value) })} disabled={evalMode === 'view'} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Grade</label>
                      <Select value={evalForm.grade} onValueChange={v => setEvalForm({ ...evalForm, grade: v })}>
                        <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                        <SelectContent>
                          {gradingRanges.map(g => (<SelectItem key={g.grade} value={g.grade}>{g.grade}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">Feedback</label>
                      <Textarea value={evalForm.feedback} onChange={e => setEvalForm({ ...evalForm, feedback: e.target.value })} disabled={evalMode === 'view'} />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button variant="ghost" onClick={() => setEvalOpen(false)}>Close</Button>
                      {evalMode === 'edit' && <Button onClick={saveEvaluation} className="bg-gold text-navy hover:bg-gold/90">Save</Button>}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium text-muted-foreground">Student</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Plagiarism</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Marks</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Grade</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Eval Status</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAssignment.submissions.map((s) => (
                      <tr key={s.studentId} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="p-3">
                          <p className="font-medium text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.studentId}</p>
                        </td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'Submitted' ? 'bg-blue-100 text-blue-700' : s.status === 'Late' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{s.submittedDate || '—'}</td>
                        <td className="p-3">
                          {s.plagiarismPercent !== undefined ? (
                            <span className={s.plagiarismPercent > 20 ? 'text-red-600 font-medium' : 'text-emerald-600'}>{s.plagiarismPercent}%</span>
                          ) : '—'}
                        </td>
                        <td className="p-3 font-medium text-foreground">{s.marksObtained !== undefined ? `${s.marksObtained}/${selectedAssignment.marksAllotted}` : '—'}</td>
                        <td className="p-3 font-bold text-foreground">{s.grade || '—'}</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${s.evaluationStatus === 'Evaluated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {s.evaluationStatus}
                          </span>
                        </td>
                        <td className="p-3">
                          {s.evaluationStatus === 'Pending' && s.status !== 'Not Submitted' ? (
                            <button onClick={() => openEvaluate(selectedAssignment.id, s)} className="flex items-center gap-1 px-3 py-1.5 bg-gold text-navy rounded-lg text-xs font-medium hover:bg-gold/90 transition-colors">
                              <Pencil className="w-3 h-3" /> Evaluate
                            </button>
                          ) : s.evaluationStatus === 'Evaluated' ? (
                            <button onClick={() => openView(selectedAssignment.id, s)} className="flex items-center gap-1 px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors">
                              <Eye className="w-3 h-3" /> View
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Grading Range Tab */}
        <TabsContent value="grading">
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4">Grading Scale</h3>
              <div className="space-y-3">
                {gradingRanges.map((g) => (
                  <div key={g.grade} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg ${g.color} flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{g.grade}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">Grade {g.grade}</span>
                        <span className="text-sm text-muted-foreground">{g.range} marks</span>
                      </div>
                      <Progress value={parseInt(g.range.split('-')[1])} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-foreground mb-4">Grade Distribution — Binary Tree Implementation</h3>
              <div className="space-y-3">
                {[
                  { grade: 'O', count: 8, percent: 20 },
                  { grade: 'A+', count: 12, percent: 30 },
                  { grade: 'A', count: 10, percent: 25 },
                  { grade: 'B+', count: 5, percent: 12.5 },
                  { grade: 'B', count: 3, percent: 7.5 },
                  { grade: 'C', count: 1, percent: 2.5 },
                  { grade: 'F', count: 1, percent: 2.5 },
                ].map((d) => (
                  <div key={d.grade} className="flex items-center gap-3">
                    <span className="w-8 text-sm font-bold text-foreground">{d.grade}</span>
                    <div className="flex-1 bg-muted/50 rounded-full h-6 relative overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${d.percent}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full bg-gold/70 rounded-full" />
                    </div>
                    <span className="text-sm text-muted-foreground w-20 text-right">{d.count} ({d.percent}%)</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </TabsContent>

        {/* Publish Tab */}
        <TabsContent value="publish">
          <div className="space-y-4">
            {teacherAssignments.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl p-5 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <FileText className="w-5 h-5 text-gold" />
                      <p className="font-medium text-foreground">{a.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">{a.courseCode} • {a.courseName} • Due: {a.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full ${a.visibility === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {a.visibility}
                    </span>
                    {a.visibility === 'Draft' ? (
                      <button className="flex items-center gap-2 px-4 py-2 bg-gold text-navy rounded-lg font-medium text-sm hover:bg-gold/90 transition-colors">
                        <Send className="w-4 h-4" /> Publish Now
                      </button>
                    ) : (
                      <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-medium text-sm text-foreground hover:bg-muted transition-colors">
                        <Eye className="w-4 h-4" /> Unpublish
                      </button>
                    )}
                  </div>
                </div>
                {a.visibility === 'Draft' && (
                  <div className="mt-3 ml-8 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>This assignment is not visible to students. Publish to make it available.</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AssignmentManagement;
