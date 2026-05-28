import * as React from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Percent, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  BookOpen, 
  Send, 
  TrendingUp, 
  Award, 
  Briefcase, 
  Layers, 
  ChevronRight, 
  Search, 
  Download, 
  Filter, 
  Sparkles, 
  HelpCircle,
  Activity,
  ThumbsUp,
  ThumbsDown,
  Mail,
  MoreVertical,
  Maximize2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge, 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell,
  EmptyState,
  Breadcrumbs
} from '../../components/ui/CustomComponents';
import { initialStudents, initialBatches } from '../../data';
import { Student } from '../../types';

interface OwnerTestDetailProps {
  onNavigate: (path: string) => void;
  testId: string;
}

// Full analytical representation of a student attempt
interface DetailAttempt {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  score: number;
  maxScore: number;
  percentage: number;
  isPass: boolean;
  durationSeconds: number;
  submittedAt: string;
  weakTopic: string;
  topicBreakdowns: Record<string, { correct: number; total: number }>;
}

export default function OwnerTestDetail({ onNavigate, testId }: OwnerTestDetailProps) {
  const [activeTab, setActiveTab] = React.useState<'results' | 'topics' | 'pending'>('results');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [failFilter, setFailFilter] = React.useState<'all' | 'pass' | 'fail'>('all');
  const [remindedStudents, setRemindedStudents] = React.useState<string[]>([]);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [showTooltipId, setShowTooltipId] = React.useState<string | null>(null);
  const [hoveredHeatmapCell, setHoveredHeatmapCell] = React.useState<{ student: string, topic: string, value: number } | null>(null);

  // Load the test and all existing batches/tests configuration from LocalStorage (or fallbacks)
  const tests = React.useMemo(() => {
    const saved = localStorage.getItem('resultbooster_tests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback below
      }
    }
    return [
      {
        id: 'test-1',
        title: 'CCC Computer Fundamentals & Windows Mock Test',
        type: 'Benchmark',
        durationMinutes: 45,
        batchId: 'batch-1',
        batchName: 'CCC Morning Batch A',
        questionCount: 5,
        totalMarks: 100,
        status: 'active',
        description: 'A benchmark computer literacy exam evaluating Windows operations, files, folders management, and elementary shortcuts.',
        createdDate: '2026-05-18',
        attemptCount: 8,
        totalSeats: 12
      },
      {
        id: 'test-2',
        title: 'DCA Word Formatting & Excel Formula Drill',
        type: 'Practice Quiz',
        durationMinutes: 30,
        batchId: 'batch-2',
        batchName: 'DCA Regular Batch B',
        questionCount: 4,
        totalMarks: 80,
        status: 'active',
        description: 'Practical simulation check for daily office tasks: creating summaries, editing columns, sorting rows, and employing basic formulas.',
        createdDate: '2026-05-22',
        attemptCount: 7,
        totalSeats: 10
      },
      {
        id: 'test-3',
        title: 'ADCA Advanced Excel Formulas & Database Basics',
        type: 'Unit Check',
        durationMinutes: 90,
        batchId: 'batch-3',
        batchName: 'ADCA Evening Advanced',
        status: 'draft',
        questionCount: 5,
        totalMarks: 100,
        description: 'Comprehensive assessment detailing nested spreadsheet queries, structured indexes, database keys, and relational fields.',
        createdDate: '2026-05-26',
        attemptCount: 0,
        totalSeats: 15
      }
    ];
  }, []);

  const test = React.useMemo(() => {
    return tests.find(t => t.id === testId) || tests[0];
  }, [tests, testId]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // List of topics derived/modeled based on test category for premium granular dashboards
  const testTopics = React.useMemo(() => {
    if (test.id === 'test-2') {
      return ['MS Word Formatting', 'Excel Functions', 'Data Sorting', 'File Architecture'];
    }
    if (test.id === 'test-3') {
      return ['Database Keys', 'SQL Queries', 'Nested Functions', 'VLOOKUP / Arrays', 'Pivot Analysis'];
    }
    // Default or test-1 topics
    return ['Hardware Basics', 'OS Shortcuts', 'File Management', 'Word Editing', 'Internet Safety'];
  }, [test]);

  // Generate 8-12 consistent, premium performance records for the test batch members
  const generatedAttempts: DetailAttempt[] = React.useMemo(() => {
    // Generate data depending on test parameters to make them realistic
    const passingPercentage = 50; // default grade limit
    const seedNames = [
      { name: 'Riya Sen', email: 'bk6500416@gmail.com', ratio: 0.84, dur: 1240 },
      { name: 'Aarav Sharma', email: 'aarav@resultbooster.com', ratio: 0.78, dur: 1520 },
      { name: 'Ananya Goel', email: 'ananya@resultbooster.com', ratio: 0.58, dur: 1980 },
      { name: 'Devansh Verma', email: 'devansh@verma.com', ratio: 0.92, dur: 1100 },
      { name: 'Kunal Kapoor', email: 'kunal@resultbooster.com', ratio: 0.42, dur: 2240 },
      { name: 'Sneha Reddy', email: 'sneha@reddy.com', ratio: 0.88, dur: 1390 },
      { name: 'Vikram Malhotra', email: 'vikram@malhotra.com', ratio: 0.76, dur: 1450 },
      { name: 'Pooja Patel', email: 'pooja@patel.com', ratio: 0.38, dur: 2400 },
      { name: 'Pranav Joshi', email: 'pranav@joshi.com', ratio: 0.81, dur: 1610 },
      { name: 'Nehal Shah', email: 'nehal@shah.com', ratio: 0.69, dur: 1770 }
    ];

    return seedNames.map((item, idx) => {
      const score = Math.round(test.totalMarks * item.ratio);
      const percentage = Math.round(item.ratio * 100);
      const isPass = percentage >= passingPercentage;

      // Assign granular weights to topic breaks
      const topicBreakdowns: Record<string, { correct: number; total: number }> = {};
      let poorestTopic = testTopics[0];
      let lowestAccuracy = 1.0;

      testTopics.forEach((topic, tIdx) => {
        // Vary correct counts realistically per student ratio
        const total = 2; // questions per topic
        let correct = 0;
        const rand = Math.random();
        
        if (item.ratio > 0.8) {
          correct = rand > 0.15 ? 2 : 1;
        } else if (item.ratio > 0.6) {
          correct = rand > 0.5 ? 2 : 1;
        } else {
          correct = rand > 0.75 ? 1 : 0;
        }

        topicBreakdowns[topic] = { correct, total };

        const topicAccuracy = correct / total;
        if (topicAccuracy < lowestAccuracy) {
          lowestAccuracy = topicAccuracy;
          poorestTopic = topic;
        }
      });

      return {
        id: `gen-att-${test.id}-${idx}`,
        studentId: `gen-st-${idx}`,
        studentName: item.name,
        studentEmail: item.email,
        score,
        maxScore: test.totalMarks,
        percentage,
        isPass,
        durationSeconds: item.dur,
        submittedAt: new Date(Date.now() - (idx * 1.5 * 3600000)).toISOString().split('T')[0],
        weakTopic: poorestTopic,
        topicBreakdowns
      };
    });
  }, [test, testTopics]);

  // Cohort members that DID not attempt the test
  const pendingStudents = React.useMemo(() => {
    const list = [
      { id: 'p-1', name: 'Kabir Bose', email: 'kabir@bose.org', lastSeen: '1 day ago' },
      { id: 'p-2', name: 'Ishita Patel', email: 'ishita@patel.co.in', lastSeen: 'Today, 9 AM' },
      { id: 'p-3', name: 'Rohan Mehra', email: 'rohan@mehra.com', lastSeen: '3 days ago' },
      { id: 'p-4', name: 'Deepika Saini', email: 'deepika@saini.org', lastSeen: 'Never' }
    ];
    return list;
  }, []);

  // Filtered attempted results based on parameters
  const filteredAttempts = React.useMemo(() => {
    return generatedAttempts.filter(att => {
      const textMatch = att.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         att.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         att.weakTopic.toLowerCase().includes(searchQuery.toLowerCase());
      
      const passStateMatch = failFilter === 'all' || 
                            (failFilter === 'pass' && att.isPass) || 
                            (failFilter === 'pass' && att.isPass) || 
                            (failFilter === 'fail' && !att.isPass);
      
      return textMatch && passStateMatch;
    });
  }, [generatedAttempts, searchQuery, failFilter]);

  // Metric aggregates
  const statsSummary = React.useMemo(() => {
    const attemptedCount = generatedAttempts.length;
    const totalPossibleSeats = attemptedCount + pendingStudents.length;
    const completionPercentage = Math.round((attemptedCount / totalPossibleSeats) * 100);
    
    const sumScores = generatedAttempts.reduce((acc, att) => acc + att.percentage, 0);
    const averageScore = attemptedCount > 0 ? Math.round(sumScores / attemptedCount) : 0;

    const passes = generatedAttempts.filter(att => att.isPass).length;
    const passRate = attemptedCount > 0 ? Math.round((passes / attemptedCount) * 100) : 0;

    return {
      totalSeats: totalPossibleSeats,
      completedCount: attemptedCount,
      completionPercentage,
      averageScore,
      passRate,
      failsCount: attemptedCount - passes
    };
  }, [generatedAttempts, pendingStudents]);

  // Aggregated Topic Metrics (Accuracies)
  const topicAccuracyData = React.useMemo(() => {
    return testTopics.map(topic => {
      let totalCorrect = 0;
      let totalQuestions = 0;

      generatedAttempts.forEach(att => {
        const breakdown = att.topicBreakdowns[topic];
        if (breakdown) {
          totalCorrect += breakdown.correct;
          totalQuestions += breakdown.total;
        }
      });

      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      return {
        name: topic,
        accuracy,
        correctAnswers: totalCorrect,
        totalAttempts: totalQuestions
      };
    });
  }, [testTopics, generatedAttempts]);

  // Sort topics by accuracy score for strongest versus weakest lists
  const sortedTopics = React.useMemo(() => {
    return [...topicAccuracyData].sort((a, b) => b.accuracy - a.accuracy);
  }, [topicAccuracyData]);

  const strongestTopics = sortedTopics.filter(t => t.accuracy >= 70);
  const weakestTopics = [...sortedTopics].reverse().filter(t => t.accuracy < 70);

  // Trigger individual reminder email
  const triggerReminder = (studentName: string, id: string) => {
    if (remindedStudents.includes(id)) {
      triggerToast(`Info: Reminder previously dispatched to ${studentName}.`);
      return;
    }
    setRemindedStudents([...remindedStudents, id]);
    triggerToast(`🔔 Dispatching automated review reminder notification to ${studentName}!`);
  };

  // Dispatch warnings to all pending list elements
  const triggerBulkReminders = () => {
    const unnotified = pendingStudents.filter(p => !remindedStudents.includes(p.id));
    if (unnotified.length === 0) {
      triggerToast('Info: All pending students have been notified.');
      return;
    }
    setRemindedStudents([...remindedStudents, ...unnotified.map(u => u.id)]);
    triggerToast(`⚡ Broadcasted urgent completion compliance emails to ${unnotified.length} pending candidates!`);
  };

  // Convert seconds to human format
  const formatSeconds = (totalSeconds: number) => {
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    return `${min}m ${sec}s`;
  };

  // Download simulation
  const downloadReports = () => {
    triggerToast('📥 Compiling comprehensive Excel spreadsheet. Downloading report shortly...');
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-55 p-4 bg-foreground text-background dark:bg-card dark:text-foreground border border-border rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5 font-semibold transition-all">
          <Activity className="h-4.5 w-4.5 text-primary animate-pulse shrink-0" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb Navigation Links */}
      <div className="flex flex-col gap-1.5 border-b border-border/60 pb-5">
        <Breadcrumbs
          items={[
            { label: 'Evaluation Hub', onClick: () => onNavigate('/owner/tests') },
            { label: test.title }
          ]}
        />
        
        <div className="flex flex-col gap-4 mt-1 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="p-1 px-2 md:px-2.5 bg-primary/10 text-primary font-mono text-[9px] uppercase font-black rounded-md tracking-wider">
                ID: {test.id}
              </span>
              <Badge variant="outline" className="font-mono text-xs font-semibold py-0.5">{test.batchName}</Badge>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wide font-extrabold ${
                test.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-slate-500/10 text-slate-600'
              }`}>
                {test.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {test.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-normal max-w-4xl">
              {test.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start shrink-0">
            <button
              onClick={() => onNavigate('/owner/tests')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold border border-border bg-card hover:bg-muted text-foreground rounded-lg transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Evaluation Hub
            </button>

            <button
              onClick={downloadReports}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-black bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all cursor-pointer shadow-xs"
            >
              <Download className="h-4 w-4" />
              Export Sheets
            </button>
          </div>
        </div>
      </div>

      {/* PREMIUM TOP SUMMARY CARD GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        
        {/* Metric 1 - Type */}
        <Card className="p-4 bg-card hover:border-border/100 transition-all border-border/50 relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 text-muted-foreground/10 group-hover:text-muted-foreground/20 transition-colors">
            <FileText className="h-20 w-20" />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase font-black block">Exam Type</span>
          <span className="text-lg font-black text-foreground mt-1 block">
            {test.type}
          </span>
          <span className="text-[9px] text-muted-foreground mt-1.5 block font-mono">
            {test.questionCount} Questions Selected
          </span>
        </Card>

        {/* Metric 2 - Batch */}
        <Card className="p-4 bg-card hover:border-border/100 transition-all border-border/50 relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 text-muted-foreground/10 group-hover:text-muted-foreground/20 transition-colors">
            <Layers className="h-20 w-20" />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase font-black block">Class Mapped</span>
          <span className="text-lg font-black text-foreground mt-1 block truncate" title={test.batchName}>
            {test.batchName.replace('Morning ', '').replace('Evening ', '').replace('Regular ', '')}
          </span>
          <span className="text-[9px] text-muted-foreground mt-1.5 block font-mono">
            At {test.durationMinutes} Mins Duration Limits
          </span>
        </Card>

        {/* Metric 3 - Completion % */}
        <Card className="p-4 bg-card hover:border-border/100 transition-all border-border/50 relative overflow-hidden group">
          <span className="text-[10px] font-mono text-muted-foreground uppercase font-black block">Attempts Progress</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-black text-foreground">{statsSummary.completionPercentage}%</span>
            <span className="text-[10.5px] text-muted-foreground font-semibold">({statsSummary.completedCount}/{statsSummary.totalSeats})</span>
          </div>
          {/* Custom SVG or absolute progress bar */}
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden border border-border/15 mt-2.5">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${statsSummary.completionPercentage}%` }}
            />
          </div>
        </Card>

        {/* Metric 4 - Average Score */}
        <Card className="p-4 bg-card hover:border-border/100 transition-all border-border/50 relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-1 text-muted-foreground/10 group-hover:text-muted-foreground/20 transition-colors">
            <TrendingUp className="h-16 w-16" />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase font-black block">Average Score</span>
          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {statsSummary.averageScore}% Accuracy
          </span>
          <span className="text-[9px] text-muted-foreground mt-1.5 block font-mono">
            Passing Margin: {test.totalMarks / 2} Points (50%)
          </span>
        </Card>

        {/* Metric 5 - Pass Rate */}
        <Card className="p-4 bg-card hover:border-border/100 transition-all border-border/50 relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 text-muted-foreground/10 group-hover:text-muted-foreground/20 transition-colors">
            <Award className="h-20 w-20" />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground uppercase font-black block">Pass / Fail Ratio</span>
          <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
            {statsSummary.passRate}% Passing
          </span>
          <span className="text-[9px] text-muted-foreground mt-1.5 block font-mono">
            {statsSummary.failsCount} Students Failing Limits
          </span>
        </Card>

      </div>

      {/* CORE MAIN ROUTING GRAPH TABS switcher */}
      <div className="space-y-6">
        
        {/* TAB BUTTONS row styled identically to shadcn tabs */}
        <div className="border-b border-border/80 flex items-center justify-between pb-1">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setActiveTab('results');
                setSearchQuery('');
              }}
              className={`pb-3.5 px-4 text-xs font-bold font-sans border-b-2 transition-all cursor-pointer relative ${
                activeTab === 'results' 
                  ? 'border-primary text-foreground font-black' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Student Results ({filteredAttempts.length})
              {activeTab === 'results' && (
                <span className="absolute bottom-0 inset-x-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('topics');
                setSearchQuery('');
              }}
              className={`pb-3.5 px-4 text-xs font-bold font-sans border-b-2 transition-all cursor-pointer relative ${
                activeTab === 'topics' 
                  ? 'border-primary text-foreground font-black' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Topic & Heatmap Analytics
              {activeTab === 'topics' && (
                <span className="absolute bottom-0 inset-x-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('pending');
                setSearchQuery('');
              }}
              className={`pb-3.5 px-4 text-xs font-bold font-sans border-b-2 transition-all cursor-pointer relative ${
                activeTab === 'pending' 
                  ? 'border-primary text-foreground font-black' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Pending Students ({pendingStudents.length})
              {activeTab === 'pending' && (
                <span className="absolute bottom-0 inset-x-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10.5px] text-muted-foreground bg-muted/30 px-3 py-1 border border-border/40 rounded-lg">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Interactive Real-time Evaluation Logs</span>
          </div>
        </div>

        {/* ACTIVE TAB VIEWS */}

        {/* TAB 1: STUDENT RESULTS */}
        {activeTab === 'results' && (
          <div className="space-y-4">
            
            {/* Table Search & Filter Toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-muted/15 p-3.5 rounded-xl border border-border/60">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
                <input
                  type="text"
                  placeholder="Search student names, emails or weak topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8.5 block w-full h-8.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground font-semibold">Grades Filter:</span>
                <div className="flex bg-muted p-0.5 rounded-lg border border-border/20">
                  <button
                    onClick={() => setFailFilter('all')}
                    className={`px-3 py-1 rounded-md text-[10.5px] font-bold transition-all cursor-pointer ${failFilter === 'all' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFailFilter('pass')}
                    className={`px-3 py-1 rounded-md text-[10.5px] font-bold transition-all cursor-pointer ${failFilter === 'pass' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground'}`}
                  >
                    Passed
                  </button>
                  <button
                    onClick={() => setFailFilter('fail')}
                    className={`px-3 py-1 rounded-md text-[10.5px] font-bold transition-all cursor-pointer ${failFilter === 'fail' ? 'bg-destructive/10 text-destructive' : 'text-muted-foreground'}`}
                  >
                    Failed
                  </button>
                </div>
              </div>
            </div>

            {/* Results Table */}
            {filteredAttempts.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No Student Results Found"
                description="No attempts fit your keyword search or selected filters. Try broadening your criteria."
              />
            ) : (
              <div className="border border-border/80 rounded-2xl overflow-hidden bg-card">
                <table className="w-full caption-bottom text-sm border-collapse">
                  <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground text-[11px] font-mono tracking-wider text-left">
                    <tr>
                      <th className="p-4 pl-6">Student Info</th>
                      <th className="p-4 text-center">Score Ratio</th>
                      <th className="p-4 text-center">Percentage</th>
                      <th className="p-4 text-center">Benchmark Result</th>
                      <th className="p-4 text-right">Duration</th>
                      <th className="p-4 text-right pr-6">Poreest Topic Sector</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredAttempts.map((att) => {
                      const isRiya = att.studentEmail === 'bk6500416@gmail.com';
                      return (
                        <tr 
                          key={att.id} 
                          className={`hover:bg-muted/20 transition-all ${isRiya ? 'bg-primary/[0.02] border-l-2 border-l-primary' : ''}`}
                        >
                          {/* Student Info */}
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="h-8.5 w-8.5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs uppercase shadow-xs">
                                {att.studentName.split(' ').map(n=>n[0]).join('')}
                              </div>
                              <div className="space-y-0.5">
                                <span className="font-bold text-xs text-foreground block leading-tight flex items-center gap-1.5">
                                  {att.studentName}
                                  {isRiya && (
                                    <Badge variant="secondary" className="px-1.5 py-0 text-[9px] uppercase font-bold tracking-wider">
                                      Your Profile
                                    </Badge>
                                  )}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-mono block leading-none">
                                  {att.studentEmail}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Score ratio */}
                          <td className="p-4 text-center">
                            <span className="font-mono text-xs font-bold text-foreground">
                              {att.score} <span className="text-muted-foreground">/</span> {att.maxScore}
                            </span>
                          </td>

                          {/* Percentage Progress Bar */}
                          <td className="p-4">
                            <div className="max-w-[120px] mx-auto space-y-1">
                              <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                                <span className={att.percentage >= 70 ? 'text-emerald-600' : att.percentage >= 50 ? 'text-indigo-600' : 'text-rose-600'}>
                                  {att.percentage}%
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1 relative overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    att.percentage >= 70 ? 'bg-emerald-500' : att.percentage >= 50 ? 'bg-primary' : 'bg-destructive'
                                  }`} 
                                  style={{ width: `${att.percentage}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Pass/Fail badge */}
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wider font-extrabold ${
                              att.isPass 
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/10'
                            }`}>
                              {att.isPass ? (
                                <>
                                  <ThumbsUp className="h-2.5 w-2.5" />
                                  Pass
                                </>
                              ) : (
                                <>
                                  <ThumbsDown className="h-2.5 w-2.5" />
                                  Fail
                                </>
                              )}
                            </span>
                          </td>

                          {/* Duration */}
                          <td className="p-4 text-right font-mono text-xs font-semibold text-muted-foreground">
                            {formatSeconds(att.durationSeconds)}
                          </td>

                          {/* Weak subject */}
                          <td className="p-4 text-right pr-6">
                            <div className="relative inline-block" onMouseLeave={() => setShowTooltipId(null)}>
                              <button
                                onMouseEnter={() => setShowTooltipId(att.id)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted/60 text-foreground text-[10.5px] font-semibold rounded-lg hover:bg-muted font-mono transition-all decoration-dotted underline cursor-help decoration-muted-foreground"
                              >
                                {att.weakTopic}
                                <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
                              </button>

                              {/* Tooltip implementation */}
                              {showTooltipId === att.id && (
                                <div className="absolute right-0 bottom-full mb-2 w-56 p-3 bg-foreground text-background dark:bg-card dark:text-foreground border border-border shadow-2xl rounded-xl z-20 text-left space-y-2">
                                  <h4 className="text-[10px] font-black uppercase tracking-wider font-mono text-amber-500">Topic Breakdowns (%)</h4>
                                  <div className="space-y-1.5 divide-y divide-border/20">
                                    {(Object.entries(att.topicBreakdowns) as [string, { correct: number; total: number }][]).map(([topic, data], tIdx) => (
                                      <div key={topic} className="flex justify-between items-center pt-1 text-[10px]">
                                        <span className="truncate max-w-[120px] font-medium">{topic}</span>
                                        <span className="font-mono font-extrabold">
                                          {Math.round((data.correct / data.total) * 100)}% ({data.correct}/{data.total})
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: TOPIC ANALYTICS & MASTER HEATMAP */}
        {activeTab === 'topics' && (
          <div className="space-y-6">
            
            <div className="grid gap-6 md:grid-cols-5">
              
              {/* Strongest & Weakest topics summaries */}
              <div className="md:col-span-2 space-y-4">
                
                {/* 1. Strongest Sectors Card */}
                <Card className="border-emerald-500/20 bg-emerald-500/[0.01]">
                  <CardHeader className="pb-3 border-b border-emerald-500/10">
                    <CardTitle className="text-xs font-black uppercase tracking-widest font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <ThumbsUp className="h-4.5 w-4.5 text-emerald-500" />
                      Class Power Sectors (🛠️ Strongest)
                    </CardTitle>
                    <CardDescription className="text-[11px]">
                      Topics where cohort results exhibit superior accuracy above 70%.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4.5">
                    {strongestTopics.length === 0 ? (
                      <span className="text-xs text-muted-foreground block text-center py-2">No categories currently score above 70% accuracy limits.</span>
                    ) : (
                      strongestTopics.map((item, idx) => (
                        <div key={idx} className="space-y-1.5 text-xs">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-foreground font-mono">{item.name}</span>
                            <span className="font-mono text-emerald-600 font-extrabold">{item.accuracy}% Accuracy</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${item.accuracy}%` }} />
                          </div>
                          <p className="text-[9.5px] text-muted-foreground line-clamp-1 block">
                            Total {item.correctAnswers} correctly answered responses over diagnostics.
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* 2. Weakest Sectors Card */}
                <Card className="border-rose-500/20 bg-rose-500/[0.01]">
                  <CardHeader className="pb-3 border-b border-rose-500/10">
                    <CardTitle className="text-xs font-black uppercase tracking-widest font-mono text-rose-600 dark:text-rose-400 flex items-center gap-2">
                      <ThumbsDown className="h-4.5 w-4.5 text-rose-500" />
                      Struggling Areas (🚨 Requires Review)
                    </CardTitle>
                    <CardDescription className="text-[11px]">
                      Topics requiring on-site lab support or focused booster lectures.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4.5">
                    {weakestTopics.length === 0 ? (
                      <span className="text-xs text-emerald-600 gap-1.5 block text-center py-2 font-semibold">Perfect Coverage! No areas with sub-70% scores.</span>
                    ) : (
                      weakestTopics.map((item, idx) => (
                        <div key={idx} className="space-y-1.5 text-xs">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-foreground font-mono">{item.name}</span>
                            <span className="font-mono text-rose-600 font-extrabold">{item.accuracy}% Accuracy</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${item.accuracy}%` }} />
                          </div>
                          <p className="text-[9.5px] text-muted-foreground line-clamp-1 block">
                            Recommend targeted homework assignments to strengthen fundamentals.
                          </p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

              </div>

              {/* 3. Bar Chart graphic */}
              <div className="md:col-span-3">
                <Card className="h-full flex flex-col justify-between">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-black uppercase tracking-widest font-mono text-muted-foreground flex items-center justify-between">
                      <span>Topic Accuracy Overview</span>
                      <span className="font-sans normal-case text-muted-foreground font-medium">Recharts Analytics</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Comprehensive average accuracy percentages across total attempted student MCQ logs.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 min-h-[280px] pt-4 select-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topicAccuracyData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'monospace' }} 
                        />
                        <YAxis 
                          domain={[0, 100]} 
                          tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'monospace' }} 
                        />
                        <RechartsTooltip 
                          contentStyle={{
                            background: 'var(--card)', 
                            border: '1px solid var(--border)', 
                            borderRadius: '12px'
                          }}
                          labelStyle={{ fontWeight: 'black', fontSize: '11px', color: 'var(--foreground)' }}
                          itemStyle={{ fontSize: '11px' }}
                        />
                        <Bar dataKey="accuracy" barSize={35} radius={[6, 6, 0, 0]}>
                          {topicAccuracyData.map((entry, index) => {
                            const color = entry.accuracy >= 70 ? '#10b981' : entry.accuracy >= 55 ? '#6366f1' : '#f43f5e';
                            return <Cell key={`cell-${index}`} fill={color} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

            </div>

            {/* HEATMAP VISUALIZATION SECTION */}
            <Card>
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 border-b border-border bg-muted/25 p-5">
                <div className="space-y-0.5">
                  <CardTitle className="text-xs font-black uppercase tracking-widest font-mono text-muted-foreground flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-primary" />
                    Granular Students Topic Mastery Grid (Heatmap Matrix)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Continuous mapping tracking correct MCQ configurations. Hover over intersections to explore metric points.
                  </CardDescription>
                </div>
                
                {/* Color explanations map */}
                <div className="flex items-center gap-3 text-[10px] font-mono shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 bg-emerald-500 rounded-sm" />
                    <span>Mastery (100%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 bg-indigo-500 rounded-sm" />
                    <span>In-Progress (50%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 bg-rose-500 rounded-sm" />
                    <span>Critical (0%)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                
                <div className="overflow-x-auto">
                  <div className="min-w-[600px] space-y-4">
                    
                    {/* Heatmap Grid Content */}
                    <div className="grid gap-2 text-center">
                      
                      {/* Header row (topic columns) */}
                      <div className="flex items-center font-mono text-[10px] font-extrabold text-muted-foreground border-b border-border/40 pb-2">
                        <div className="w-[150px] text-left shrink-0">Student Candidate</div>
                        <div className="flex-1 grid grid-cols-5 gap-2">
                          {testTopics.map((topic, idx) => (
                            <div key={idx} className="truncate px-1" title={topic}>
                              {topic}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Content rows (students) */}
                      <div className="space-y-2.5 divide-y divide-border/20">
                        {generatedAttempts.map((att) => (
                          <div 
                            key={att.id} 
                            className="flex items-center pt-2.5 text-xs text-foreground group"
                          >
                            <div className="w-[150px] text-left font-bold text-foreground truncate flex flex-col shrink-0">
                              <span className="truncate">{att.studentName}</span>
                              <span className="text-[9px] text-muted-foreground font-mono leading-none font-normal">{att.percentage}% score</span>
                            </div>

                            <div className="flex-1 grid grid-cols-5 gap-2">
                              {testTopics.map((topic, tIdx) => {
                                const stat = att.topicBreakdowns[topic] || { correct: 0, total: 2 };
                                const pct = Math.round((stat.correct / stat.total) * 100);
                                
                                let cellColor = 'bg-rose-500 text-white dark:bg-rose-600';
                                if (pct === 100) {
                                  cellColor = 'bg-emerald-500 text-white dark:bg-emerald-600';
                                } else if (pct > 0) {
                                  cellColor = 'bg-indigo-500 text-white dark:bg-indigo-600';
                                }

                                return (
                                  <div
                                    key={tIdx}
                                    onMouseEnter={() => setHoveredHeatmapCell({ student: att.studentName, topic, value: pct })}
                                    onMouseLeave={() => setHoveredHeatmapCell(null)}
                                    className={`h-9 rounded-lg ${cellColor} flex flex-col items-center justify-center font-bold text-[10px] font-mono cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xs relative`}
                                  >
                                    <span>{pct}%</span>
                                    <span className="opacity-75 text-[8px] font-normal leading-none mt-0.5">{stat.correct}/{stat.total}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Heatmap Cell Detailed Tooltip HUD footer */}
                    <div className="bg-muted/35 border border-border/80 p-3 rounded-xl flex items-center gap-3.5 min-h-[50px] text-xs">
                      {hoveredHeatmapCell ? (
                        <div className="flex items-center gap-2 animate-fade-in text-[11px]">
                          <span className="p-1 px-1.5 bg-primary/10 text-primary font-mono font-black text-[9px] uppercase rounded">CELL DETAILS</span>
                          <span className="text-muted-foreground">Candidate:</span>
                          <strong className="text-foreground">{hoveredHeatmapCell.student}</strong>
                          <span className="text-muted-foreground">| Topic Sector:</span>
                          <strong className="text-foreground">{hoveredHeatmapCell.topic}</strong>
                          <span className="text-muted-foreground">| Precision Rate:</span>
                          <span className={`font-mono font-black ${hoveredHeatmapCell.value === 100 ? 'text-emerald-600' : hoveredHeatmapCell.value > 0 ? 'text-indigo-600' : 'text-rose-600'}`}>{hoveredHeatmapCell.value}% Accuracy</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-[10px] italic">Hover your cursor over the colored matrix blocks to unlock precise accuracy ratios of each learner.</span>
                      )}
                    </div>

                  </div>
                </div>

              </CardContent>
            </Card>

          </div>
        )}

        {/* TAB 3: PENDING STUDENTS */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-muted/15 p-3.5 rounded-xl border border-border/60">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono text-muted-foreground block uppercase font-bold">Unattempted Cohort Pool</span>
                <span className="text-xs text-muted-foreground block">
                  Listing {pendingStudents.length} candidates assigned but who haven't completed this test yet.
                </span>
              </div>

              <button
                onClick={triggerBulkReminders}
                className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-black bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <Mail className="h-4 w-4" />
                Remind All {pendingStudents.length} Candidates
              </button>
            </div>

            {/* Non-attempts list */}
            <div className="border border-border/80 rounded-2xl overflow-hidden bg-card">
              <table className="w-full caption-bottom text-sm border-collapse">
                <thead className="border-b border-border bg-muted/40 font-semibold text-muted-foreground text-[11px] font-mono tracking-wider text-left">
                  <tr>
                    <th className="p-4 pl-6">Student Info</th>
                    <th className="p-4">Cohort Batch Mapped</th>
                    <th className="p-4 text-center">In-Platform Status</th>
                    <th className="p-4 text-right">Last Login Action</th>
                    <th className="p-4 text-right pr-6">Urgent Reminders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {pendingStudents.map((stud) => {
                    const isNotified = remindedStudents.includes(stud.id);
                    return (
                      <tr key={stud.id} className="hover:bg-muted/15 transition-all">
                        
                        {/* Student profile */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="h-8.5 w-8.5 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-xs uppercase">
                              {stud.name.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <div className="space-y-0.5">
                              <span className="font-bold text-xs text-foreground block leading-tight">
                                {stud.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono block">
                                {stud.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Cohort */}
                        <td className="p-4 text-xs font-bold text-foreground">
                          {test.batchName}
                        </td>

                        {/* Status */}
                        <td className="p-4 text-center">
                          <Badge variant="outline" className="text-[10px] font-mono border-amber-500/20 text-amber-600 bg-amber-500/5">
                            Pending Attempt
                          </Badge>
                        </td>

                        {/* Last seen */}
                        <td className="p-4 text-right text-xs font-mono text-muted-foreground">
                          Seen {stud.lastSeen}
                        </td>

                        {/* Action column */}
                        <td className="p-4 text-right pr-6">
                          <button
                            type="button"
                            onClick={() => triggerReminder(stud.name, stud.id)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-[10.5px] rounded-lg border font-bold transition-all cursor-pointer active:scale-95 ${
                              isNotified 
                                ? 'bg-muted text-muted-foreground border-border cursor-not-allowed' 
                                : 'bg-background hover:bg-muted text-foreground border-border'
                            }`}
                          >
                            <Send className="h-3 w-3" />
                            {isNotified ? 'Dispatched' : 'Remind Now'}
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
