import * as React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  Legend 
} from 'recharts';
import { 
  Award, 
  Clock, 
  Target, 
  TrendingUp, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  AlertTriangle, 
  Sparkles,
  Compass,
  ArrowRight,
  History,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  PageContainer,
  Badge,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableWrapper
} from '../../components/ui/CustomComponents';
import { initialTests } from '../../data';

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

export default function StudentProgress() {
  const [activeTab, setActiveTab] = React.useState<'trends' | 'competency'>('trends');

  // Load client-side attempts dynamically
  const getAttemptForTestId = (testId: string) => {
    try {
      const saved = localStorage.getItem('last_attempt_' + testId);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Hardcoded initial attempt for Riya Sen on test-1
    if (testId === 'test-1') {
      return {
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
      };
    }
    return null;
  };

  // Compile unified list of attempts (historical + dynamic sessions)
  const allAttempts = React.useMemo(() => {
    // Standard baseline drills Riya took earlier in the month
    const list = [
      {
        id: 'hist-1',
        testId: 'test-diagnostic',
        title: 'Diagnostic Computer Literacy Pre-Test',
        score: 60,
        totalMarks: 100,
        correctCount: 3,
        wrongCount: 2,
        skippedCount: 0,
        submittedAt: '2026-05-02',
        durationSeconds: 1540,
        percentage: 60
      },
      {
        id: 'hist-2',
        testId: 'test-components',
        title: 'CPU, RAM, & Hardware Logic Drill',
        score: 75,
        totalMarks: 100,
        correctCount: 15,
        wrongCount: 5,
        skippedCount: 0,
        submittedAt: '2026-05-10',
        durationSeconds: 1120,
        percentage: 75
      },
      {
        id: 'hist-3',
        testId: 'test-writer',
        title: 'Document Editors & LibreOffice Essentials',
        score: 70,
        totalMarks: 100,
        correctCount: 7,
        wrongCount: 3,
        skippedCount: 0,
        submittedAt: '2026-05-14',
        durationSeconds: 980,
        percentage: 70
      }
    ];

    // Read live state of actual mocked test models
    initialTests.forEach(test => {
      const attempt = getAttemptForTestId(test.id);
      if (attempt) {
        const perc = Math.round((attempt.score / test.totalMarks) * 100);
        list.push({
          id: attempt.id,
          testId: test.id,
          title: test.title,
          score: attempt.score,
          totalMarks: test.totalMarks,
          correctCount: attempt.correctCount,
          wrongCount: attempt.wrongCount,
          skippedCount: attempt.skippedCount,
          submittedAt: attempt.submittedAt || '2026-05-28',
          durationSeconds: attempt.durationSeconds,
          percentage: perc
        });
      }
    });

    // Sort chronologically
    return list.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
  }, []);

  // Compute stats metrics dynamically
  const stats = React.useMemo(() => {
    if (allAttempts.length === 0) {
      return { bestScore: 0, averageScore: 0, count: 0, scoreImprovement: 0 };
    }

    const percentages = allAttempts.map(a => a.percentage);
    const best = Math.max(...percentages);
    const avg = Math.round(percentages.reduce((sum, val) => sum + val, 0) / percentages.length);
    const count = allAttempts.length;

    // Calc improvement from first to last attempt
    const baseline = percentages[0] || 0;
    const latest = percentages[percentages.length - 1] || 0;
    const improvement = latest - baseline;

    return {
      bestScore: best,
      averageScore: avg,
      count,
      scoreImprovement: improvement
    };
  }, [allAttempts]);

  // Topic Competency Matrix based on simulated performance questions
  const topicCompetencyData = React.useMemo(() => {
    return [
      { topic: 'Computer Fundamentals', accuracy: 78, completed: 8, status: 'Mastered' },
      { topic: 'LibreOffice & Word Processing', accuracy: 82, completed: 6, status: 'Mastered' },
      { topic: 'Windows GUI Operations', accuracy: 70, completed: 7, status: 'Proficient' },
      { topic: 'Web Security Protocols', accuracy: 48, completed: 5, status: 'Needs Work' },
      { topic: 'MS Excel - Spreadsheet Formulas', accuracy: 40, completed: 9, status: 'Critical Area' },
      { topic: 'IP Subnetting & Networking Basics', accuracy: 30, completed: 4, status: 'Critical Area' }
    ];
  }, []);

  // Extract critical work categories
  const weakTopics = React.useMemo(() => {
    return topicCompetencyData.filter(item => item.accuracy < 60);
  }, [topicCompetencyData]);

  // Format elapsed seconds to Mins & Secs
  const formatDuration = (secs: number) => {
    const mm = Math.floor(secs / 60);
    const ss = secs % 60;
    return mm > 0 ? `${mm}m ${ss}s` : `${ss}s`;
  };

  return (
    <PageContainer className="max-w-5xl space-y-7">
      
      {/* Dynamic Header motivational block */}
      <div className="bg-gradient-to-r from-primary/[0.04] via-card to-secondary/[0.02] border border-border rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="success" className="text-[10px] uppercase font-bold tracking-wider font-mono py-0.5">
                Cohort Progress verified
              </Badge>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-mono text-muted-foreground font-semibold">User: bk6500416@gmail.com</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Acknowledge Your Growth, Riya! 📈
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Analyze your continuous benchmark progression timeline. We leverage cognitive diagnostic telemetry to pinpoint dynamic gaps so your test day results are fully optimized.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-xs border p-3 rounded-xl shadow-xs self-start sm:self-auto shrink-0 font-mono">
            <Activity className="h-4 w-4 text-emerald-500 shrink-0" />
            <div className="space-y-0.5">
              <span className="text-[9px] text-muted-foreground block uppercase font-bold">Accuracy Curve</span>
              <strong className="text-xs text-emerald-500 font-extrabold flex items-center">
                +{stats.scoreImprovement}% Over Baseline
                <ArrowUpRight className="h-3 w-3 ml-0.5" />
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* THREE EXQUISITE SHADCN STATS CARDS */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="hover:border-primary/20 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                Best Test Accuracy
              </span>
              <h2 className="text-2.5xl sm:text-3xl font-black text-foreground tracking-tight leading-none">
                {stats.bestScore}%
              </h2>
              <p className="text-[11px] text-muted-foreground font-semibold leading-none">
                Highest recorded benchmark score
              </p>
            </div>
            <div className="h-12 w-12 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
              <Award className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/20 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                Continuous Average
              </span>
              <h2 className="text-2.5xl sm:text-3xl font-black text-foreground tracking-tight leading-none">
                {stats.averageScore}%
              </h2>
              <p className="text-[11px] text-muted-foreground font-semibold leading-none">
                Overall mean across all attempts
              </p>
            </div>
            <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/20 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                Completed Mock Exams
              </span>
              <h2 className="text-2.5xl sm:text-3xl font-black text-foreground tracking-tight leading-none">
                {stats.count} / {stats.count + 1}
              </h2>
              <p className="text-[11px] text-muted-foreground font-semibold leading-none">
                Assigned syllabus tests completed
              </p>
            </div>
            <div className="h-12 w-12 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DUAL CORE CHARTS BLOCK WITH TABS CONTROLLER */}
      <Card className="border border-border">
        <CardHeader className="pb-4 border-b border-border/20 bg-muted/[0.05]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-base font-black text-foreground tracking-tight flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Performance Improvement Visualizers
              </CardTitle>
              <CardDescription className="text-xs">
                Leverage live evaluation graphs to measure subject comprehension.
              </CardDescription>
            </div>

            {/* TAB SELECTORS */}
            <div className="flex bg-muted p-1 rounded-xl self-start sm:self-auto border">
              {[
                { id: 'trends', label: 'Score Trajectory' },
                { id: 'competency', label: 'Topic Competency' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    activeTab === tab.id 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {activeTab === 'trends' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Plot area */}
              <div className="lg:col-span-2 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-muted-foreground pb-2">
                  <span>BASELINE (60%)</span>
                  <span>CURRENT (80%)</span>
                </div>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={allAttempts}
                      margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.15} />
                      <XAxis 
                        dataKey="submittedAt" 
                        stroke="#71717a" 
                        fontSize={10} 
                        tickLine={false}
                        tickFormatter={(str) => {
                          try {
                            const date = new Date(str);
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          } catch (e) {
                            return str;
                          }
                        }}
                      />
                      <YAxis 
                        domain={[40, 100]} 
                        stroke="#71717a" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card/95 border border-border p-3 rounded-lg shadow-md font-sans space-y-1 max-w-[240px]">
                                <span className="text-[10px] text-muted-foreground block font-mono">{data.submittedAt}</span>
                                <strong className="text-xs text-foreground block leading-tight">{data.title}</strong>
                                <div className="border-t border-border/40 my-1 pt-1 flex justify-between gap-4 text-xs font-mono">
                                  <span className="text-emerald-500 font-extrabold">{data.percentage}% Accuracy</span>
                                  <span className="text-muted-foreground">{data.score} / {data.totalMarks} Marks</span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        name="Mock Exam Performance"
                        type="monotone"
                        dataKey="percentage"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        activeDot={{ r: 6 }}
                        dot={{ r: 4, strokeWidth: 2, fill: "hsl(var(--background))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Trajectory Insights column */}
              <div className="bg-muted/[0.04] p-5 rounded-2xl border border-border/80 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <Badge variant="outline" className="text-[10px] font-mono font-bold font-black tracking-wider uppercase">
                    Continuous Trend Note
                  </Badge>
                  <h3 className="text-xs font-black text-foreground uppercase tracking-wider">
                    Syllabus Diagnostic Insights
                  </h3>
                  <div className="space-y-3 font-sans text-xs text-muted-foreground leading-relaxed">
                    <div className="flex gap-2 items-start">
                      <div className="h-5 w-5 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center shrink-0 font-bold">1</div>
                      <p>
                        <strong>Steady Ascent</strong>: Your scores increased by 20% on computer fundamentals compared to early month baselines.
                      </p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <div className="h-5 w-5 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center shrink-0 font-bold">2</div>
                      <p>
                        <strong>DCA Formula Target</strong>: Reviewing Excel spreadsheets formulas is highly vital. Raising Excel scores by 15% will lift your average past 85%.
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full text-xs font-bold gap-1.5 h-9"
                  onClick={() => {
                    window.location.hash = '/student/tests';
                  }}
                >
                  <span>Review Pending Papers</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Plot area */}
              <div className="lg:col-span-2 space-y-2">
                <span className="text-[10px] text-muted-foreground font-mono block">ACCURACY COMPREHENSION RATIOS PER SUBJECT (%)</span>
                <div className="h-[280px] w-full pt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topicCompetencyData}
                      layout="vertical"
                      margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.15} horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} stroke="#71717a" fontSize={10} tickLine={false} />
                      <YAxis 
                        type="category" 
                        dataKey="topic" 
                        stroke="#71717a" 
                        fontSize={9} 
                        tickLine={false} 
                        width={130}
                        axisLine={false}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card/95 border border-border p-3 rounded-lg shadow-md font-sans text-xs space-y-0.5">
                                <strong className="text-foreground font-bold">{data.topic}</strong>
                                <div className="text-primary font-mono font-black">{data.accuracy}% Accuracy</div>
                                <span className="text-muted-foreground text-[10px] block">Questions Attempted: {data.completed}</span>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="accuracy" radius={[0, 4, 4, 0]} barSize={12}>
                        {topicCompetencyData.map((entry, index) => {
                          let color = 'hsl(var(--primary))';
                          if (entry.accuracy >= 80) color = '#10b981';
                          else if (entry.accuracy < 50) color = '#ef4444';
                          else if (entry.accuracy < 65) color = '#f59e0b';
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Progress metrics custom bars list */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-foreground uppercase tracking-wider">
                  Category Status Breakdown
                </h3>
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {topicCompetencyData.map((item, idx) => {
                    const isExcellent = item.accuracy >= 80;
                    const isWeak = item.accuracy < 50;
                    const statusClass = isExcellent 
                      ? 'text-emerald-500 bg-emerald-500/5' 
                      : isWeak 
                        ? 'text-rose-500 bg-rose-500/5' 
                        : 'text-amber-500 bg-amber-500/5';
                    const barColor = isExcellent ? 'bg-emerald-500' : isWeak ? 'bg-rose-500' : 'bg-amber-500';

                    return (
                      <div key={idx} className="space-y-1 font-sans text-xs">
                        <div className="flex justify-between items-center text-[11px] font-medium">
                          <span className="text-foreground truncate max-w-[170px]" title={item.topic}>
                            {item.topic}
                          </span>
                          <span className={`font-mono px-1.5 py-0.5 rounded text-[10px] font-bold ${statusClass}`}>
                            {item.accuracy}%
                          </span>
                        </div>
                        <LocalProgress value={item.accuracy} color={barColor} className="h-1.5" />
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </CardContent>
      </Card>

      {/* HIGHLIGHT: WEAK TOPICS SECTION VISUALLY EMBEDDED */}
      <Card className="border border-amber-500/20 bg-amber-500/[0.02]">
        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
              Dynamic Revision Blueprint: Identified Learning Gaps ({weakTopics.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Topics where accuracy levels measure below the 60% Passing mark. Boost your score by revising these tags.
            </CardDescription>
          </div>
          
          <Button 
            className="text-xs font-black bg-amber-500 text-white hover:bg-amber-600 cursor-pointer h-9 shrink-0 gap-1.5"
            onClick={() => {
              window.location.hash = '/student/weak-areas';
            }}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Open Custom Study Help</span>
          </Button>
        </CardHeader>
        
        <CardContent className="p-5 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weakTopics.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-card border rounded-xl p-4 flex flex-col justify-between gap-3 hover:border-amber-500/45 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-foreground">{item.topic}</span>
                    <Badge variant="destructive" className="text-[9px] font-mono font-black py-0 px-2 uppercase bg-rose-500/10 text-rose-500 hover:bg-rose-500/10 border-none">
                      {item.accuracy}% Accuracy
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Evaluated from {item.completed} syllabus diagnostic exercises. Minimum recommended threshold standard is 60%.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-muted/40 border text-[11px] text-muted-foreground font-sans line-clamp-2">
                  <strong className="text-amber-600 dark:text-amber-400 font-bold block text-[10px] uppercase font-mono">Assigned Revision Guide:</strong>
                  {item.topic.includes('Excel') 
                    ? 'Refer to Excel Formulas cheat-sheet in Student Labs Space.' 
                    : item.topic.includes('Networking') 
                      ? 'Re-attempt Networking IP basics practice quiz or video manual #4.' 
                      : 'Review Chapter 3 Digital Security & Protocols guide manual.'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* BOTTOM EXQUISITE HISTORY TABLE */}
      <Card className="overflow-hidden border border-border">
        <CardHeader className="p-5 bg-muted/[0.06] border-b border-border/40 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-black text-foreground tracking-tight flex items-center gap-2">
              <History className="h-4.5 w-4.5 text-primary" />
              Comprehensive Mock Test History Log
            </CardTitle>
            <CardDescription className="text-xs">
              Review full solution keys and time spent on each completed assignment.
            </CardDescription>
          </div>
          <span className="text-xs text-muted-foreground font-mono bg-muted border px-2.5 py-1 rounded">
            All Records: {allAttempts.length} Assessments Registered
          </span>
        </CardHeader>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-xs uppercase font-mono py-3">Mock Assessment Title</TableHead>
                <TableHead className="font-bold text-xs uppercase font-mono text-center">Submission Date</TableHead>
                <TableHead className="font-bold text-xs uppercase font-mono text-center">Question Answers</TableHead>
                <TableHead className="font-bold text-xs uppercase font-mono text-center">Time Spent</TableHead>
                <TableHead className="font-bold text-xs uppercase font-mono text-center">Obtained Score</TableHead>
                <TableHead className="font-bold text-xs uppercase font-mono text-right">Solutions Review</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allAttempts.map((item) => {
                const isPassed = item.percentage >= 50;
                
                return (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="align-middle py-3.5">
                      <div className="space-y-1">
                        <span className="font-extrabold text-foreground text-xs block leading-tight">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground block font-mono">
                          ID: {item.testId}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center font-mono text-xs text-muted-foreground align-middle">
                      {item.submittedAt}
                    </TableCell>

                    <TableCell className="text-center align-middle">
                      <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                        <span className="text-emerald-500 font-bold">{item.correctCount}✔</span>
                        <span>/</span>
                        <span className="text-rose-500 font-bold">{item.wrongCount}❌</span>
                        {item.skippedCount > 0 && (
                          <>
                            <span>/</span>
                            <span className="text-slate-500 font-bold">{item.skippedCount}Ø</span>
                          </>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-center font-mono text-xs text-muted-foreground align-middle">
                      {formatDuration(item.durationSeconds)}
                    </TableCell>

                    <TableCell className="text-center align-middle">
                      <div className="inline-flex flex-col items-center justify-center">
                        <Badge 
                          variant={isPassed ? 'success' : 'destructive'} 
                          className="font-mono font-black text-[10px] mb-0.5"
                        >
                          {item.percentage}%
                        </Badge>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {item.score}/{item.totalMarks} Marks
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right align-middle">
                      {item.testId.startsWith('test-') ? (
                        <Button
                          variant="outline"
                          className="h-8 text-[11px] font-bold px-3 gap-1 hover:border-primary/40"
                          onClick={() => {
                            window.location.hash = `/student/tests/${item.testId}/result`;
                          }}
                        >
                          <span>Analyze Solutions</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      ) : (
                        <Badge variant="secondary" className="text-[9px] font-mono py-1">
                          Key Locked
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
      
    </PageContainer>
  );
}
