import * as React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  GraduationCap, 
  ArrowRight,
  TrendingUp, 
  Clock, 
  Award, 
  Play,
  BookOpen,
  Calendar,
  Compass,
  UserCheck,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  MessageSquare,
  BookOpenCheck,
  CalendarDays,
  Target
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Badge, 
  PageContainer,
  Button,
  Separator
} from '../../components/ui/CustomComponents';
import { initialTests, initialStudents, initialTestAttempts, initialWeakAreas } from '../../data';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface StudentDashboardProps {
  onNavigate: (path: string) => void;
}

// --- LOGICAL PROGRESS BAR FOR SHADCN FEEL ---
function Progress({ value, className = '', color = 'bg-primary' }: { value: number; className?: string; color?: string }) {
  return (
    <div className={`w-full bg-secondary dark:bg-muted rounded-full h-2 overflow-hidden ${className}`}>
      <div 
        className={`${color} h-2 rounded-full transition-all duration-1000 ease-out`} 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

// Custom Tooltip for Recharts
const CustomChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover text-popover-foreground p-3.5 border border-border rounded-xl shadow-md text-xs space-y-1">
        <p className="font-bold flex items-center gap-1.5 text-foreground">
          <Award className="h-3.5 w-3.5 text-primary" />
          <span>{payload[0].payload.name}</span>
        </p>
        <p className="font-mono text-[11px] text-muted-foreground">
          Score Achieved: <strong className="text-primary text-xs font-black">{payload[0].value}%</strong>
        </p>
        <p className="text-[10px] text-muted-foreground">{payload[0].payload.date}</p>
      </div>
    );
  }
  return null;
};

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  // Load logged in student (matching default Riya Sen profile)
  const loggedInStudent = initialStudents.find(s => s.id === 'st-6') || initialStudents[0];
  
  // Tab Navigation State
  const [activeTab, setActiveTab] = React.useState<'plan' | 'gaps' | 'analytics'>('plan');
  
  // Toast interaction state
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Static target exam coordinates
  const examTargetDateString = 'June 15, 2026';
  const readinessPercentage = 85;

  // Riya's past mock papers
  const pastAttempts = initialTestAttempts.filter(att => att.studentId === loggedInStudent.id);
  const bestAttemptScore = pastAttempts.reduce((max, att) => Math.max(max, att.score), 80);

  // Trending dataset for graphics (recharts)
  const scoreTrendData = [
    { name: 'CCC Diagnostic Grid', score: 65, date: 'May 02, 2026' },
    { name: 'Fundamentals Basics', score: 72, date: 'May 08, 2026' },
    { name: 'Windows Shortcuts Prep', score: 70, date: 'May 14, 2026' },
    { name: 'Office Utilities Drill', score: 79, date: 'May 19, 2026' },
    { name: 'Fundamentals & Windows Mock', score: 80, date: 'May 20, 2026' },
    { name: 'PowerPoint & Presentation Active', score: 88, date: 'May 24, 2026' },
    { name: 'Overall Projected Curve', score: 92, date: 'May 28, 2026' }
  ];

  // Specific student-assigned tests that have not been attempted.
  // In initialTests we have 'test-1' which has been attempted by Riya (under pastAttempts).
  // Thus we treat others or custom simulated ones as pending mock tests
  const activePendingPaperList = [
    {
      id: 'test-2',
      title: 'CCC Word Processing & Excel Formulas Benchmark',
      description: 'Master spreadsheet columns, nested arithmetic lookup parameters, header formats, and page margins.',
      duration: '45 Mins',
      questions: '15 Questions',
      points: '100 Marks',
      difficulty: 'Intermediate',
      dueDays: 'Due in 2 days',
      isUrgent: true
    },
    {
      id: 'test-3',
      title: 'Internet Protocols & Digital Security Diagnostics',
      description: 'Covers domain networks, email structures, web browsers, wireless channels, and virus prevention guidelines.',
      duration: '60 Mins',
      questions: '25 Questions',
      points: '100 Marks',
      difficulty: 'Advanced',
      dueDays: 'Due in 6 days',
      isUrgent: false
    }
  ];

  // Detailed student weak topics
  const primaryWeakTopics = [
    {
      topic: 'Networking - IP Subnetting Basics',
      accuracy: 42,
      subTopics: 'IP addressing classes, IPv4 subnet divisions, gateway addresses.',
      actionLabel: 'Interactive Router Simulator',
      resource: 'Syllabus Core Sheet 4'
    },
    {
      topic: 'MS PowerPoint - Slide Transition Timings',
      accuracy: 54,
      subTopics: 'Trigger buttons, customized slide layouts, and embedded animation parameters.',
      actionLabel: 'Syllabus Presentation Video Class',
      resource: 'PowerPoint Chapter 8'
    },
    {
      topic: 'MS Excel - Advanced Database Filters',
      accuracy: 60,
      subTopics: 'Multi-criteria conditional sorting, pivot grid basics, table formulas.',
      actionLabel: 'Formula Cheat Sheet Guide',
      resource: 'Excel Formula Lab 12'
    }
  ];

  const handleApplyResource = (topicName: string) => {
    triggerToast(`📚 Training recommendation unlocked for: ${topicName}. Opening resources study guide.`);
  };

  const handleStartExam = (testCode: string, title: string) => {
    triggerToast(`⚡ Initializing secure testing chamber for "${title}"... Preparing question booklet.`);
    setTimeout(() => {
      onNavigate(`/student/tests`);
    }, 1200);
  };

  return (
    <PageContainer className="max-w-6xl">
      
      {/* Toast Alert popups */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 bg-primary text-primary-foreground border border-primary/20 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 font-sans font-semibold max-w-sm">
          <Sparkles className="h-4.5 w-4.5 animate-pulse shrink-0 text-white" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* TOP SECTION: WELCOME & KEY METRIC SUMMARY */}
      <div className="space-y-6">
        
        {/* Welcome greeting card - Crafted with minimal, elegant style */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-background to-secondary/15 border border-border rounded-2xl p-6 sm:p-8">
          
          {/* Subtle decorative blurred halo */}
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            
            <div className="space-y-3.5">
              
              {/* Batch Tag Label */}
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-[10px] uppercase font-bold py-0.5 tracking-wider font-mono">
                  Active Course: {loggedInStudent.batchName}
                </Badge>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-medium text-muted-foreground font-mono">Roll Match Verified</span>
              </div>
              
              <h1 className="text-2xl sm:text-3.5xl font-black text-foreground tracking-tight font-sans">
                Keep going, {loggedInStudent.name}! ✨
              </h1>
              
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                We calculated your dynamic course average at <strong className="text-foreground">{loggedInStudent.averageScore}% Accuracy</strong>. 
                Your certification target looks within safe reach—let's bridge those small subnetting gaps to hit the gold standard today!
              </p>

            </div>

            {/* Quick-action Readiness Progress Panel */}
            <div className="bg-card/85 backdrop-blur-xs border border-border p-4.5 rounded-2xl max-w-sm w-full lg:w-80 flex flex-col gap-3">
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Target className="h-4.5 w-4.5 text-primary" />
                  <span className="text-xs font-black text-foreground">Syllabus Readiness</span>
                </div>
                <span className="font-mono text-xs font-extrabold text-foreground bg-primary/10 px-2 py-0.5 rounded-md text-primary">{readinessPercentage}%</span>
              </div>

              {/* Progress Indicator */}
              <div className="space-y-1">
                <Progress value={readinessPercentage} color="bg-primary" />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Basic Core</span>
                  <span>Mock Ready</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* MOTIVATIONAL EXAM COUNTDOWN RIBBON */}
        <div className="bg-background border border-border rounded-xl px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-1 px-2 rounded-md bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 font-mono text-[10px] font-extrabold flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              COUNTDOWN
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              Main CCC National Certificate Mock: <span className="text-foreground font-black">{examTargetDateString}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-black text-rose-500 bg-rose-500/5 px-2.5 py-1 rounded-lg">
              18 Days
            </span>
            <span className="font-mono text-xs font-black text-muted-foreground bg-muted/30 px-2 py-1 rounded-lg">
              09 Hours
            </span>
            <span className="font-mono text-[11px] text-muted-foreground font-semibold">Remaining</span>
          </div>
        </div>

      </div>

      {/* CORE STAT CARDS BENTO GRID */}
      <div className="grid gap-4.5 grid-cols-2 md:grid-cols-4 mt-6">
        
        {/* Metric 1: Latest Score */}
        <Card className="hover:shadow-md transition-all group relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-15 group-hover:scale-110 group-hover:opacity-20 transition-all text-primary">
            <Award className="h-10 w-10" />
          </div>
          <CardHeader className="p-4.5 pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Latest Mock Score
            </CardDescription>
            <CardTitle className="text-2xl font-black text-foreground font-mono mt-1">
              80%
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4.5 pt-0">
            <p className="text-[10px] text-muted-foreground leading-normal">
              Computer Fundamentals Drill 1
            </p>
            <button 
              onClick={() => triggerToast("Reviewing latest mock test answers. Taking you to detailed test attempt reports hub...")}
              className="text-[10.5px] font-bold text-primary hover:underline cursor-pointer inline-flex items-center gap-0.5 mt-2.5"
            >
              Analyze Test Details
              <ChevronRight className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>

        {/* Metric 2: Completed Papers */}
        <Card className="hover:shadow-md transition-all group relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-15 group-hover:scale-110 group-hover:opacity-20 transition-all text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <CardHeader className="p-4.5 pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Exams Completed
            </CardDescription>
            <CardTitle className="text-2xl font-black text-foreground font-mono mt-1">
              14
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4.5 pt-0">
            <p className="text-[10px] text-muted-foreground leading-normal">
              Continuous diagnostic testing logs
            </p>
            <button 
              onClick={() => onNavigate('/student/progress')}
              className="text-[10.5px] font-bold text-primary hover:underline cursor-pointer inline-flex items-center gap-0.5 mt-2.5"
            >
              Review Performance Curve
              <ChevronRight className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>

        {/* Metric 3: Pending Tests */}
        <Card className="hover:shadow-md transition-all group border-primary/20 relative overflow-hidden bg-primary/5">
          <div className="absolute right-3 top-3 opacity-15 group-hover:scale-110 group-hover:opacity-25 transition-all text-primary">
            <Clock className="h-10 w-10" />
          </div>
          <CardHeader className="p-4.5 pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-wider text-primary">
              Pending Active Tests
            </CardDescription>
            <CardTitle className="text-2xl font-black text-primary font-mono mt-1">
              2 Open
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4.5 pt-0">
            <p className="text-[10px] text-muted-foreground leading-normal">
              Assigned for CCC Batch A
            </p>
            <button 
              onClick={() => {
                setActiveTab('plan');
                triggerToast("Swapped viewport: Scrolled to open assessment benchmarks list.");
              }}
              className="text-[10.5px] font-black text-primary hover:underline cursor-pointer inline-flex items-center gap-0.5 mt-2.5"
            >
              Examine Open Mock List
              <ChevronRight className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>

        {/* Metric 4: All Time Best */}
        <Card className="hover:shadow-md transition-all group relative overflow-hidden">
          <div className="absolute right-3 top-3 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all text-amber-500">
            <Award className="h-10 w-10" />
          </div>
          <CardHeader className="p-4.5 pb-2">
            <CardDescription className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Personal Best Score
            </CardDescription>
            <CardTitle className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
              {bestAttemptScore}%
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4.5 pt-0">
            <p className="text-[10px] text-muted-foreground leading-normal">
              Achieved in Word Formatting
            </p>
            <button 
              onClick={() => triggerToast("Personal best registered in LibreOffice Writer Formatting. Keep raising the bar!")}
              className="text-[10.5px] font-bold text-primary hover:underline cursor-pointer inline-flex items-center gap-0.5 mt-2.5"
            >
              View Honors Badge
              <ChevronRight className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>

      </div>

      {/* DETAILED STUDENT WORKSPACE SWITCHER USING TABS */}
      <div className="mt-8 space-y-6">
        
        {/* TABS HEADER BAR: EXTREMELY CLEAN & SHADCN STYLE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          
          <div className="flex gap-1 bg-muted p-1 rounded-xl self-start">
            {[
              { id: 'plan', label: 'My Academic Plan', icon: BookOpenCheck },
              { id: 'gaps', label: 'Identified Learning Gaps', icon: Compass },
              { id: 'analytics', label: 'Detailed Statistics & Trends', icon: TrendingUp }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    triggerToast(`Viewing Workspace: ${tab.label}`);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                  }`}
                >
                  <IconComp className="h-4 w-4 shrink-0 text-primary" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-[11px] font-semibold text-muted-foreground font-mono bg-muted/30 px-3 py-1 rounded-lg">
            Profile: bk6500416@gmail.com
          </span>

        </div>

        {/* TABS VIEWPORT CONTENTS */}
        <div className="space-y-6 min-h-[300px]">
          
          {/* TAB 1: MY ACADEMIC PLAN (Pending Test List & Basic Info) */}
          {activeTab === 'plan' && (
            <div className="grid gap-6 md:grid-cols-3 max-w-full">
              
              {/* LIST OF PENDING WORKPAPERS */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-foreground font-sans">
                      Assigned Mock Practice Tests
                    </h3>
                    <p className="text-xs text-muted-foreground leading-normal">
                      Complete these scheduled simulations before the deadline to sustain high readiness markers.
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs font-semibold">
                    {activePendingPaperList.length} Papers Open
                  </Badge>
                </div>

                <div className="space-y-4">
                  {activePendingPaperList.map((paper) => (
                    <Card key={paper.id} className="border border-border hover:border-primary/45 transition-all p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono leading-none tracking-wider font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase">
                              CODE: {paper.id.toUpperCase()}
                            </span>
                            <Badge 
                              variant={paper.isUrgent ? 'destructive' : 'secondary'} 
                              className="text-[9px] font-black uppercase py-0.5"
                            >
                              {paper.difficulty}
                            </Badge>
                            <span className="text-[11px] font-semibold text-rose-500 font-mono">
                              {paper.dueDays}
                            </span>
                          </div>

                          <h4 className="text-sm font-black text-foreground tracking-tight leading-snug">
                            {paper.title}
                          </h4>

                          <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                            {paper.description}
                          </p>

                        </div>

                        {/* CTA ACTION BUTTON */}
                        <div className="shrink-0 self-start sm:self-center">
                          <button
                            onClick={() => handleStartExam(paper.id, paper.title)}
                            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 bg-primary hover:bg-primary/95 text-primary-foreground font-black text-xs rounded-xl cursor-pointer shadow-xs active:scale-95 transition-all w-full sm:w-auto"
                          >
                            <Play className="h-3.5 w-3.5 shrink-0" />
                            Start Test
                          </button>
                        </div>

                      </div>

                      {/* Footer Metadata row */}
                      <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-4 border-t border-border/40 mt-4 font-mono font-semibold">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Evaluation Allotment: {paper.duration}
                        </span>
                        <span>Marks weightage: {paper.points}</span>
                        <span>{paper.questions}</span>
                      </div>

                    </Card>
                  ))}
                </div>

              </div>

              {/* LATERAL INFORMATION CARD: MOTIVATIONAL TIPS */}
              <div className="space-y-4">
                
                <h3 className="text-base font-bold text-foreground font-sans">
                  Study Room Guidance
                </h3>

                <Card className="p-5 bg-gradient-to-br from-indigo-500/5 to-primary/5 border-dashed border-primary/25 space-y-4">
                  
                  <div className="space-y-1.5">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] tracking-wider uppercase font-bold text-primary flex items-center gap-1 font-mono">
                      Adaptive Suggestion
                    </span>
                    <h4 className="text-sm font-black text-foreground tracking-tight">
                      Calculus Limits & Subnet Formulas
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Your diagnostic performance records show that spending just 12 minutes in the "Networking Subnetting Basics" simulator raises overall prediction grades by 9%.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    
                    <div className="flex items-start gap-2.5 text-[11px] leading-relaxed text-muted-foreground">
                      <div className="p-0.5 rounded-full bg-emerald-500 text-white mt-0.5">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                      <span>Review IP range headers (Classes A, B, C)</span>
                    </div>

                    <div className="flex items-start gap-2.5 text-[11px] leading-relaxed text-muted-foreground">
                      <div className="p-0.5 rounded-full bg-emerald-500 text-white mt-0.5">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                      <span>Commit slide exits & triggers to memory</span>
                    </div>

                  </div>

                  <button 
                    onClick={() => onNavigate('/student/weak-areas')}
                    className="w-full h-9 bg-foreground text-background text-xs font-black rounded-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <span>Inspect Revision Cards</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>

                </Card>

              </div>

            </div>
          )}

          {/* TAB 2: IDENTIFIED LEARNING GAPS */}
          {activeTab === 'gaps' && (
            <div className="space-y-5">
              
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-foreground font-sans">
                  Targeted Learning Hub: Weak Topics
                </h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Identified concepts where average accuracy fell beneath the recommended 65% benchmark. Spend a few minutes on these key target zones.
                </p>
              </div>

              <div className="grid gap-4.5 sm:grid-cols-3">
                {primaryWeakTopics.map((topic, i) => (
                  <Card key={i} className="hover:border-foreground/20 transition-all p-5 flex flex-col justify-between">
                    
                    <div className="space-y-3">
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={topic.accuracy < 50 ? 'destructive' : 'secondary'}
                          className="font-mono text-[9px] font-bold py-0.5"
                        >
                          Accuracy: {topic.accuracy}%
                        </Badge>
                        <span className="text-[11px] text-muted-foreground font-mono font-bold">
                          Critical Gap
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-foreground leading-snug font-sans">
                          {topic.topic}
                        </h4>
                        <p className="text-[11.5px] text-muted-foreground leading-normal mt-1">
                          {topic.subTopics}
                        </p>
                      </div>

                      {/* Custom linear progress indicator to show specific subject master progress */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                          <span>Focus Accuracy</span>
                          <span className="font-bold text-foreground">{topic.accuracy}%</span>
                        </div>
                        <Progress value={topic.accuracy} color={topic.accuracy < 50 ? 'bg-destructive' : 'bg-amber-500'} />
                      </div>

                    </div>

                    <div className="pt-4 mt-4 border-t border-border/50 flex flex-col gap-2">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Unlocked Resource:</span>
                        <strong className="text-foreground tracking-tight">{topic.resource}</strong>
                      </div>
                      <button
                        onClick={() => handleApplyResource(topic.topic)}
                        className="w-full text-center py-2 text-xs font-bold border border-border rounded-lg text-foreground bg-muted/20 hover:bg-muted/70 transition-colors cursor-pointer text-xs"
                      >
                        {topic.actionLabel}
                      </button>
                    </div>

                  </Card>
                ))}
              </div>

              {/* Extra checklist element to use Checkbox correctly */}
              <Card className="p-5 bg-muted/40 border border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-foreground block">
                      Daily Booster Checklist Completed!
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Outstanding! You already took 1 core simulation this week and achieved a verified 80% passing indicator.
                    </p>
                  </div>
                </div>
              </Card>

            </div>
          )}

          {/* TAB 3: STATISTICS & TRENDS (Improvement Trend Chart) */}
          {activeTab === 'analytics' && (
            <div className="grid gap-6 md:grid-cols-4 whitespace-nowrap">
              
              {/* TREND LINE GRAPH */}
              <div className="md:col-span-3 space-y-4 min-w-0">
                
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-foreground font-sans">
                    Score Growth & Improvement Trajectory
                  </h3>
                  <p className="text-xs text-muted-foreground leading-normal whitespace-normal">
                    This chart tracks mock exam scores over the month of May. Notice how continuous assessment shifts your accuracy trajectory from 65% up to 92%.
                  </p>
                </div>

                <Card className="p-5">
                  
                  {/* Grid Graphic Container */}
                  <div className="h-64 sm:h-72 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={scoreTrendData}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="date" 
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        />
                        <YAxis 
                          domain={[55, 100]}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        />
                        <Tooltip content={<CustomChartTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="score" 
                          stroke="var(--color-primary, #6366f1)" 
                          strokeWidth={2.5} 
                          fillOpacity={1} 
                          fill="url(#scoreColor)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex items-center justify-between mt-4 text-[11px] text-muted-foreground font-semibold border-t border-border pt-4">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
                      Dynamic growth calculated: +27% over 6 iterations
                    </span>
                    <span className="font-mono text-[10.5px]">Last Updated: Today</span>
                  </div>

                </Card>

              </div>

              {/* SIDE STATS AND DATA CHECKS */}
              <div className="md:col-span-1 space-y-4">
                
                <h3 className="text-base font-bold text-foreground font-sans">
                  Milestones Tracker
                </h3>

                <Card className="p-4.5 space-y-4">
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold block">
                      Target Goal
                    </span>
                    <span className="text-xs font-black text-foreground block">
                      CCC Government Cert Limit
                    </span>
                    <div className="flex justify-between items-center text-[10.5px] mt-1.5 text-muted-foreground font-semibold">
                      <span>Threshold required:</span>
                      <strong className="text-emerald-600 font-mono">60%</strong>
                    </div>
                    <div className="flex justify-between items-center text-[10.5px] text-muted-foreground font-semibold">
                      <span>Your average:</span>
                      <strong className="text-primary font-mono">{loggedInStudent.averageScore}%</strong>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono font-bold block">
                      Achievements
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[11px] text-foreground font-medium">Windows Shortcuts Master badge</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="text-[11px] text-foreground font-medium">10+ Practice Mock Attempts</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span className="text-[11px] text-muted-foreground font-medium">Subnetting Basics unresolved</span>
                    </div>

                  </div>

                </Card>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* BOTTOM SECTION: TEACHER RECOMMENDATION CALLOUT */}
      <div className="mt-8">
        
        <div className="border-b border-border pb-3 mb-4.5">
          <h3 className="text-base font-bold text-foreground font-sans">
            Teacher Consultation & Guidance
          </h3>
        </div>

        <Card className="p-6 relative overflow-hidden bg-primary/5 border border-primary/25 rounded-2xl">
          
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
            
            {/* Teacher Initial Profile Circle */}
            <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground font-black text-base flex items-center justify-center shadow-xs shrink-0">
              AS
            </div>

            <div className="space-y-3.5">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-black text-foreground">
                    Aarav Sharma
                  </h4>
                  <Badge variant="outline" className="text-[9.5px] uppercase font-bold py-0 bg-muted/60">
                    Syllabus Coordinator
                  </Badge>
                  <span className="text-[10.5px] text-muted-foreground font-mono">
                    Consultation Desk
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  <span>Feedback issued: Yesterday</span>
                </div>
              </div>

              {/* Quote Block */}
              <p className="text-xs sm:text-[13px] text-foreground leading-relaxed italic max-w-4xl text-muted-foreground">
                "Hello Riya! I reviewed your Windows Mock and LibreOffice attempts. Maintaining an <span className="font-bold text-foreground font-mono">80%</span> is a wonderful foundation! You are highly capable of surpassing our top cohort marks. Slide Animation and Subnet Classes represent your only soft areas. Dedicate 15 minutes to review Laboratory Sheet 4 under the 'Identified Learning Gaps' tab. Keep boosting your potential, you are making incredible progress!"
              </p>

              <div className="flex gap-2.5 pt-1 flex-wrap">
                <button
                  onClick={() => {
                    setActiveTab('gaps');
                    triggerToast("Opening learning gaps: Check dynamic resource material lists.");
                  }}
                  className="px-3.5 h-8.5 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold rounded-lg cursor-pointer transition-all inline-flex items-center gap-1"
                >
                  <Compass className="h-3.5 w-3.5" />
                  Apply Aarav's Recommendation
                </button>
                <button
                  onClick={() => triggerToast("Initializing live chat session channel with instructor Aarav Sharma. Please wait...")}
                  className="px-3.5 h-8.5 border border-border bg-background hover:bg-muted text-foreground text-xs font-semibold rounded-lg cursor-pointer transition-all inline-flex items-center gap-1"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Ask Counselor a Question
                </button>
              </div>

            </div>

          </div>

        </Card>

      </div>

    </PageContainer>
  );
}
