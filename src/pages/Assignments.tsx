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
import { supabase } from '@/integrations/supabase/client';

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
  fileUrl?: string;
  marksObtained?: number;
  grade?: string;
  feedback?: string;
  plagiarismPercent?: number;
  resubmissionAllowed: boolean;
  resubmissionCount: number;
  visibility: 'Published' | 'Draft';
  facultyName: string;
}


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
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  // load published assignments and current user's submissions
  const loadAssignments = async () => {
    if (!user) return;
    const { data: asgs, error: asgError } = await supabase
      .from('assignments')
      .select('*')
      .eq('visibility', 'Published')
      .order('due_date', { ascending: true });
    if (asgError) {
      console.error('load assignments', asgError);
      return;
    }

    const { data: subs, error: subError } = await supabase
      .from('submissions')
      .select('*')
      .eq('student_id', user.id);
    if (subError) {
      console.error('load submissions', subError);
    }

    const merged = (asgs || []).map(a => {
      const submission = (subs || []).find(s => s.assignment_id === a.id);
      let status: AssignmentStatus = 'Not Submitted';
      if (submission) {
        status = submission.status === 'Late' ? 'Late' :
          submission.evaluation_status === 'Evaluated' ? 'Evaluated' : 'Submitted';
      }
      return {
        id: a.id,
        courseCode: a.course_code,
        courseName: a.course_name,
        title: a.title,
        type: a.type as any,
        issueDate: a.issue_date,
        dueDate: a.due_date,
        submissionMode: 'Online',
        marksAllotted: a.marks_allotted,
        status,
        submittedDate: submission?.submitted_at?.slice(0, 10) ?? undefined,
        fileUrl: submission?.file_url,
        marksObtained: submission?.marks_obtained ?? undefined,
        grade: submission?.grade ?? undefined,
        feedback: submission?.feedback ?? undefined,
        plagiarismPercent: submission?.plagiarism_percent ?? undefined,
        resubmissionAllowed: submission ? submission.resubmission_count < 1 : true,
        resubmissionCount: submission?.resubmission_count ?? 0,
        visibility: a.visibility as any,
        facultyName: ''
      } as Assignment;
    });

    setAssignments(merged);
  };

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadNote, setUploadNote] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Assessment state
  const [aiAssessmentOpen, setAiAssessmentOpen] = useState(false);
  const [aiAssessmentTarget, setAiAssessmentTarget] = useState<Assignment | null>(null);
  const [aiAssessment, setAiAssessment] = useState<{
    marks: number;
    grade: string;
    feedback: string;
    strengths: string[];
    improvements: string[];
    score: number;
  } | null>(null);
  const [generatingAssessment, setGeneratingAssessment] = useState(false);

  const pendingAssignments = assignments.filter(a => a.status === 'Not Submitted' || (a.status !== 'Evaluated' && a.resubmissionAllowed));

  const handleUploadSubmit = async () => {
  if (!uploadTarget) { toast.error('Please select an assignment'); return; }
  if (!uploadFile) { toast.error('Please select a file to upload'); return; }
  if (!user) { toast.error('Not authenticated'); return; }
  setUploading(true);

  try {

    const path = `${uploadTarget}/${user.id}/${uploadFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from('assignments')
      .upload(path, uploadFile, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage
      .from('assignments')
      .getPublicUrl(path);

    const publicUrl = publicData.publicUrl;

    const { error: insertError } = await supabase
      .from('submissions')
      .upsert({
        assignment_id: uploadTarget,
        student_id: user.id,
        file_url: publicUrl,
        note: uploadNote,
        status: 'Submitted',
        submitted_at: new Date().toISOString(),
      }, { onConflict: 'assignment_id,student_id' });

    if (insertError) throw insertError;

    toast.success('Assignment submitted successfully!');
    await loadAssignments();

  } catch (err: any) {
    console.error(err);
    toast.error('Upload failed');
  } finally {
    setUploading(false);
    setUploadOpen(false);
    setUploadFile(null);
    setUploadNote('');
    setUploadTarget('');
  }
};

  const generateAiAssessment = async (assignment: Assignment) => {
    setGeneratingAssessment(true);
    setAiAssessment(null);

    try {
      // Mock AI assessment generation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      const maxMarks = assignment.marksAllotted;
      const baseScore = Math.floor(Math.random() * 30) + 70; // 70-100 base score
      const aiMarks = Math.round((baseScore / 100) * maxMarks);

      const grades = ['O', 'A+', 'A', 'B+', 'B', 'C'];
      const gradeIndex = Math.floor((aiMarks / maxMarks) * grades.length);
      const aiGrade = grades[Math.min(gradeIndex, grades.length - 1)];

      const strengths = [
        'Good understanding of core concepts',
        'Well-structured submission',
        'Clear and concise explanations',
        'Proper use of technical terminology',
        'Logical flow of ideas'
      ].slice(0, Math.floor(Math.random() * 3) + 2);

      const improvements = [
        'Add more practical examples',
        'Include references and citations',
        'Deepen technical analysis',
        'Improve formatting and presentation',
        'Add conclusion/summary section'
      ].slice(0, Math.floor(Math.random() * 3) + 2);

      const assessment = {
        marks: aiMarks,
        grade: aiGrade,
        score: baseScore,
        feedback: `AI Assessment Complete!\n\nYour submission demonstrates a ${baseScore >= 85 ? 'strong' : baseScore >= 75 ? 'good' : 'developing'} understanding of the assignment requirements. The AI analysis suggests this work would likely receive around ${aiMarks}/${maxMarks} marks (${aiGrade} grade) based on current quality metrics.`,
        strengths,
        improvements
      };

      setAiAssessment(assessment);
      toast.success('AI assessment generated successfully!');
    } catch (error) {
      console.error('AI assessment error:', error);
      toast.error('Failed to generate AI assessment');
    } finally {
      setGeneratingAssessment(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadAssignments();

      // subscribe to assignments table using new channel API
      const channel = supabase
        .channel('public:assignments')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'assignments' }, payload => {
          if (payload.new.visibility === 'Published') loadAssignments();
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'assignments' }, payload => {
          if (payload.new.visibility === 'Published') loadAssignments();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  // reload assignments whenever upload dialog is opened, to guarantee fresh list
  useEffect(() => {
    if (uploadOpen && user) {
      loadAssignments();
    }
  }, [uploadOpen, user]);

  if (loading) return null;

  const completionRate = Math.round((assignments.filter(a => a.status === 'Submitted' || a.status === 'Evaluated' || a.status === 'Late').length / assignments.length) * 100);
  const avgMarks = Math.round(assignments.filter(a => a.marksObtained).reduce((acc, a) => acc + ((a.marksObtained! / a.marksAllotted) * 100), 0) / assignments.filter(a => a.marksObtained).length);
  const lateCount = assignments.filter(a => a.status === 'Late').length;

  return (
    <DashboardLayout activeItem="Assignments">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">My Assignments</h1>
          <p className="text-muted-foreground mt-1">Track submissions, view evaluations, and get AI-powered assessments and feedback</p>
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

      {/* AI Assessment Dialog */}
      <Dialog open={aiAssessmentOpen} onOpenChange={(open) => {
        setAiAssessmentOpen(open);
        if (!open) {
          setAiAssessment(null);
          setAiAssessmentTarget(null);
        }
      }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI Assessment - {aiAssessmentTarget?.title}
            </DialogTitle>
            <DialogDescription>
              Get an AI-powered evaluation of your submission before final grading
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {!aiAssessment ? (
              <div className="text-center py-8">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Ready for AI Assessment</h3>
                <p className="text-muted-foreground mb-6">
                  Our AI will analyze your submission and provide detailed feedback, 
                  suggested marks, and improvement recommendations.
                </p>
                <Button 
                  onClick={() => aiAssessmentTarget && generateAiAssessment(aiAssessmentTarget)}
                  disabled={generatingAssessment}
                  className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                >
                  {generatingAssessment ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      Analyzing Submission...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate AI Assessment
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Assessment Summary */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Assessment Summary</h3>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">{aiAssessment.marks}/{aiAssessmentTarget?.marksAllotted}</p>
                      <p className="text-sm text-muted-foreground">Suggested Grade: {aiAssessment.grade}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Quality Score</span>
                      <span>{aiAssessment.score}%</span>
                    </div>
                    <Progress value={aiAssessment.score} className="h-2" />
                  </div>
                  <p className="text-sm text-foreground">{aiAssessment.feedback}</p>
                </div>

                {/* Strengths */}
                <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-lg">
                  <h4 className="font-medium text-emerald-900 dark:text-emerald-100 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Strengths Identified
                  </h4>
                  <ul className="space-y-2">
                    {aiAssessment.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-200">
                        <span className="text-emerald-600 mt-1">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {aiAssessment.improvements.map((improvement, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200">
                        <span className="text-amber-600 mt-1">•</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 AI Recommendations</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Use this assessment to improve your work before the final deadline. 
                    Consider revising based on the suggestions above to potentially achieve a higher grade.
                  </p>
                </div>
              </div>
            )}
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
          <TabsTrigger value="ai-assessment">AI Assessment</TabsTrigger>
          <TabsTrigger value="ai-feedback">AI Feedback</TabsTrigger>
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
                        {a.fileUrl && (
                          <p><span className="text-muted-foreground">Your File:</span> <a href={a.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a></p>
                        )}
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
                        {/* AI Feedback Section */}
                        {a.status === 'Submitted' || a.status === 'Evaluated' ? (
                          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">AI-Powered Feedback</span>
                            </div>
                            <div className="space-y-3 text-sm">
                              <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-md">
                                <p className="text-gray-700 dark:text-gray-300">
                                  <strong>Strengths:</strong> Your submission demonstrates good understanding of the core concepts. 
                                  The structure is logical and well-organized.
                                </p>
                              </div>
                              <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-md">
                                <p className="text-gray-700 dark:text-gray-300">
                                  <strong>Areas for Improvement:</strong> Consider adding more detailed examples and 
                                  practical applications to strengthen your analysis.
                                </p>
                              </div>
                              <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-md">
                                <p className="text-gray-700 dark:text-gray-300">
                                  <strong>Next Steps:</strong> Focus on implementing the concepts in a real-world scenario 
                                  and document your learning process.
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                      {a.status === 'Submitted' && (
                        <div className="md:col-span-2 flex gap-3">
                          <button 
                            onClick={() => {
                              setAiAssessmentTarget(a);
                              setAiAssessmentOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 transition-colors"
                          >
                            <Sparkles className="w-4 h-4" /> Get AI Assessment
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg font-medium text-sm text-foreground hover:bg-muted transition-colors">
                            <Eye className="w-4 h-4" /> View Submission
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

        {/* AI Assessment Tab */}
        <TabsContent value="ai-assessment">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">AI Assessment Center</h3>
              <p className="text-muted-foreground">Get detailed AI-powered evaluation of your submitted assignments</p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2">How AI Assessment Works</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium text-foreground mb-1">📊 Quality Analysis</p>
                      <p>AI analyzes content quality, structure, and technical accuracy</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">🎯 Grade Prediction</p>
                      <p>Get suggested marks and grades based on submission quality</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">💡 Improvement Tips</p>
                      <p>Receive specific recommendations to improve your work</p>
                    </div>
                    <div>
                      <p className="font-medium text-foreground mb-1">📈 Learning Insights</p>
                      <p>Understand your strengths and areas for development</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Available Assessments</h4>
              {assignments.filter(a => a.status === 'Submitted').length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Submit assignments to get AI assessments</p>
                </div>
              ) : (
                assignments.filter(a => a.status === 'Submitted').map((a, i) => (
                  <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-xl p-5 shadow-soft border border-purple-100 dark:border-purple-900"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{a.title}</p>
                          <p className="text-sm text-muted-foreground">{a.courseCode} • Submitted: {a.submittedDate}</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          setAiAssessmentTarget(a);
                          setAiAssessmentOpen(true);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Assess Now
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* AI Feedback Tab */}
        <TabsContent value="ai-feedback">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">AI-Powered Learning Assistant</h3>
              <p className="text-muted-foreground">Get personalized feedback and improvement suggestions for your assignments</p>
            </div>

            {assignments.filter(a => a.status === 'Submitted' || a.status === 'Evaluated').length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Submit some assignments to receive AI feedback</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {assignments.filter(a => a.status === 'Submitted' || a.status === 'Evaluated').map((a, i) => (
                  <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-card rounded-xl p-6 shadow-soft border border-blue-100 dark:border-blue-900"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-1">{a.title}</h4>
                        <p className="text-sm text-muted-foreground">{a.courseCode} • Submitted: {a.submittedDate}</p>
                        {a.marksObtained && (
                          <p className="text-sm font-medium text-foreground mt-1">Score: {a.marksObtained}/{a.marksAllotted} ({a.grade})</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 p-4 rounded-lg">
                        <h5 className="font-medium text-emerald-900 dark:text-emerald-100 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Strengths
                        </h5>
                        <p className="text-sm text-emerald-800 dark:text-emerald-200">
                          Your submission demonstrates a solid understanding of the core concepts. The structure is logical, 
                          and you've shown good analytical thinking in your approach.
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 rounded-lg">
                        <h5 className="font-medium text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Areas for Improvement
                        </h5>
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          Consider adding more practical examples and real-world applications. The technical depth could be 
                          enhanced with additional research and references.
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Learning Recommendations
                        </h5>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Review advanced concepts in {a.courseName}</li>
                          <li>• Practice implementing similar problems</li>
                          <li>• Join study groups for peer learning</li>
                          <li>• Schedule office hours with faculty</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
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
