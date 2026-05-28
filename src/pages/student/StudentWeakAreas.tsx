import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  Cell
} from 'recharts';
import { 
  Compass, 
  Sparkles, 
  BookOpen, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  UserCheck,
  Check,
  HelpCircle,
  GraduationCap,
  MessageSquare,
  BookmarkCheck,
  Flame,
  ArrowUpRight,
  TrendingUp,
  RotateCcw,
  Info
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge, 
  PageContainer,
  Button,
  Modal
} from '../../components/ui/CustomComponents';

// --- LOGICAL PROGRESS BAR ---
function LocalProgress({ value, className = '', color = 'bg-primary' }: { value: number; className?: string; color?: string }) {
  return (
    <div className={`w-full bg-[#f4f4f5] dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden ${className}`}>
      <div 
        className={`${color} h-2.5 rounded-full transition-all duration-500 ease-out`} 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

// --- DYNAMIC TYPE DEFINITIONS ---
interface WeakArea {
  id: string;
  subject: string;
  topic: string;
  accuracyBefore: number;
  accuracyNow: number;
  completedDrills: number;
  recommendation: string;
  practiceSuggestion: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// --- PRACTICE QUESTION DEFINITION FOR DYNAMIC TESTING ---
interface PracticeQuestion {
  id: string;
  qText: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export default function StudentWeakAreas() {
  // Personalized state starting data
  const [weakAreas, setWeakAreas] = React.useState<WeakArea[]>([
    { 
      id: 'wa-1', 
      subject: 'MS Excel', 
      topic: 'Spreadsheet Formulas', 
      accuracyBefore: 20, 
      accuracyNow: 40,
      completedDrills: 2,
      recommendation: 'Master nested AVERAGE(), COUNTIF(), and conditional logical boundaries.', 
      practiceSuggestion: 'Practice structured workbook formulation queries in Student Lab Worksheet #3.',
      difficulty: 'Intermediate'
    },
    { 
      id: 'wa-2', 
      subject: 'Networking', 
      topic: 'IP Subnetting Basics', 
      accuracyBefore: 15, 
      accuracyNow: 30,
      completedDrills: 1,
      recommendation: 'Deduce network subnet hosts, CIDR block values, and dynamic IP gateways.', 
      practiceSuggestion: 'Attempt standard network diagnostic flowcharts or take consecutive CCNA introductory quizzes.',
      difficulty: 'Advanced'
    },
    { 
      id: 'wa-3', 
      subject: 'Internet Concepts', 
      topic: 'Network Security & Ports', 
      accuracyBefore: 35, 
      accuracyNow: 48,
      completedDrills: 3,
      recommendation: 'Memorize protocol port allocations (e.g. HTTPS-443, SSH-22, SMTP-25).', 
      practiceSuggestion: 'Review Digital Certificate trust guidelines and study the ports key-value logs.',
      difficulty: 'Intermediate'
    },
    { 
      id: 'wa-4', 
      subject: 'O Level Programming', 
      topic: 'C Program Operators', 
      accuracyBefore: 30, 
      accuracyNow: 50,
      completedDrills: 4,
      recommendation: 'Trace logical shift instructions, modulo remainder arithmetic, and ternary operators.', 
      practiceSuggestion: 'Dry-run nested loop codes manually and practice evaluating complex variable statements.',
      difficulty: 'Advanced'
    }
  ]);

  // Coach signature detail
  const teacherNote = {
    sender: 'Vineet Sir',
    role: 'Head of Academic Success & Senior CCC Instructor',
    note: "Hello Riya, I reviewed your mock diagnostic metrics from this week. You have achieved excellent double-digit gains in Document Writers (+22% accuracy)! However, Spreadsheet Formulas and Subnetting host evaluations are currently holding back your passing average. I have compiled 4 custom remedial guides for you below. Clear the dynamic drills on each card to unlock extra passing marks!",
    avatarInitials: 'VS',
    lastUpdated: 'May 28, 2026'
  };

  // Recharts target improvement comparison dataset
  const trendComparisonData = React.useMemo(() => {
    return weakAreas.map(wa => ({
      name: wa.topic,
      "Initial Diagnostic (%)": wa.accuracyBefore,
      "Current Knowledge (%)": wa.accuracyNow,
      "Improvement Gain": wa.accuracyNow - wa.accuracyBefore
    }));
  }, [weakAreas]);

  // Active micro state tracking
  const [activeDrillTopic, setActiveDrillTopic] = React.useState<WeakArea | null>(null);
  const [drillSubmitting, setDrillSubmitting] = React.useState(false);
  const [drillStep, setDrillStep] = React.useState<'quiz' | 'result'>('quiz');
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [drillScore, setDrillScore] = React.useState(0);
  const [revealedTooltipId, setRevealedTooltipId] = React.useState<string | null>(null);

  // Hardcoded mini-questions per weak area to simulate a real "Practice Test / Drill" dynamic
  const topicQuestions: Record<string, PracticeQuestion> = {
    'wa-1': {
      id: 'wa-1-q',
      qText: 'In Excel, which of the following is the correct syntax to calculate sum values across cells A1 to A5 only if they exceed $100?',
      options: [
        '=SUM(A1:A5, ">100")',
        '=SUMIF(A1:A5, ">100")',
        '=COUNTIF(A1:A5, ">100")',
        '=IF(A1:A5 > 100, SUM(A1:A5))'
      ],
      correctIdx: 1,
      explanation: '=SUMIF(range, criteria) takes the defined cells range and evaluates conditional constraints to sum values.'
    },
    'wa-2': {
      id: 'wa-2-q',
      qText: 'What is the standard subnet mask for the CIDR notation /26?',
      options: [
        '255.255.255.128',
        '255.255.255.192',
        '255.255.255.240',
        '255.255.255.224'
      ],
      correctIdx: 1,
      explanation: 'A CIDR notation `/26` allocates 24 bits for network classes and 2 additional bits for block segment. 128 + 64 = 192 (subnet mask 255.255.255.192).'
    },
    'wa-3': {
      id: 'wa-3-q',
      qText: 'Which transport layer protocol and default destination port number are utilized by Secure Shell (SSH)?',
      options: [
        'UDP port 23',
        'TCP port 22',
        'TCP port 80',
        'UDP port 443'
      ],
      correctIdx: 1,
      explanation: 'SSH is a secure, connection-oriented service utilizing TCP on standard designated destination port 22.'
    },
    'wa-4': {
      id: 'wa-4-q',
      qText: 'In C programming code, what is the output computed by the expression (11 % 4) + (5 / 2)?',
      options: [
        '5',
        '4.5',
        '5.5',
        '6'
      ],
      correctIdx: 0,
      explanation: 'Integer modulo 11 % 4 evaluates to 3. Integer division 5 / 2 evaluates to 2 (truncating decimal fractions). 3 + 2 = 5.'
    }
  };

  const handleLaunchDrill = (area: WeakArea) => {
    setActiveDrillTopic(area);
    setSelectedAnswer(null);
    setDrillStep('quiz');
  };

  const handleSubmitDrillAnswer = () => {
    if (activeDrillTopic === null || selectedAnswer === null) return;
    setDrillSubmitting(true);
    
    setTimeout(() => {
      const q = topicQuestions[activeDrillTopic.id];
      const isCorrect = selectedAnswer === q.correctIdx;
      
      if (isCorrect) {
        setDrillScore(100);
        // Live update the topic accuracy metrics in state to show visual reward instantly
        setWeakAreas(prev => prev.map(item => {
          if (item.id === activeDrillTopic.id) {
            const nextAcc = Math.min(100, item.accuracyNow + 15);
            return {
              ...item,
              accuracyNow: nextAcc,
              completedDrills: item.completedDrills + 1
            };
          }
          return item;
        }));
      } else {
        setDrillScore(0);
      }
      setDrillStep('result');
      setDrillSubmitting(false);
    }, 450);
  };

  // Safe container classes
  return (
    <PageContainer className="max-w-5xl space-y-7">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/[0.04] via-card to-[#fafafb] dark:to-zinc-900 border border-amber-500/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5Col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider font-mono border-amber-500/30 text-amber-600 bg-amber-500/5">
                Target Remedial Action Engine
              </Badge>
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-mono text-muted-foreground font-semibold">Diagnostic Target: Under 60% Passing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1.5">
              Targeted Concept Drills: Riya Sen 🎯
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Don't be discouraged! Identified weak areas represent your fastest paths to an outstanding final grade. Review recommended interventions and complete tailored micro-drills below to raise your scores.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-card p-3 rounded-xl border shadow-xs max-w-xs self-start sm:self-auto shrink-0 font-sans">
            <Flame className="h-5 w-5 text-amber-500 animate-bounce" />
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest block">Focus Challenge</span>
              <span className="text-xs font-bold text-foreground block">Resolve 4 Core Deficiencies</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Before vs Now Trajectory Card & Interactive Teacher Note Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* A. BEFORE VS NOW ANALYSIS TRACING (7 COLS) */}
        <Card className="lg:col-span-7 border border-border flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-border/20">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-base font-black text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Performance Trajectory: Before vs. Now
                </CardTitle>
                <CardDescription className="text-xs">
                  See real improvement computed dynamically from initial diagnostics to current attempts.
                </CardDescription>
              </div>
              <Badge className="font-mono text-[9px] font-bold">4 Categories Mapped</Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trendComparisonData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.15} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#71717a" 
                    fontSize={9} 
                    tickLine={false} 
                    tickFormatter={(val) => {
                      // Shorten names for clean fit
                      if (val.length > 14) return val.substring(0, 12) + '...';
                      return val;
                    }}
                  />
                  <YAxis domain={[0, 100]} stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-card/95 border border-border p-3 rounded-lg shadow-md font-sans text-xs space-y-1.5 max-w-[220px]">
                            <strong className="text-foreground font-black block border-b pb-1">{data.name}</strong>
                            <div className="flex justify-between gap-4 text-muted-foreground">
                              <span>Initial Diagnostic:</span>
                              <span className="font-mono font-bold text-rose-500">{payload[0].value}%</span>
                            </div>
                            <div className="flex justify-between gap-4 text-foreground">
                              <span>Current Practice:</span>
                              <span className="font-mono font-bold text-emerald-500">{payload[1].value}%</span>
                            </div>
                            <div className="text-[10px] text-primary font-mono font-black pt-1 block leading-none">
                              Comprehension Boost: +{data["Improvement Gain"]}%
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    iconSize={10} 
                    wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} 
                  />
                  <Bar name="Initial Diagnostic" dataKey="Initial Diagnostic (%)" fill="#f43f5e" alpha={0.75} radius={[3, 3, 0, 0]} barSize={14} />
                  <Bar name="Current Practice" dataKey="Current Knowledge (%)" fill="#10b981" radius={[3, 3, 0, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/40 font-sans text-center">
              <div className="bg-rose-500/[0.02] p-2.5 rounded-xl border border-rose-500/10">
                <span className="text-[10px] text-muted-foreground block uppercase font-mono font-bold">Diagnostic Average</span>
                <span className="text-lg font-black text-rose-500">23.8% Accuracy</span>
              </div>
              <div className="bg-emerald-500/[0.02] p-2.5 rounded-xl border border-emerald-500/10">
                <span className="text-[10px] text-muted-foreground block uppercase font-mono font-bold">Current Practice Average</span>
                <span className="text-lg font-black text-emerald-500">{Math.round(weakAreas.reduce((sum, w) => sum + w.accuracyNow, 0) / weakAreas.length)}% Accuracy</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* B. TEACHER NOTE CARD (5 COLS) */}
        <Card className="lg:col-span-5 border border-primary/10 bg-primary/[0.01] flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
          <CardHeader className="pb-2 p-5 border-b border-border/20">
            <Badge variant="success" className="text-[9px] uppercase font-mono font-bold rounded-md py-0 px-2 tracking-wider inline-flex mb-1 w-fit">
              ★ Active Remedial Mentor Plan
            </Badge>
            <CardTitle className="text-sm font-black text-foreground flex items-center gap-1.5 uppercase tracking-wide">
              <MessageSquare className="h-4.5 w-4 text-primary shrink-0" />
              Teacher Log &amp; Study Guide
            </CardTitle>
            <CardDescription className="text-xs">
              Direct recommendations from your mentor coordinator.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 pt-4 space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex gap-3 items-start bg-muted/40 p-3.5 rounded-xl border border-border/80">
                <div className="h-10 w-10 bg-primary text-primary-foreground font-black text-xs rounded-full flex items-center justify-center shrink-0 shadow-xs">
                  {teacherNote.avatarInitials}
                </div>
                <div className="space-y-1">
                  <strong className="text-xs font-black text-foreground block">{teacherNote.sender}</strong>
                  <span className="text-[9px] text-muted-foreground font-mono font-semibold block leading-none">{teacherNote.role}</span>
                </div>
              </div>

              <blockquote className="text-[11px] sm:text-xs text-muted-foreground italic leading-relaxed border-l-2 border-primary/20 pl-3">
                "{teacherNote.note}"
              </blockquote>
            </div>

            <div className="pt-3 border-t border-border/40 text-[10px] font-mono text-muted-foreground flex justify-between items-center bg-muted/20 p-2.5 rounded-lg">
              <span>Class Record: Riya Sen</span>
              <span>Updated: {teacherNote.lastUpdated}</span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* 3. Personalized Weak Topics Breakdown list standard grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="h-4.5 w-4.5 text-primary" />
              Category Remedial Guides ({weakAreas.length})
            </h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Take the custom concept practice tests down below to close your knowledge gaps.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {weakAreas.map((area) => {
            const isCritical = area.accuracyNow < 40;
            const isIntermediate = area.accuracyNow >= 40 && area.accuracyNow < 50;
            
            // Visual state configurations
            const statusLabel = isCritical ? 'Critical Deficiency' : isIntermediate ? 'Approaching Benchmark' : 'Revision Completed';
            const progressColor = isCritical ? 'bg-amber-500' : 'bg-primary';
            const badgeTone = isCritical ? 'destructive' : 'secondary';

            return (
              <Card 
                key={area.id} 
                className="border border-border hover:border-primary/25 transition-all relative overflow-hidden flex flex-col justify-between"
              >
                {/* Micro visual top decoration */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] ${isCritical ? 'bg-amber-500' : 'bg-primary'}`} />

                <CardHeader className="pb-3 p-5">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                        {area.subject}
                      </span>
                      <CardTitle className="text-xs sm:text-sm font-black text-foreground tracking-tight mt-1">
                        {area.topic}
                      </CardTitle>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant={badgeTone} className="text-[9px] uppercase font-black py-0 px-2 tracking-wider">
                        {statusLabel}
                      </Badge>
                      <span className="font-mono text-[10px] text-muted-foreground">{area.difficulty}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                  {/* Progress & Custom interactive Tooltip trigger */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-semibold flex items-center gap-1">
                        Dynamic Accuracy
                        <button
                          type="button"
                          className="hover:text-foreground text-muted-foreground cursor-pointer transition-colors shrink-0"
                          onClick={() => setRevealedTooltipId(revealedTooltipId === area.id ? null : area.id)}
                          title="Click to view cognitive tracer info"
                        >
                          <Info className="h-3 w-3" />
                        </button>
                      </span>
                      <span className="font-mono font-black text-primary text-xs">
                        {area.accuracyNow}%
                      </span>
                    </div>
                    <LocalProgress value={area.accuracyNow} className="h-2 rounded-full" color={progressColor} />

                    {/* Popover / Custom interactive state Tooltip details */}
                    <AnimatePresence>
                      {revealedTooltipId === area.id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-2.5 rounded bg-muted/60 border text-[10px] text-muted-foreground border-dashed border-primary/20 leading-relaxed space-y-1 font-sans"
                        >
                          <strong className="text-primary font-bold block uppercase tracking-wider">Tracer Diagnostics:</strong>
                          <p>
                            Initial base score was extremely weak ({area.accuracyBefore}%). Practiced {area.completedDrills} custom exercises. Score now stands at {area.accuracyNow}%. Minimum target to satisfy institutional standard is 60%.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Syllabus / Study Recommendations */}
                  <div className="space-y-3 pt-3 border-t border-border/40 font-sans text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                        <BookmarkCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-foreground">Syllabus Intervention</span>
                      </div>
                      <p className="text-muted-foreground leading-normal italic pl-5">
                        "{area.recommendation}"
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                        <UserCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-foreground">Practice suggestion</span>
                      </div>
                      <p className="text-muted-foreground leading-normal pl-5">
                        {area.practiceSuggestion}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 text-xs font-black gap-1.5"
                      onClick={() => handleLaunchDrill(area)}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>Start Concept Quiz</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 4. Dynamic General bottom intervention CTA */}
      <Card className="border border-indigo-500/15 bg-indigo-500/[0.01]">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1.5">
              <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
              Simulated Mock Practice Exam
            </h3>
            <p className="text-muted-foreground text-xs leading-normal max-w-xl">
              Ready to verify outstanding syllabus comprehension? Standard mock exams comprise 100 random questions across all subjects to measure target exam day readiness.
            </p>
          </div>

          <Button 
            className="text-xs font-black bg-indigo-500 text-white hover:bg-indigo-600 h-10 px-5 shrink-0 gap-1.5 cursor-pointer"
            onClick={() => {
              window.location.hash = '/student/tests';
            }}
          >
            <span>Practice Mock Tests</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* 5. CONCEPT DRILL DIALOG MODAL (SHADCN SPECS STYLE) */}
      <Modal
        isOpen={activeDrillTopic !== null}
        onClose={() => setActiveDrillTopic(null)}
        title={activeDrillTopic ? `Syllabus Booster Exam: ${activeDrillTopic.topic}` : ''}
        description={activeDrillTopic ? `Remedial challenge prepared by Vineet Sir. Evaluate your diagnostic standards.` : ''}
      >
        {activeDrillTopic && (() => {
          const q = topicQuestions[activeDrillTopic.id];
          
          return (
            <div className="space-y-4">
              {drillStep === 'quiz' ? (
                <div className="space-y-4 text-slate-900 dark:text-slate-100">
                  <div className="p-3 bg-muted rounded-xl text-xs font-sans border flex gap-2">
                    <HelpCircle className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                    <strong>Challenge Question:</strong>
                  </div>

                  <div className="p-4 rounded-xl border font-sans text-xs sm:text-sm font-bold text-foreground leading-relaxed bg-card text-left">
                    {q.qText}
                  </div>

                  <div className="space-y-3">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedAnswer === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setSelectedAnswer(oIdx)}
                          className={`w-full p-2.5 rounded-lg border text-left text-xs font-sans flex items-center gap-3 transition-colors cursor-pointer ${
                            isSelected 
                              ? 'border-primary bg-primary/5 text-primary font-bold' 
                              : 'border-border bg-background hover:bg-muted'
                          }`}
                        >
                          <span className={`h-5.5 w-5.5 rounded-full flex items-center justify-center font-mono font-black text-[10px] border shrink-0 ${
                            isSelected ? 'bg-primary text-white border-transparent' : 'bg-muted border-border text-muted-foreground'
                          }`}>
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-border flex justify-end gap-2.5">
                    <Button variant="outline" size="sm" onClick={() => setActiveDrillTopic(null)} disabled={drillSubmitting}>
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSubmitDrillAnswer} 
                      disabled={selectedAnswer === null || drillSubmitting}
                      className="bg-primary text-primary-foreground font-black cursor-pointer"
                    >
                      {drillSubmitting ? 'Verifying...' : 'Submit Choice'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-center py-2">
                  {drillScore === 100 ? (
                    <div className="space-y-3">
                      <div className="h-12 w-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-7 w-7" />
                      </div>
                      <h3 className="text-sm font-black text-foreground">Remedial Concept Cleared!</h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        Your submitted answer was correct! We have recorded this gain. Your topic accuracy has been instantly credited by +15%.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="h-12 w-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                        <XCircle className="h-7 w-7" />
                      </div>
                      <h3 className="text-sm font-black text-foreground">Incorrect Approach Checked</h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed max-w-sm mx-auto">
                        A helpful learning opportunity! Review the expert detailed rationale guide below.
                      </p>
                    </div>
                  )}

                  <div className="p-3 text-left rounded-lg bg-muted text-xs text-muted-foreground leading-normal border font-sans">
                    <strong className="text-[10px] font-mono uppercase font-black tracking-wider text-foreground block mb-0.5">Mentor explanation:</strong>
                    {q.explanation}
                  </div>

                  <div className="pt-4 border-t border-border flex justify-center gap-2">
                    <Button 
                      className="text-xs font-bold" 
                      onClick={() => handleLaunchDrill(activeDrillTopic)}
                      variant={drillScore === 100 ? 'outline' : 'default'}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      <span>Retry Drill Exercise</span>
                    </Button>
                    <Button 
                      className="text-xs font-black bg-primary text-primary-foreground" 
                      onClick={() => setActiveDrillTopic(null)}
                    >
                      <span>Continue Revision</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>

    </PageContainer>
  );
}
