import * as React from 'react';
import { 
  FileSpreadsheet, 
  Clock, 
  BookOpen, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Play, 
  ArrowRight, 
  Home, 
  ChevronRight, 
  ChevronLeft,
  Award,
  Bookmark,
  Send,
  Menu,
  X,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Sparkles,
  RotateCcw,
  Compass
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge, 
  PageContainer,
  EmptyState,
  Breadcrumbs,
  Button,
  Modal,
  Separator
} from '../../components/ui/CustomComponents';
import { initialTests, initialQuestions } from '../../data';
import { Test, TestAttempt, Question } from '../../types';

// --- LOGICAL PROGRESS BAR FOR SHADCN FEEL ---
function LocalProgress({ value, className = '', color = 'bg-primary' }: { value: number; className?: string; color?: string }) {
  return (
    <div className={`w-full bg-secondary dark:bg-muted rounded-full h-2 overflow-hidden ${className}`}>
      <div 
        className={`${color} h-2 rounded-full transition-all duration-300 ease-out`} 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

const getTestMeta = (id: string) => {
  switch(id) {
    case 'test-1':
      return { type: 'Mock Exam', deadline: 'May 30, 2026', badgeColor: 'bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' };
    case 'test-2':
      return { type: 'Practice Drill', deadline: 'June 05, 2026', badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' };
    case 'test-3':
      return { type: 'Syllabus Check', deadline: 'June 12, 2026', badgeColor: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' };
    default:
      return { type: 'Continuous Assessment', deadline: 'June 20, 2026', badgeColor: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground' };
  }
};

const getAttemptForTestId = (testId: string) => {
  try {
    const saved = localStorage.getItem('last_attempt_' + testId);
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  // Cross reference pre-loaded mock history records
  const initialTestAttempts = [
    {
      id: 'att-1',
      testId: 'test-1',
      testTitle: 'CCC Computer Fundamentals & Windows Mock Test',
      studentId: 'st-6', // Riya Sen
      score: 80,
      maxScore: 100,
      correctCount: 4,
      wrongCount: 1,
      skippedCount: 0,
      submittedAt: '2026-05-20',
      durationSeconds: 1240,
      answers: { 0: 1, 1: 2, 2: 0, 3: 0, 4: 1 }
    }
  ];

  const attempt = initialTestAttempts.find(att => att.testId === testId && att.studentId === 'st-6');
  if (attempt) return attempt;

  return null;
};

interface StudentTestsProps {
  onNavigate: (path: string) => void;
  subView?: 'list' | 'intro' | 'attempt' | 'result';
  testIdParam?: string;
}

export default function StudentTests({ onNavigate, subView = 'list', testIdParam }: StudentTestsProps) {
  const [activeTestId, setActiveTestId] = React.useState<string | undefined>(testIdParam || 'test-1');
  const [activeTab, setActiveTab] = React.useState<'pending' | 'completed'>('pending');

  // Core Attempt States
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, number>>({});
  const [markedForReview, setMarkedForReview] = React.useState<Record<number, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = React.useState(0);
  const [elapsedDuration, setElapsedDuration] = React.useState(0);
  
  // Dialog confirmation modal, drawer sheets, and results accordion state
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = React.useState(false);
  const [isPaletteDrawerOpen, setIsPaletteDrawerOpen] = React.useState(false);
  const [openAccordions, setOpenAccordions] = React.useState<Record<number, boolean>>({ 0: true });

  // Find active test & slice its dummy questions
  const activeTest = initialTests.find(t => t.id === (testIdParam || activeTestId));
  const testQuestions = initialQuestions.slice(0, activeTest?.questionCount || 5);

  // Load results from local storage to survive unmounting transitions
  const [simulatedAttempt, setSimulatedAttempt] = React.useState<TestAttempt | undefined>(() => {
    try {
      const saved = localStorage.getItem('last_attempt_' + (testIdParam || activeTestId));
      return saved ? JSON.parse(saved) : undefined;
    } catch {
      return undefined;
    }
  });

  const [isAutoSubmitted, setIsAutoSubmitted] = React.useState<boolean>(() => {
    return localStorage.getItem('auto_submitted_' + (testIdParam || activeTestId)) === 'true';
  });

  // Countdown timer clock
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (subView === 'attempt' && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
        setElapsedDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [subView, timeRemainingSeconds]);

  // Launch initial assessment state when entering attempt
  React.useEffect(() => {
    if (subView === 'attempt' && activeTest) {
      setTimeRemainingSeconds(activeTest.durationMinutes * 60);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setMarkedForReview({});
      setElapsedDuration(0);
      setIsSubmitDialogOpen(false);
      setIsPaletteDrawerOpen(false);
      localStorage.removeItem('auto_submitted_' + activeTest.id);
      setIsAutoSubmitted(false);
    }
  }, [subView, activeTestId]);

  const handleStartAttempt = () => {
    if (activeTest) {
      onNavigate(`/student/tests/${activeTest.id}/attempt`);
    }
  };

  const handleOptionSelect = (optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIdx
    }));
  };

  const handleToggleReview = () => {
    setMarkedForReview(prev => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex]
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Automated locking on time constraints expiration
  const handleAutoSubmit = () => {
    if (!activeTest) return;
    localStorage.setItem('auto_submitted_' + activeTest.id, 'true');
    setIsAutoSubmitted(true);
    triggerFinalSubmission(true);
  };

  const triggerFinalSubmission = (isTimeout = false) => {
    if (!activeTest) return;

    // Calculate score metrics
    let corrects = 0;
    let wrongs = 0;
    let skipped = 0;

    testQuestions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      if (chosen === undefined) {
        skipped++;
      } else if (chosen === q.correctOptionIdx) {
        corrects++;
      } else {
        wrongs++;
      }
    });

    const calculatedScore = Math.round((corrects / testQuestions.length) * activeTest.totalMarks);

    const resultRecord: TestAttempt = {
      id: `sim-att-${Date.now()}`,
      testId: activeTest.id,
      testTitle: activeTest.title,
      studentId: 'st-6', // Default matching Sen student roster
      score: calculatedScore,
      maxScore: activeTest.totalMarks,
      correctCount: corrects,
      wrongCount: wrongs,
      skippedCount: skipped,
      submittedAt: new Date().toISOString().split('T')[0],
      durationSeconds: elapsedDuration || 45,
      answers: selectedAnswers
    };

    localStorage.setItem('last_attempt_' + activeTest.id, JSON.stringify(resultRecord));
    setSimulatedAttempt(resultRecord);
    
    setIsSubmitDialogOpen(false);
    onNavigate(`/student/tests/${activeTest.id}/result`);
  };

  // Format countdown clock nicely
  const formatTimerString = (secondsCount: number) => {
    const mm = Math.floor(secondsCount / 60);
    const ss = secondsCount % 60;
    return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
  };

  // Dynamic progress percentage logic
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = testQuestions.length > 0 ? Math.round((answeredCount / testQuestions.length) * 100) : 0;

  return (
    <div className="space-y-6 font-sans antialiased pb-12">
      
      {/* Standard Top Navigation Breadcrumbs (Shown on non-attempt screens for clear structure) */}
      {subView !== 'attempt' && (
        <div className="mb-2">
          <Breadcrumbs
            items={[
              { label: 'Exams Portal', onClick: () => onNavigate('/student/tests') },
              ...(subView === 'intro' ? [{ label: 'Guidelines Overview' }] : []),
              ...(subView === 'result' ? [{ label: 'Performance Report' }] : []),
            ]}
          />
        </div>
      )}

      {/* --- SUBVIEW 1: MOCK EXAMS LIST --- */}
      {subView === 'list' && (() => {
        // Evaluate dynamic completion indicators
        const allTestsForGroup = initialTests;
        const pendingList = allTestsForGroup.filter(t => getAttemptForTestId(t.id) === null && t.status === 'active');
        const completedList = allTestsForGroup.filter(t => getAttemptForTestId(t.id) !== null);

        const totalCount = allTestsForGroup.filter(t => t.status === 'active').length;
        const compCount = completedList.length;
        const progressPercentage = totalCount > 0 ? Math.round((compCount / totalCount) * 100) : 0;

        const currentDisplayList = activeTab === 'pending' ? pendingList : completedList;

        return (
          <PageContainer className="max-w-5xl space-y-6">
            
            {/* Top Header & Motivational Area */}
            <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/15 border border-border rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="success" className="text-[10px] uppercase font-bold tracking-wider font-mono py-0.5">
                      Batch: CCC Morning Batch A
                    </Badge>
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-muted-foreground font-mono">Real-time Verified</span>
                  </div>
                  <h1 className="text-2xl sm:text-3.5xl font-black text-foreground tracking-tight font-sans">
                    Keep pressing forward, Riya! 📈
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                    Unlock your maximum score potential! Complete your assigned CCC and DCA assessments to measure mock readiness, analyze learning gaps, and review answer manuals.
                  </p>
                </div>

                {/* Progress Card */}
                <div className="bg-card/90 backdrop-blur-xs border border-border p-4 rounded-xl w-full md:w-80 space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-bold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-primary" />
                      Syllabus Drill Progress
                    </span>
                    <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded text-[11px] font-extrabold">
                      {compCount} of {totalCount} Completed
                    </span>
                  </div>
                  <div className="space-y-1">
                    <LocalProgress value={progressPercentage} color="bg-primary" />
                    <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                      <span>Beginner Basics</span>
                      <span>Target Exam Ready ({progressPercentage}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Trigger Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div className="flex gap-1.5 bg-muted p-1 rounded-xl self-start">
                {[
                  { id: 'pending', label: 'Pending Tests', count: pendingList.length },
                  { id: 'completed', label: 'Completed Tests', count: completedList.length }
                ].map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2 text-xs font-black rounded-lg cursor-pointer transition-all flex items-center gap-2 ${
                        isActive 
                          ? 'bg-background text-foreground shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-background text-muted-foreground border'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] font-semibold text-muted-foreground font-mono bg-muted/20 px-3 py-1 rounded-md border border-border/40">
                User: bk6500416@gmail.com
              </div>
            </div>

            {/* List Viewport cards */}
            {currentDisplayList.length === 0 ? (
              <EmptyState 
                icon={FileSpreadsheet}
                title={activeTab === 'pending' ? "Hooray! No pending assessments." : "No completed mock tests yet."}
                description={activeTab === 'pending' 
                  ? "You have answered all assigned drills. Keep up this magnificent performance or check your statistics!" 
                  : "Start and submit a test from the pending tab to inspect your answers breakdown and accuracy curve."
                }
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {currentDisplayList.map((test) => {
                  const meta = getTestMeta(test.id);
                  const attemptObj = getAttemptForTestId(test.id);

                  return (
                    <Card 
                      key={test.id} 
                      className={`border border-border/80 hover:border-primary/40 transition-all flex flex-col justify-between overflow-hidden relative ${
                        activeTab === 'completed' ? 'bg-card/50' : 'bg-card'
                      }`}
                    >
                      {/* Card Header information row */}
                      <div className="p-5 pb-3 border-b border-border/20 space-y-2 bg-muted/[0.08]">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${meta.badgeColor}`}>
                            {meta.type}
                          </span>
                          <Badge variant={activeTab === 'completed' ? 'success' : 'outline'} className="text-[10px] font-bold">
                            {activeTab === 'completed' ? 'Completed' : 'Pending Action'}
                          </Badge>
                        </div>
                        <h3 className="text-base font-black text-foreground tracking-tight leading-snug">
                          {test.title}
                        </h3>
                      </div>

                      {/* Card Content parameters row */}
                      <div className="p-5 space-y-4">
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {test.description}
                        </p>

                        {/* Benchmark specifications list */}
                        <div className="grid grid-cols-2 gap-3.5 border-t border-b border-border/30 py-3.5 text-xs font-mono">
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground block uppercase font-mono font-semibold">Time limit</span>
                            <span className="flex items-center gap-1.5 font-extrabold text-foreground">
                              <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                              {test.durationMinutes} Mins
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground block uppercase font-mono font-semibold">Questions count</span>
                            <span className="font-extrabold text-foreground">
                              {test.questionCount} Questions
                            </span>
                          </div>
                        </div>

                        {/* Scores for completed tests & deadline stats for pending ones */}
                        {activeTab === 'completed' && attemptObj ? (
                          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between font-mono">
                            <div className="space-y-0.5">
                              <span className="text-[9px] text-emerald-600 block font-bold uppercase">Result Grade Captured</span>
                              <strong className="text-xs text-foreground font-black">
                                {attemptObj.score} / {test.totalMarks} Marks
                              </strong>
                            </div>
                            <span className="text-emerald-600 text-xs font-black bg-emerald-500/15 px-2.5 py-1 rounded-lg">
                              {Math.round((attemptObj.score / test.totalMarks) * 100)}% Accuracy
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/30">
                            <span className="font-mono text-[10px]">Due deadline date:</span>
                            <strong className="text-rose-500 font-mono text-[11px]">{meta.deadline}</strong>
                          </div>
                        )}
                      </div>

                      {/* Card Footer action button */}
                      <div className="px-5 pb-5 pt-0">
                        {activeTab === 'completed' ? (
                          <Button 
                            className="w-full text-xs font-black flex items-center justify-center gap-1.5 h-10 py-1"
                            variant="outline"
                            onClick={() => {
                              setActiveTestId(test.id);
                              onNavigate(`/student/tests/${test.id}/result`);
                            }}
                          >
                            <span>Inspect Solution &amp; Report</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        ) : (
                          <Button 
                            className="w-full text-xs font-black flex items-center justify-center gap-1.5 h-10 py-1 bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer"
                            onClick={() => {
                              setActiveTestId(test.id);
                              onNavigate(`/student/tests/${test.id}/intro`);
                            }}
                          >
                            <Play className="h-3 w-3 shrink-0" />
                            <span>Start Test</span>
                          </Button>
                        )}
                      </div>

                    </Card>
                  );
                })}
              </div>
            )}
          </PageContainer>
        );
      })()}

      {/* --- SUBVIEW 2: EXAMINATION GUIDELINES BLOCK --- */}
      {subView === 'intro' && activeTest && (
        <PageContainer className="max-w-xl mx-auto space-y-6 py-6 font-sans">
          <Card className="border border-border">
            <CardHeader className="text-center pb-5 border-b border-border/40 bg-muted/10">
              <div className="p-3.5 bg-primary/10 text-primary rounded-xl mx-auto w-fit mb-3">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-black">{activeTest.title}</CardTitle>
              <CardDescription className="text-xs mt-1">Official Mock Benchmark Space</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 text-xs text-muted-foreground leading-relaxed">
              
              <div className="p-4 rounded-xl border border-dashed border-border/80 bg-background space-y-3">
                <h3 className="font-black text-foreground text-xs uppercase tracking-wider">Parameters of current study block:</h3>
                
                <div className="grid grid-cols-2 gap-3 font-mono text-center">
                  <div className="p-2 border rounded-lg bg-muted/20">
                    <span className="text-[9px] text-muted-foreground block">DURATION</span>
                    <strong className="text-xs text-foreground font-black">{activeTest.durationMinutes} Minutes</strong>
                  </div>
                  <div className="p-2 border rounded-lg bg-muted/20">
                    <span className="text-[9px] text-muted-foreground block">QUESTIONS</span>
                    <strong className="text-xs text-foreground font-black">{testQuestions.length} MCQs</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-widest text-[#93c5fd] dark:text-primary">Important Guidelines For Candidates:</h3>
                
                <div className="space-y-3">
                  <p className="flex items-start gap-2 text-[11px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    <span><strong>Continuous Countdown:</strong> Once started, the timer cannot be paused. Relinking or closing tabs does not suspend timing guidelines.</span>
                  </p>
                  <p className="flex items-start gap-2 text-[11px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-2" />
                    <span><strong>Palette Checkpoints:</strong> Utilize the right-hand question indicators to verify unanswered exercises. Green badges represent successfully declared answers.</span>
                  </p>
                  <p className="flex items-start gap-2 text-[11px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive shrink-0 mt-2" />
                    <span><strong>Auto-Submit Protocol:</strong> If the timer expires, the secure system locks your choices and dispatches the attempt directly for evaluative summaries.</span>
                  </p>
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-5 border-t border-border">
                <button
                  type="button"
                  onClick={() => onNavigate('/student/tests')}
                  className="px-4 py-2 text-xs font-bold border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartAttempt}
                  className="px-5 py-2.5 text-xs font-black rounded-lg bg-primary text-primary-foreground hover:opacity-95 transition-all cursor-pointer shadow-md inline-flex items-center gap-1.5 active:scale-95"
                >
                  Start Assessment Room
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
        </PageContainer>
      )}

      {/* --- SUBVIEW 3: THE FLAGSHIP DISTRACTION-FREE ATTEMPT VIEW --- */}
      {subView === 'attempt' && activeTest && (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative">
          
          {/* A. STICKY TOP HEADER */}
          <header className="sticky top-0 z-40 bg-card border-b border-border shadow-xs px-4 py-3 sm:px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              
              {/* Exam Title & Meta */}
              <div className="min-w-0">
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest block leading-none">
                  Secured Exam Environment
                </span>
                <h1 className="text-xs sm:text-sm font-extrabold text-foreground truncate mt-1">
                  {activeTest.title}
                </h1>
              </div>

              {/* Centered Timer & Progress visual wrapper */}
              <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                
                {/* Visual state indicators */}
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] text-muted-foreground block font-bold uppercase leading-none">Progress Done</span>
                  <span className="text-xs font-mono font-bold mt-1 block">
                    {answeredCount} of {testQuestions.length} ({progressPercent}%)
                  </span>
                </div>

                {/* Countdown Time indicator with pulsing danger warning */}
                <div className={`font-mono text-xs sm:text-sm font-black px-4 py-2 rounded-xl flex items-center gap-2 border ${
                  timeRemainingSeconds < 300 
                    ? 'bg-destructive/10 text-destructive border-destructive/30 animate-pulse' 
                    : 'bg-foreground text-background border-transparent'
                }`}>
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{formatTimerString(timeRemainingSeconds)}</span>
                </div>

                {/* Submit button Trigger */}
                <button
                  type="button"
                  onClick={() => setIsSubmitDialogOpen(true)}
                  className="px-4 py-2 text-xs font-black rounded-lg bg-primary text-primary-foreground hover:opacity-90 shadow-sm active:scale-95 transition-colors cursor-pointer"
                >
                  Submit Exam
                </button>

              </div>

            </div>

            {/* Sticky Visual progress bar indicator */}
            <div className="w-full bg-muted/60 h-1.5 absolute bottom-0 left-0 right-0 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </header>

          {/* B. MAIN ASSESSMENT CONTAINER */}
          <div className="max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 flex-1 grid gap-6 lg:grid-cols-4 items-start">
            
            {/* LEFT AREA: MCQ QUESTION PANEL */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Question container card */}
              <Card className="border border-border/75 shadow-sm p-6 sm:p-8 space-y-6 min-h-[420px] flex flex-col justify-between bg-card">
                
                <div className="space-y-6">
                  {/* Subject Tag & Mark Metrics */}
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[9px] uppercase font-bold text-primary">
                        {testQuestions[currentQuestionIndex]?.tags[0] || 'General Subject'}
                      </Badge>
                      {markedForReview[currentQuestionIndex] && (
                        <Badge className="bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-none font-bold text-[9px] uppercase gap-1">
                          <Bookmark className="h-2.5 w-2.5 fill-current" /> Marked for review
                        </Badge>
                      )}
                    </div>
                    
                    <span className="text-[10px] font-mono text-muted-foreground font-bold uppercase">
                      MCQ Task #{currentQuestionIndex + 1}
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <div className="space-y-4">
                    <p className="text-sm sm:text-base font-extrabold text-foreground leading-relaxed">
                      {testQuestions[currentQuestionIndex]?.text}
                    </p>
                  </div>

                  {/* MCQ Answers Options */}
                  <div className="space-y-3 pt-2">
                    {testQuestions[currentQuestionIndex]?.options.map((optionText, optIdx) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleOptionSelect(optIdx)}
                          className={`w-full text-left p-4 rounded-xl border font-bold flex items-center gap-3.5 transition-all text-xs sm:text-sm cursor-pointer ${
                            isSelected 
                              ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary' 
                              : 'border-border/60 bg-card hover:border-border/100 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <span className={`h-6 w-6 font-mono text-xs font-black rounded-full flex items-center justify-center border transition-colors ${
                            isSelected 
                              ? 'bg-primary text-primary-foreground border-transparent' 
                              : 'bg-background border-border text-muted-foreground'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 leading-normal">{optionText}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* BOTTOM NAVIGATION WRAPPER */}
                <div className="flex items-center justify-between pt-6 border-t border-border mt-6 flex-wrap gap-4">
                  
                  {/* Previous button */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 shrink-0" />
                    Previous
                  </button>

                  {/* Mark for Review Button */}
                  <button
                    type="button"
                    onClick={handleToggleReview}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      markedForReview[currentQuestionIndex]
                        ? 'bg-purple-500/10 text-purple-600 border-purple-500/30'
                        : 'bg-card text-muted-foreground hover:text-foreground border-border hover:bg-accent'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 shrink-0 ${markedForReview[currentQuestionIndex] ? 'fill-current' : ''}`} />
                    {markedForReview[currentQuestionIndex] ? 'Unmark Review' : 'Mark for Review'}
                  </button>

                  {/* Next / Finish navigation */}
                  {currentQuestionIndex < testQuestions.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-black rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer transition-colors"
                    >
                      {selectedAnswers[currentQuestionIndex] !== undefined ? 'Next Question' : 'Skip & Next'}
                      <ChevronRight className="h-4 w-4 shrink-0" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsSubmitDialogOpen(true)}
                      className="px-5 py-2.5 text-xs font-black rounded-lg bg-primary text-primary-foreground hover:opacity-95 cursor-pointer shadow-sm ml-auto"
                    >
                      Finish exam
                    </button>
                  )}

                </div>

              </Card>

              {/* Informational helpful alert */}
              <div className="p-3.5 rounded-xl border border-primary/10 bg-primary/[0.01] text-[11px] text-muted-foreground leading-normal flex items-start gap-2 max-w-2xl">
                <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Result Booster secure workspace locks cursor focus boundaries. High intelligence diagnostic matrices automatically identify time taken per question tag to profile failure risks. Ensure you click review tabs to doublecheck.
                </span>
              </div>

            </div>

            {/* RIGHT AREA: QUESTION NUMBERS PALETTE (DESKTOP MODE) */}
            <div className="hidden lg:block space-y-6">
              
              <Card className="border border-border/80">
                <CardHeader className="p-4 pb-3 border-b border-border/40">
                  <CardTitle className="text-xs font-black text-foreground uppercase tracking-wider">
                    Question Navigator
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-5 select-none">
                  
                  {/* Dynamic Status legends */}
                  <div className="grid grid-cols-3 gap-2 text-[9px] font-bold text-center">
                    <div className="p-1 px-1.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/15">
                      Answered
                    </div>
                    <div className="p-1 px-1.5 rounded bg-purple-500/10 text-purple-600 border border-purple-500/15">
                      Review
                    </div>
                    <div className="p-1 px-1.5 rounded bg-muted/70 text-muted-foreground border border-border">
                      Empty
                    </div>
                  </div>

                  {/* Grid layout cells */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {testQuestions.map((_, i) => {
                      const isCurrent = i === currentQuestionIndex;
                      const isAnswered = selectedAnswers[i] !== undefined;
                      const isReview = markedForReview[i] === true;

                      let cellBg = 'bg-muted/30 text-muted-foreground border-border/80';
                      if (isReview) {
                        cellBg = 'bg-purple-500 text-white border-transparent';
                      } else if (isAnswered) {
                        cellBg = 'bg-emerald-500 text-white border-transparent';
                      }

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentQuestionIndex(i)}
                          className={`h-9 w-full rounded-lg text-xs font-extrabold flex items-center justify-center border transition-all cursor-pointer ${cellBg} ${
                            isCurrent 
                              ? 'ring-2 ring-foreground ring-offset-2' 
                              : 'hover:border-foreground/35'
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Statistics Counter */}
                  <div className="pt-3 border-t border-border/40 text-[10px] text-muted-foreground space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>Total Questions:</span>
                      <strong className="text-foreground">{testQuestions.length}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed inputs:</span>
                      <strong className="text-emerald-500">{answeredCount}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending reviews:</span>
                      <strong className="text-purple-500">{Object.keys(markedForReview).filter(k => markedForReview[Number(k)]).length}</strong>
                    </div>
                  </div>

                </CardContent>
              </Card>

            </div>

          </div>

          {/* C. MOBILE PALETTE TOGGLE CHANGER */}
          <div className="lg:hidden fixed bottom-4 right-4 z-40">
            <button
              type="button"
              onClick={() => setIsPaletteDrawerOpen(true)}
              className="h-12 px-4 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 shadow-lg active:scale-95 cursor-pointer"
            >
              <Menu className="h-4 w-4" />
              Question Palette
            </button>
          </div>

          {/* D. MOBILE SLIDEOUT SHEET / DRAWER PALETTE */}
          {isPaletteDrawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
              {/* Overlay Backdrop */}
              <div 
                className="fixed inset-0 bg-foreground/35 backdrop-blur-xs"
                onClick={() => setIsPaletteDrawerOpen(false)}
              />
              
              {/* Drawer Sheet Body */}
              <div className="relative z-50 bg-card border-l border-border h-full w-full max-w-xs p-6 shadow-xl flex flex-col justify-between animate-slide-in">
                
                <div className="space-y-6">
                  
                  {/* Drawer Header titles */}
                  <div className="flex justify-between items-center pb-3 border-b border-border/40">
                    <div>
                      <h3 className="font-black text-foreground text-sm uppercase tracking-wider">Exam Questions Palette</h3>
                      <p className="text-[10px] text-muted-foreground">Select index sequence value to jump</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPaletteDrawerOpen(false)}
                      className="p-1.5 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Palette index cells */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {testQuestions.map((_, i) => {
                      const isCurrent = i === currentQuestionIndex;
                      const isAnswered = selectedAnswers[i] !== undefined;
                      const isReview = markedForReview[i] === true;

                      let cellBg = 'bg-muted/30 text-muted-foreground border-border/80';
                      if (isReview) {
                        cellBg = 'bg-purple-500 text-white border-transparent';
                      } else if (isAnswered) {
                        cellBg = 'bg-emerald-500 text-white border-transparent';
                      }

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setCurrentQuestionIndex(i);
                            setIsPaletteDrawerOpen(false);
                          }}
                          className={`h-9 w-full rounded-lg text-xs font-black flex items-center justify-center border transition-all cursor-pointer ${cellBg} ${
                            isCurrent 
                              ? 'ring-2 ring-foreground ring-offset-2' 
                              : 'hover:border-foreground/35'
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>

                  {/* Color metrics legends */}
                  <div className="space-y-2 text-xs font-semibold pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded bg-emerald-500 shrink-0" />
                      <span>Answered ({answeredCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded bg-purple-500 shrink-0" />
                      <span>Marked for review ({Object.keys(markedForReview).filter(k => markedForReview[Number(k)]).length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 rounded bg-muted border border-border shrink-0" />
                      <span>Unanswered ({testQuestions.length - answeredCount})</span>
                    </div>
                  </div>

                </div>

                <div className="pt-4 border-t border-border/60">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaletteDrawerOpen(false);
                      setIsSubmitDialogOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-xs cursor-pointer text-center"
                  >
                    Submit Current Assessment
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* E. SUBMIT CONFIRMATION DIALOG MODAL */}
          <Modal
            isOpen={isSubmitDialogOpen}
            onClose={() => setIsSubmitDialogOpen(false)}
            title="Admit Final Examination Submission?"
            description="Double check active inputs. Once finalized, answers are committed and cannot be altered."
          >
            <div className="space-y-4 pt-2 text-left text-xs text-muted-foreground">
              
              <div className="p-4 rounded-xl border border-dashed border-border/75 bg-muted/15 font-mono space-y-2">
                <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-widest font-sans">
                  Diagnostic Queue Ratios:
                </span>
                
                <div className="flex justify-between">
                  <span>Total Questions:</span>
                  <strong className="text-foreground">{testQuestions.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Completed &amp; Answered:</span>
                  <strong className="text-emerald-500 font-extrabold">{answeredCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Marked for Review:</span>
                  <strong className="text-purple-500 font-extrabold">
                    {Object.keys(markedForReview).filter(k => markedForReview[Number(k)]).length}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Skipped/Empty:</span>
                  <strong className="text-destructive font-extrabold">{testQuestions.length - answeredCount}</strong>
                </div>
              </div>

              <div className="p-3 bg-amber-500/5 border border-amber-500/25 rounded-lg flex gap-2 leading-relaxed text-[11px]">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  By committing answers, the Result Booster engine registers metrics into coordinator weak student profiles.
                </span>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsSubmitDialogOpen(false)}
                  className="px-4 py-2 border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg font-bold cursor-pointer"
                >
                  Return to Exam
                </button>
                <button
                  type="button"
                  onClick={() => triggerFinalSubmission(false)}
                  className="px-5 py-2.5 bg-primary text-primary-foreground hover:opacity-95 rounded-lg font-black transition-colors cursor-pointer"
                >
                  Submit &amp; View Result
                </button>
              </div>

            </div>
          </Modal>

        </div>
      )}

      {/* --- SUBVIEW 4: COMPREHENSIVE RESULT & PERFORMANCE REPORT --- */}
      {subView === 'result' && (() => {
        const attemptObj = simulatedAttempt || getAttemptForTestId(activeTest?.id || testIdParam || 'test-1');
        
        // Fallback to beautiful mock history if no attempt recorded yet
        const finalAttempt = attemptObj || {
          id: 'att-default',
          testId: activeTest?.id || 'test-1',
          testTitle: activeTest?.title || 'CCC Core Practice Assessment',
          studentId: 'st-6',
          score: 80,
          maxScore: 100,
          correctCount: 4,
          wrongCount: 1,
          skippedCount: 0,
          submittedAt: '2026-05-28',
          durationSeconds: 1240,
          answers: { 0: 1, 1: 2, 2: 0, 3: 0, 4: 1 }
        };

        const totalMarks = activeTest?.totalMarks || 100;
        const finalPercentage = Math.round((finalAttempt.score / totalMarks) * 100);
        const isPass = finalPercentage >= 50; // CCC Passing standard matches 50% limit boundaries

        // Dynamically compute topic-wise stats from actual question responses
        const topicStats: Record<string, { total: number; correct: number }> = {};
        testQuestions.forEach((q, idx) => {
          const mainTag = q.tags?.[0] || 'Fundamentals';
          if (!topicStats[mainTag]) {
            topicStats[mainTag] = { total: 0, correct: 0 };
          }
          topicStats[mainTag].total += 1;
          const chosen = finalAttempt.answers[idx];
          if (chosen !== undefined && chosen === q.correctOptionIdx) {
            topicStats[mainTag].correct += 1;
          }
        });

        const topicBreakdown = Object.entries(topicStats).map(([name, stat]) => {
          const acc = Math.round((stat.correct / stat.total) * 100);
          return { name, accuracy: acc, correct: stat.correct, total: stat.total };
        });

        // Collect wrong or skipped questions for Accordion
        const wrongOrSkipped = testQuestions.map((q, idx) => {
          const chosen = finalAttempt.answers[idx];
          const isCorrect = chosen !== undefined && chosen === q.correctOptionIdx;
          return { q, idx, chosen, isCorrect };
        }).filter(item => !item.isCorrect);

        // Format duration helper
        const formatDuration = (secs: number) => {
          const mm = Math.floor(secs / 60);
          const ss = secs % 60;
          return mm > 0 ? `${mm}m ${ss}s` : `${ss}s`;
        };

        return (
          <PageContainer className="max-w-3xl mx-auto space-y-7">
            
            {/* Auto-Submit Time Limit Exceeded Indicator */}
            {isAutoSubmitted && (
              <div className="p-4 rounded-xl border border-destructive/25 bg-destructive/5 text-destructive-foreground flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-xs font-black block text-foreground">Countdown Timer Locked</strong>
                  <p className="text-[11px] text-muted-foreground leading-normal">
                    The examination session duration expired. Answers committed automatically.
                  </p>
                </div>
              </div>
            )}

            {/* A. BEAUTIFULLY STYLIZED HERO SECTION */}
            <Card className="overflow-hidden border border-border bg-gradient-to-br from-background via-card to-secondary/5 relative">
              <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-primary via-emerald-500 to-indigo-500" />
              
              <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="space-y-3.5 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                    <Badge variant={isPass ? 'success' : 'destructive'} className="text-[11px] font-black uppercase tracking-wider px-3.5 py-1">
                      {isPass ? '✓ PASSED BENCHMARK' : '✗ ACADEMIC REVISION REQUIRED'}
                    </Badge>
                    <span className="text-[11px] font-mono font-semibold text-muted-foreground whitespace-nowrap">
                      Min Passing limit: 50%
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-none">
                    Performance Report: {activeTest?.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg">
                    {isPass 
                      ? "Magnificent job, Riya! Your score is ahead of standard performance target boundaries. Ready to take on the definitive certification exam!" 
                      : "A helpful checkpoint! While you didn't reach the target threshold, reviewing your specific category gaps below will guarantee massive score growth."
                    }
                  </p>
                </div>

                {/* Score Circle display */}
                <div className="bg-muted/10 border-2 border-border p-6 rounded-2xl flex flex-col items-center justify-center min-w-[140px] h-[140px] shadow-sm shrink-0">
                  <span className={`text-4xl sm:text-5.5xl font-black tracking-tighter ${isPass ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {finalPercentage}%
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase font-black tracking-widest mt-1">
                    {finalAttempt.score} / {totalMarks} Marks
                  </span>
                </div>
              </div>
            </Card>

            {/* B. DETAILED ASSESSMENT STATS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { 
                  label: 'Correct Responses', 
                  value: finalAttempt.correctCount, 
                  icon: CheckCircle2, 
                  textColor: 'text-emerald-500', 
                  bgClass: 'bg-emerald-500/5 border-emerald-500/10' 
                },
                { 
                  label: 'Incorrect Choices', 
                  value: finalAttempt.wrongCount, 
                  icon: XCircle, 
                  textColor: 'text-rose-500', 
                  bgClass: 'bg-rose-500/5 border-rose-500/10' 
                },
                { 
                  label: 'Skipped Tasks', 
                  value: finalAttempt.skippedCount, 
                  icon: HelpCircle, 
                  textColor: 'text-slate-500', 
                  bgClass: 'bg-slate-500/5 border-slate-500/10' 
                },
                { 
                  label: 'Duration Taken', 
                  value: formatDuration(finalAttempt.durationSeconds), 
                  icon: Clock, 
                  textColor: 'text-indigo-500', 
                  bgClass: 'bg-indigo-500/5 border-indigo-500/10' 
                }
              ].map((stat, sIdx) => {
                const Icon = stat.icon;
                return (
                  <Card key={sIdx} className={`border p-4 flex flex-col justify-between ${stat.bgClass}`}>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-[10px] font-black uppercase tracking-wider font-mono">{stat.label}</span>
                      <Icon className={`h-4 w-4 ${stat.textColor} shrink-0`} />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-foreground tracking-tight mt-1">
                      {stat.value}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* C. TOPIC / COGNITIVE BREAKDOWN */}
            <Card className="border border-border">
              <CardHeader className="pb-4 border-b border-border/20">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Compass className="h-4 w-4 text-primary" />
                  Category Competency Matrix
                </CardTitle>
                <CardDescription className="text-xs">
                  We measure correct responses per objective tag dynamically.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {topicBreakdown.map((topic, tIdx) => {
                  let barColor = 'bg-rose-500';
                  let textColor = 'text-rose-500';
                  if (topic.accuracy >= 80) {
                    barColor = 'bg-emerald-500';
                    textColor = 'text-emerald-500';
                  } else if (topic.accuracy >= 50) {
                    barColor = 'bg-amber-500';
                    textColor = 'text-amber-500';
                  }

                  return (
                    <div key={tIdx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-extrabold text-foreground">{topic.name}</span>
                        <span className={`font-mono font-black ${textColor}`}>
                          {topic.correct} of {topic.total} ({topic.accuracy}%)
                        </span>
                      </div>
                      <LocalProgress value={topic.accuracy} color={barColor} className="h-2.5 rounded-full" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* D. WRONG ANSWER MANUAL / SOLUTION CRITIQUE ACCORDION */}
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                    Wrong &amp; Skipped Solution Keys ({wrongOrSkipped.length})
                  </h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Revise these specific learning items using the review Accordion below.
                  </p>
                </div>
              </div>

              {wrongOrSkipped.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-emerald-500/10 rounded-2xl bg-emerald-500/[0.02] space-y-2">
                  <Award className="h-8 w-8 text-emerald-500 mx-auto animate-bounce" />
                  <strong className="text-xs text-foreground font-black block">Absolute Conceptual Mastery!</strong>
                  <p className="text-[11px] text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Zero mistakes registered on this assessment! Keep up this spectacular level of training.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {wrongOrSkipped.map((item, localIdx) => {
                    const isOpen = !!openAccordions[localIdx];
                    const chosenLabel = item.chosen !== undefined ? item.q.options[item.chosen] : 'No answer checked (Skipped)';
                    
                    return (
                      <div 
                        key={item.q.id} 
                        className={`border rounded-xl transition-all ${
                          isOpen ? 'bg-muted/15 border-border/100 shadow-xs' : 'bg-card border-border/80 hover:border-border/100'
                        }`}
                      >
                        {/* Header Trigger */}
                        <button
                          type="button"
                          onClick={() => setOpenAccordions(prev => ({ ...prev, [localIdx]: !prev[localIdx] }))}
                          className="w-full p-4 flex items-center justify-between text-left gap-4 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="font-mono text-xs font-extrabold text-muted-foreground shrink-0">
                              Task #{item.idx + 1}
                            </span>
                            <Badge variant={item.chosen === undefined ? 'outline' : 'destructive'} className="text-[10px] py-0 px-2 font-mono whitespace-nowrap">
                              {item.chosen === undefined ? 'Skipped' : 'Incorrect Choice'}
                            </Badge>
                            <span className="text-xs font-black text-foreground truncate hidden sm:block">
                              {item.q.text}
                            </span>
                          </div>
                          
                          <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Collapsible Content */}
                        {isOpen && (
                          <div className="p-4 pt-0 border-t border-border/40 space-y-4 text-xs font-sans">
                            
                            <div className="space-y-1 mt-3">
                              <span className="text-[10px] text-muted-foreground font-mono uppercase font-black">Question Prompt</span>
                              <p className="font-extrabold text-foreground leading-relaxed">
                                {item.q.text}
                              </p>
                            </div>

                            {/* Option Review Matrix */}
                            <div className="space-y-2">
                              {item.q.options.map((opt, optIdx) => {
                                const isCorrect = optIdx === item.q.correctOptionIdx;
                                const wasChosen = optIdx === item.chosen;

                                let borderClass = 'border-border/60 bg-background/50';
                                let textClass = 'text-muted-foreground';
                                if (isCorrect) {
                                  borderClass = 'border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-bold';
                                  textClass = 'text-emerald-700 dark:text-emerald-300';
                                } else if (wasChosen) {
                                  borderClass = 'border-rose-500/40 bg-rose-500/5 text-rose-600 dark:text-rose-400 font-bold';
                                  textClass = 'text-rose-700 dark:text-rose-300';
                                }

                                return (
                                  <div key={optIdx} className={`p-3 rounded-lg border flex items-center gap-3 ${borderClass}`}>
                                    <span className={`h-5 w-5 rounded-full flex items-center justify-center font-mono font-black text-[10px] border shrink-0 ${
                                      isCorrect 
                                        ? 'bg-emerald-500 text-white border-transparent' 
                                        : wasChosen 
                                          ? 'bg-rose-500 text-white border-transparent' 
                                          : 'bg-muted border-border text-muted-foreground'
                                    }`}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </span>
                                    <span className={`${textClass} leading-snug`}>{opt}</span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Revision Concept Guidance */}
                            <div className="p-3 rounded-lg border border-dashed border-amber-500/25 bg-amber-500/[0.02] flex items-start gap-2 text-muted-foreground leading-normal font-sans">
                              <ThumbsUp className="h-4 w-4 text-amber-500 shrink-0 mt-0.5 rotate-180" />
                              <div className="space-y-0.5">
                                <strong className="text-amber-600 dark:text-amber-400 font-bold block text-[10px] uppercase font-mono">Expert Revision Hint</strong>
                                <p className="text-[11px] leading-relaxed">
                                  Standard study guide syllabus recommends verifying <strong>{item.q.tags?.[0] || 'Fundamentals'}</strong> methodologies. Practice identical exercises by running tailored concept drills focused on this tag code.
                                </p>
                              </div>
                            </div>

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* E. POLISHED BOTTOM ACTION SECTIONS */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3.5 pt-5 border-t border-border">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-11 text-xs font-black inline-flex items-center justify-center gap-2"
                onClick={() => onNavigate('/student/dashboard')}
              >
                <Home className="h-4 w-4" />
                <span>Back to Study Space</span>
              </Button>
              
              <Button
                className="w-full sm:w-auto h-11 text-xs font-black inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
                onClick={() => {
                  setActiveTab('pending');
                  onNavigate('/student/tests');
                }}
              >
                <RotateCcw className="h-4 w-4" />
                <span>Practice Weak Areas</span>
              </Button>
            </div>

          </PageContainer>
        );
      })()}
    </div>
  );
}
