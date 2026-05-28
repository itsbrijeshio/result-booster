import * as React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie, 
  Sector,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  Sparkles, 
  Award, 
  Calendar, 
  ChevronDown, 
  Check, 
  Download, 
  Filter, 
  HelpCircle, 
  Info, 
  Search, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Layers, 
  Users,
  Activity,
  Maximize2
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge,
  PageContainer,
} from '../../components/ui/CustomComponents';

// --- DATA TYPES ---
interface StudentPerformanceRecord {
  id: string;
  name: string;
  email: string;
  batchId: string;
  batchName: string;
  initialScore: number;     // Pre-booster diagnostic average
  currentScore: number;     // Post-booster average (current diagnostic)
  improvement: number;      // Current - Initial
  testScores: number[];     // Score history for inconsistency index calculation
  completionRate: number;   // Assigned tests submitted %
  joinedDate: string;
  status: 'active' | 'inactive';
}

// 12 Premium student arrays model representing cross-batch records
const studentPerformanceData: StudentPerformanceRecord[] = [
  {
    id: 'st-1',
    name: 'Aarav Sharma',
    email: 'aarav@resultbooster.com',
    batchId: 'batch-1',
    batchName: 'CCC Morning Batch A',
    initialScore: 68,
    currentScore: 84,
    improvement: 16,
    testScores: [85, 80, 88, 79, 88],
    completionRate: 100,
    joinedDate: '2026-03-12',
    status: 'active'
  },
  {
    id: 'st-2',
    name: 'Ananya Goel',
    email: 'ananya@resultbooster.com',
    batchId: 'batch-1',
    batchName: 'CCC Morning Batch A',
    initialScore: 41,
    currentScore: 56,
    improvement: 15,
    testScores: [50, 58, 48, 62, 62],
    completionRate: 85,
    joinedDate: '2026-03-15',
    status: 'active'
  },
  {
    id: 'st-3',
    name: 'Devansh Verma',
    email: 'devansh@resultbooster.com',
    batchId: 'batch-2',
    batchName: 'DCA Regular Batch B',
    initialScore: 78,
    currentScore: 92,
    improvement: 14,
    testScores: [92, 88, 95, 92, 93],
    completionRate: 98,
    joinedDate: '2026-04-01',
    status: 'active'
  },
  {
    id: 'st-4',
    name: 'Ishita Patel',
    email: 'ishita@resultbooster.com',
    batchId: 'batch-2',
    batchName: 'DCA Regular Batch B',
    initialScore: 44,
    currentScore: 49,
    improvement: 5,
    testScores: [35, 78, 42, 53, 37], // Extremely Inconsistent (spread 35 to 78)
    completionRate: 75,
    joinedDate: '2026-04-03',
    status: 'active'
  },
  {
    id: 'st-5',
    name: 'Kabir Bose',
    email: 'kabir@resultbooster.com',
    batchId: 'batch-3',
    batchName: 'ADCA Evening Advanced',
    initialScore: 70,
    currentScore: 89,
    improvement: 19,
    testScores: [89, 87, 90, 89, 90],
    completionRate: 100,
    joinedDate: '2026-01-20',
    status: 'active'
  },
  {
    id: 'st-6',
    name: 'Riya Sen',
    email: 'bk6500416@gmail.com', // Logged in user match!
    batchId: 'batch-1',
    batchName: 'CCC Morning Batch A',
    initialScore: 62,
    currentScore: 83,
    improvement: 21,
    testScores: [75, 85, 70, 94, 91], // Slightly Inconsistent
    completionRate: 94,
    joinedDate: '2026-02-10',
    status: 'active'
  },
  {
    id: 'st-7',
    name: 'Kunal Kapoor',
    email: 'kunal@resultbooster.com',
    batchId: 'batch-2',
    batchName: 'DCA Regular Batch B',
    initialScore: 35,
    currentScore: 68,
    improvement: 33, // Most improved student
    testScores: [58, 72, 60, 68, 82],
    completionRate: 92,
    joinedDate: '2026-03-24',
    status: 'active'
  },
  {
    id: 'st-8',
    name: 'Sneha Reddy',
    email: 'sneha@reddy.com',
    batchId: 'batch-3',
    batchName: 'ADCA Evening Advanced',
    initialScore: 64,
    currentScore: 88,
    improvement: 24, // High improvement
    testScores: [82, 92, 84, 91, 93],
    completionRate: 100,
    joinedDate: '2026-02-28',
    status: 'active'
  },
  {
    id: 'st-9',
    name: 'Vikram Malhotra',
    email: 'vikram@malhotra.com',
    batchId: 'batch-3',
    batchName: 'ADCA Evening Advanced',
    initialScore: 48,
    currentScore: 74,
    improvement: 26,
    testScores: [40, 94, 52, 91, 93], // Highly Inconsistent (spread 40 to 94)
    completionRate: 80,
    joinedDate: '2026-03-18',
    status: 'active'
  },
  {
    id: 'st-10',
    name: 'Pooja Patel',
    email: 'pooja@patel.com',
    batchId: 'batch-4',
    batchName: 'O Level Programming Cohort',
    initialScore: 58,
    currentScore: 85,
    improvement: 27,
    testScores: [85, 82, 88, 83, 87],
    completionRate: 96,
    joinedDate: '2026-04-10',
    status: 'active'
  },
  {
    id: 'st-11',
    name: 'Pranav Joshi',
    email: 'pranav@joshi.com',
    batchId: 'batch-4',
    batchName: 'O Level Programming Cohort',
    initialScore: 52,
    currentScore: 82,
    improvement: 30, // Exceptional improvement
    testScores: [80, 84, 78, 83, 85],
    completionRate: 90,
    joinedDate: '2026-04-15',
    status: 'active'
  },
  {
    id: 'st-12',
    name: 'Nehal Shah',
    email: 'nehal@shah.com',
    batchId: 'batch-4',
    batchName: 'O Level Programming Cohort',
    initialScore: 74,
    currentScore: 92,
    improvement: 18,
    testScores: [91, 93, 89, 94, 93],
    completionRate: 100,
    joinedDate: '2026-03-05',
    status: 'active'
  }
];

// Topics accuracy definitions to construct dynamic aggregate metrics
interface TopicAcc {
  topic: string;
  accuracy: Record<string, number>; // batchId -> accuracy score
}

const topicPerformanceData: TopicAcc[] = [
  { topic: 'Spreadsheet Formulas', accuracy: { 'batch-1': 78, 'batch-2': 42, 'batch-3': 88, 'batch-4': 92, 'all': 75 } },
  { topic: 'Windows Operations', accuracy: { 'batch-1': 84, 'batch-2': 58, 'batch-3': 85, 'batch-4': 90, 'all': 79 } },
  { topic: 'Internet Security Protocols', accuracy: { 'batch-1': 70, 'batch-2': 49, 'batch-3': 79, 'batch-4': 85, 'all': 71 } },
  { topic: 'C Program Semantics', accuracy: { 'batch-1': 60, 'batch-2': 38, 'batch-3': 84, 'batch-4': 89, 'all': 68 } },
  { topic: 'IP Subnetting Logic', accuracy: { 'batch-1': 74, 'batch-2': 40, 'batch-3': 76, 'batch-4': 86, 'all': 69 } },
];

export default function OwnerPerformance() {
  // --- STATE ---
  const [selectedBatchId, setSelectedBatchId] = React.useState<string>('all');
  const [datePreset, setDatePreset] = React.useState<'7d' | '30d' | 'month' | 'all'>('month');
  const [startDate, setStartDate] = React.useState<string>('2026-05-01');
  const [endDate, setEndDate] = React.useState<string>('2026-05-28');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  
  // Custom dropdown display switches
  const [showBatchDropdown, setShowBatchDropdown] = React.useState<boolean>(false);
  const [showDatePickerPopover, setShowDatePickerPopover] = React.useState<boolean>(false);
  
  // Bottom Rank table tab switch
  const [activeTableTab, setActiveTableTab] = React.useState<'performers' | 'improved' | 'inconsistent'>('performers');
  
  // Toast notifications trigger tracking
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [isExporting, setIsExporting] = React.useState<boolean>(false);
  
  // Interactive hover tracking
  const [hoveredHeatmapCell, setHoveredHeatmapCell] = React.useState<{ topic: string; value: number; label: string } | null>(null);
  const [pieHoverIndex, setPieHoverIndex] = React.useState<number | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --- DYNAMIC DATA FILTER CALCULATION ---
  const filteredStudents = React.useMemo(() => {
    return studentPerformanceData.filter(student => {
      // 1. Filter by Batch Selection
      const batchMatch = selectedBatchId === 'all' || student.batchId === selectedBatchId;
      return batchMatch;
    });
  }, [selectedBatchId]);

  // Dynamic statistics calculated from filtered dataset
  const metrics = React.useMemo(() => {
    if (filteredStudents.length === 0) {
      return {
        passRate: 0,
        avgScore: 0,
        mostImproved: 'N/A',
        mostImprovedDelta: 0,
        weakestBatch: 'N/A',
        weakestBatchAvg: 0
      };
    }

    // Pass rate calculations: individual average score >= 50%
    const totalCount = filteredStudents.length;
    const passCount = filteredStudents.filter(s => s.currentScore >= 60).length; // Passing standard is 60%
    const passRate = Math.round((passCount / totalCount) * 100);

    // Initial and current score average
    const currentSum = filteredStudents.reduce((acc, s) => acc + s.currentScore, 0);
    const avgScore = Math.round((currentSum / totalCount) * 10) / 10;

    // Most improved student in currently filtered array
    const sortedImproved = [...filteredStudents].sort((a, b) => b.improvement - a.improvement);
    const topImproved = sortedImproved[0];
    const mostImproved = topImproved ? `${topImproved.name}` : 'N/A';
    const mostImprovedDelta = topImproved ? topImproved.improvement : 0;

    // Weakest batch calculation using all student database
    const batchSums: Record<string, { sum: number; count: number; name: string }> = {};
    studentPerformanceData.forEach(student => {
      if (!batchSums[student.batchId]) {
        batchSums[student.batchId] = { sum: 0, count: 0, name: student.batchName };
      }
      batchSums[student.batchId].sum += student.currentScore;
      batchSums[student.batchId].count += 1;
    });

    let minAvg = 100;
    let weakestBatchName = 'None';
    Object.keys(batchSums).forEach(id => {
      const bAvg = batchSums[id].sum / batchSums[id].count;
      if (bAvg < minAvg) {
        minAvg = bAvg;
        weakestBatchName = batchSums[id].name;
      }
    });

    return {
      passRate,
      avgScore,
      mostImproved,
      mostImprovedDelta,
      weakestBatch: weakestBatchName.replace('Morning ', '').replace('Regular ', '').replace('Evening ', ''),
      weakestBatchAvg: Math.round(minAvg)
    };
  }, [filteredStudents]);

  // Calculate standard deviation helper to rank inconsistent students
  const calculateSD = (scores: number[]): number => {
    if (!scores || scores.length === 0) return 0;
    const n = scores.length;
    const mean = scores.reduce((a, b) => a + b, 0) / n;
    const variance = scores.map(s => Math.pow(s - mean, 2)).reduce((a, b) => a + b, 0) / n;
    return Math.round(Math.sqrt(variance) * 10) / 10;
  };

  // Ranking tables filters & sorting with search queries
  const processedTables = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    // Search filter
    const searchedList = filteredStudents.filter(student => 
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.batchName.toLowerCase().includes(query)
    );

    // 1. Top Performers (Rank by current score % descending)
    const performers = [...searchedList].sort((a, b) => b.currentScore - a.currentScore);

    // 2. Most Improved (Rank by score delta descending)
    const improved = [...searchedList].sort((a, b) => b.improvement - a.improvement);

    // 3. Most Inconsistent (Rank by standard deviation of scores descending)
    const inconsistent = [...searchedList].map(student => {
      const sd = calculateSD(student.testScores);
      const sortedHistory = [...student.testScores].sort((a, b) => a - b);
      const minScore = sortedHistory[0] || 0;
      const maxScore = sortedHistory[sortedHistory.length - 1] || 0;
      return {
        ...student,
        sd,
        minScore,
        maxScore,
        spread: maxScore - minScore
      };
    }).sort((a, b) => b.sd - a.sd);

    return {
      performers,
      improved,
      inconsistent
    };
  }, [filteredStudents, searchQuery]);

  // Custom data generator for Charts based on active filters
  const passRateTrendData = React.useMemo(() => {
    // Modify slightly depending on chosen batch to simulate exact interactive changes
    let offsetMultiplier = 1.0;
    if (selectedBatchId === 'batch-1') offsetMultiplier = 1.08;
    if (selectedBatchId === 'batch-2') offsetMultiplier = 0.81;
    if (selectedBatchId === 'batch-3') offsetMultiplier = 1.15;
    if (selectedBatchId === 'batch-4') offsetMultiplier = 1.20;

    const baseDays = [
      { date: 'May 1', controlPassRate: 52, boosterPassRate: 64 },
      { date: 'May 5', controlPassRate: 54, boosterPassRate: 68 },
      { date: 'May 10', controlPassRate: 53, boosterPassRate: 72 },
      { date: 'May 15', controlPassRate: 55, boosterPassRate: 75 },
      { date: 'May 20', controlPassRate: 54, boosterPassRate: 80 },
      { date: 'May 25', controlPassRate: 56, boosterPassRate: 85 },
      { date: 'May 28', controlPassRate: 57, boosterPassRate: 88 }
    ];

    return baseDays.map(item => ({
      date: item.date,
      controlPassRate: Math.min(100, Math.round(item.controlPassRate * (offsetMultiplier * 0.95))),
      boosterPassRate: Math.min(100, Math.round(item.boosterPassRate * offsetMultiplier))
    }));
  }, [selectedBatchId]);

  // Batch comparison dataset
  const batchComparisonData = React.useMemo(() => {
    return [
      { name: 'CCC Batch A', avgScore: 81.2, controlAvg: 65, studentCount: 120 },
      { name: 'DCA Batch B', avgScore: 61.5, controlAvg: 58, studentCount: 95 },
      { name: 'ADCA Advanced', avgScore: 85.0, controlAvg: 70, studentCount: 150 },
      { name: 'O Level Cohort', avgScore: 89.4, controlAvg: 72, studentCount: 45 }
    ];
  }, []);

  // Completion metric data (Pie chart representation: Completed vs Pending totals)
  const testCompletionPercentData = React.useMemo(() => {
    const totalAverages = filteredStudents.reduce((acc, s) => acc + s.completionRate, 0);
    const avgCompleted = filteredStudents.length > 0 ? Math.round(totalAverages / filteredStudents.length) : 88;
    const avgPending = 100 - avgCompleted;

    return [
      { name: 'Completed Submissions', value: avgCompleted, color: '#6366f1' },
      { name: 'Pending Retakes', value: avgPending, color: '#f43f5e' }
    ];
  }, [filteredStudents]);

  // Export spreadsheet processor trigger
  const triggerExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      triggerToast(`📥 Excel compilation successful: Saved 'ResultBooster-Institute-Performance-Analysis-${new Date().toISOString().split('T')[0]}.xlsx' securely to your local downloads directory.`);
    }, 1500);
  };

  return (
    <PageContainer>
      {/* Toast Popup Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-55 p-4.5 bg-foreground text-background dark:bg-card dark:text-foreground border border-border rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 font-semibold transition-all">
          <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse shrink-0" />
          <span className="text-xs">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION WITH BARS */}
      <div className="flex flex-col gap-1 w-full border-b border-border/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">
          <Activity className="h-3.5 w-3.5 text-primary" />
          <span>Evaluation Intelligence Hub</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-1">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight font-sans">
              Institute Performance Metrics
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-normal">
              Continuous academic tracking comparing experimental booster diagnostics, completion compliance benchmarks, and granular topic weaknesses.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 self-start shrink-0">
            <button
              onClick={triggerExport}
              disabled={isExporting}
              className={`inline-flex items-center gap-2 h-9 px-4 text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs ${
                isExporting 
                  ? 'bg-muted text-muted-foreground border border-border cursor-wait' 
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              }`}
            >
              {isExporting ? (
                <>
                  <div className="h-3.5 w-3.5 border-1.5 border-muted-foreground border-t-transparent animate-spin rounded-full" />
                  Compiling...
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  Export Data Suite
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* DYNAMIC TOP TOOLBAR CONTROLS FILTER PANEL */}
      <div className="bg-card border border-border/80 rounded-2xl p-4.5 shadow-xs flex flex-wrap items-center justify-between gap-4 relative z-20">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* BATCH SELECTOR DROPDOWN */}
          <div className="relative">
            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1 font-mono">Cohort Mapping</label>
            <button
              onClick={() => {
                setShowBatchDropdown(!showBatchDropdown);
                setShowDatePickerPopover(false);
              }}
              className="inline-flex items-center justify-between w-64 h-9 px-3.5 text-xs font-bold border border-border rounded-xl bg-background hover:bg-muted/50 text-foreground transition-all cursor-pointer gap-2"
            >
              <div className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">
                  {selectedBatchId === 'all' 
                    ? 'All Batches (Combined Analytics)' 
                    : selectedBatchId === 'batch-1' ? 'CCC Morning Batch A'
                    : selectedBatchId === 'batch-2' ? 'DCA Regular Batch B'
                    : selectedBatchId === 'batch-3' ? 'ADCA Evening Advanced'
                    : 'O Level Programming Cohort'
                  }
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
            </button>

            {/* Dropdown Menu Items */}
            {showBatchDropdown && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowBatchDropdown(false)} />
                <div className="absolute left-0 mt-1.5 w-72 bg-card border border-border rounded-xl shadow-xl z-40 p-2 divide-y divide-border/45 animate-in fade-in slide-in-from-top-2">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSelectedBatchId('all');
                        setShowBatchDropdown(false);
                        triggerToast("Showing compiled stats for all institute-wide batches.");
                      }}
                      className={`w-full flex items-center justify-between text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-muted ${selectedBatchId === 'all' ? 'text-primary' : 'text-foreground'}`}
                    >
                      <span>All Batches (Combined Analytics)</span>
                      {selectedBatchId === 'all' && <Check className="h-4.5 w-4.5 text-primary shrink-0" />}
                    </button>
                  </div>
                  <div className="py-1.5 space-y-0.5">
                    {[
                      { id: 'batch-1', name: 'CCC Morning Batch A' },
                      { id: 'batch-2', name: 'DCA Regular Batch B' },
                      { id: 'batch-3', name: 'ADCA Evening Advanced' },
                      { id: 'batch-4', name: 'O Level Programming Cohort' }
                    ].map((batch) => (
                      <button
                        key={batch.id}
                        onClick={() => {
                          setSelectedBatchId(batch.id);
                          setShowBatchDropdown(false);
                          triggerToast(`Successfully isolated performance logs to: "${batch.name}"`);
                        }}
                        className={`w-full flex items-center justify-between text-left px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-muted ${selectedBatchId === batch.id ? 'text-primary' : 'text-foreground'}`}
                      >
                        <span>{batch.name}</span>
                        {selectedBatchId === batch.id && <Check className="h-4.5 w-4.5 text-primary shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* DATE RANGE FILTER POPOVER */}
          <div className="relative">
            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1 font-mono">Temporal Threshold</label>
            <button
              onClick={() => {
                setShowDatePickerPopover(!showDatePickerPopover);
                setShowBatchDropdown(false);
              }}
              className="inline-flex items-center justify-between w-64 h-9 px-3.5 text-xs font-bold border border-border rounded-xl bg-background hover:bg-muted/50 text-foreground transition-all cursor-pointer gap-2"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">
                  {datePreset === '7d' ? 'Last 7 Days (Short Cycle)'
                    : datePreset === '30d' ? 'Last 30 Days (Standard)'
                    : datePreset === 'month' ? 'This Month (May 2026)'
                    : `Custom: ${startDate} to ${endDate}`
                  }
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground/60" />
            </button>

            {/* Simulated premium date-picker popover */}
            {showDatePickerPopover && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowDatePickerPopover(false)} />
                <div className="absolute left-0 mt-1.5 w-80 bg-card border border-border rounded-xl shadow-xl z-40 p-4.5 space-y-4 animate-in fade-in slide-in-from-top-2">
                  
                  {/* Presets segment */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground block uppercase font-mono">Presets Quick Select</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Last 7 Days', id: '7d', start: '2026-05-21', end: '2026-05-28' },
                        { label: 'Last 30 Days', id: '30d', start: '2026-04-28', end: '2026-05-28' },
                        { label: 'This Month', id: 'month', start: '2026-05-01', end: '2026-05-28' },
                        { label: 'All-Time Logs', id: 'all', start: '2026-01-01', end: '2026-05-28' }
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => {
                            setDatePreset(preset.id as any);
                            setStartDate(preset.start);
                            setEndDate(preset.end);
                            setShowDatePickerPopover(false);
                            triggerToast(`Date filter updated: Analysis optimized for range ${preset.start} - ${preset.end}`);
                          }}
                          className={`px-3 py-1.5 text-left text-xs font-bold rounded-lg border transition-all ${
                            datePreset === preset.id 
                              ? 'bg-primary/10 text-primary border-primary/20' 
                              : 'bg-background hover:bg-muted border-border'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual pickers */}
                  <div className="space-y-3 pt-3 border-t border-border">
                    <span className="text-[10px] font-bold text-muted-foreground block uppercase font-mono">Custom Interval Selection</span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-muted-foreground block">From Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            setDatePreset('all'); // switch to custom visual mode
                          }}
                          className="w-full bg-background border border-border rounded-lg p-1 px-2 text-[10.5px] font-mono focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-muted-foreground block">To Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            setDatePreset('all');
                          }}
                          className="w-full bg-background border border-border rounded-lg p-1 px-2 text-[10.5px] font-mono focus:outline-none focus:border-primary text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        setShowDatePickerPopover(false);
                        triggerToast(`Applied custom date limits: ${startDate} to ${endDate}`);
                      }}
                      className="px-3.5 py-1.5 bg-foreground text-background dark:bg-foreground dark:text-background font-bold text-xs rounded-lg cursor-pointer"
                    >
                      Confirm Bounds
                    </button>
                  </div>

                </div>
              </>
            )}
          </div>

        </div>

        {/* Clear active filter badge when non-default */}
        {(selectedBatchId !== 'all' || datePreset !== 'month') && (
          <button
            onClick={() => {
              setSelectedBatchId('all');
              setDatePreset('month');
              setStartDate('2026-05-01');
              setEndDate('2026-05-28');
              triggerToast("Filters restored to standard values.");
            }}
            className="text-[10px] font-bold text-primary underline hover:text-primary/80"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* CORE FOUR HIGH-METRIC CARDS GRID */}
      <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Metric 1: Overall Pass Rate */}
        <Card className="hover:border-border/100 border-border/50 relative overflow-hidden group transition-all">
          <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 text-muted-foreground/5 group-hover:text-muted-foreground/10 transition-colors">
            <CheckCircle className="h-20 w-20" />
          </div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground uppercase font-black tracking-wider block">Institute Pass Rate</span>
              <Badge variant="success" className="text-[9px] tracking-wide font-black uppercase text-emerald-600">
                +4.2% Boost
              </Badge>
            </div>
            <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {metrics.passRate}%
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-muted-foreground leading-normal mt-1 block">
              Percentage of total batch test takers scoring above the strict 60% accuracy benchmark.
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Average Score */}
        <Card className="hover:border-border/100 border-border/50 relative overflow-hidden group transition-all">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-1 text-muted-foreground/5 group-hover:text-muted-foreground/10 transition-colors">
            <TrendingUp className="h-16 w-16" />
          </div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground uppercase font-black tracking-wider block">Mean Score Index</span>
              <span className="px-1.5 py-0.5 bg-primary/10 text-primary font-mono text-[9px] font-black rounded uppercase">
                Diagnostic Value
              </span>
            </div>
            <h3 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {metrics.avgScore}%
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-muted-foreground leading-normal mt-1 block">
              Continuous collective mean derived over all mock evaluations mapped under selected constraints.
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: Most Improved Students */}
        <Card className="hover:border-border/100 border-border/50 relative overflow-hidden group transition-all">
          <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 text-muted-foreground/5 group-hover:text-muted-foreground/10 transition-colors">
            <Award className="h-20 w-20" />
          </div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground uppercase font-black tracking-wider block">Acceleration Leader</span>
              <div className="inline-flex items-center gap-0.5 text-emerald-600 font-bold font-mono text-xs">
                <ArrowUpRight className="h-3 w-3" />
                <span>+{metrics.mostImprovedDelta}%</span>
              </div>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground truncate mt-2 max-w-[200px]" title={metrics.mostImproved}>
              {metrics.mostImproved}
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-muted-foreground leading-normal mt-1 block">
              Highest performance climb calculated from baseline diagnostics up to modern evaluation checkpoints.
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: Weakest Batch / Sector */}
        <Card className="hover:border-border/100 border-border/50 relative overflow-hidden group transition-all">
          <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 text-muted-foreground/5 group-hover:text-muted-foreground/10 transition-colors">
            <AlertTriangle className="h-20 w-20" />
          </div>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-rose-500 uppercase font-black tracking-wider block">Priority Support</span>
              <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-600 font-mono text-[9px] font-black rounded">
                Needs Attention
              </span>
            </div>
            <h3 className="text-base font-extrabold tracking-tight text-foreground truncate mt-3 max-w-[210px]" title={metrics.weakestBatch}>
              {metrics.weakestBatch}
            </h3>
          </CardHeader>
          <CardContent>
            <span className="text-xs font-mono font-black text-rose-600 block mt-1">
              Cohort Mean: {metrics.weakestBatchAvg}% Avg
            </span>
            <p className="text-[11px] text-muted-foreground leading-normal mt-1 block">
              Targeted batch presenting lowest aggregated average score on simulated evaluations.
            </p>
          </CardContent>
        </Card>

      </div>

      {/* CORE GRAPHS SECTION - GRID COMPRISING FOUR SPECIFIC CHARTS */}
      <h2 className="text-xs font-black uppercase tracking-widest font-mono text-muted-foreground">
        Institute Diagnostics Chart Suite
      </h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Chart 1: Pass Rate Trend (Line chart comparing booster and standard control) */}
        <Card className="border-border">
          <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle className="text-xs font-black uppercase tracking-widest font-mono text-muted-foreground flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-primary" />
                1. Pass Rate Trend Comparison (%)
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Booster accelerated learning curve versus typical progress in control settings.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono mt-2 sm:mt-0">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span>Booster Stream</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span>Control Stream</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 select-none">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={passRateTrendData}
                  margin={{ top: 15, right: 10, left: -25, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.35} vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis 
                    domain={[40, 100]} 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px'
                    }}
                    labelStyle={{ fontWeight: 'black', fontSize: '11px', color: 'var(--foreground)' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Line
                    type="monotone"
                    name="Result Booster"
                    dataKey="boosterPassRate"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ stroke: 'var(--primary)', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                  <Line
                    type="monotone"
                    name="Standard control"
                    dataKey="controlPassRate"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ stroke: '#94a3b8', strokeWidth: 1, r: 2 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Batch comparison (Bar chart with standard target threshold) */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest font-mono text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              2. Batch Evaluation Performance Comparison
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Visual analytics matching mean accuracy level versus strict passing threshold.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 select-none">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={batchComparisonData}
                  margin={{ top: 15, right: 10, left: -25, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" strokeOpacity={0.35} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={{ stroke: 'var(--border)' }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px'
                    }}
                    labelStyle={{ fontWeight: 'black', fontSize: '11px', color: 'var(--foreground)' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  {/* Passing Target Line (60%) */}
                  <ReferenceLine y={60} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Passing Bound (60%)', position: 'top', fill: '#ef4444', fontSize: 9, fontFamily: 'monospace' }} />
                  
                  <Bar dataKey="avgScore" maxBarSize={45} radius={[6, 6, 0, 0]}>
                    {batchComparisonData.map((entry, index) => {
                      const color = entry.avgScore >= 80 ? '#10b981' : entry.avgScore >= 60 ? '#6366f1' : '#f43f5e';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 3: Topic Weakness Heatmap Matrix Grid */}
        <Card className="border-border">
          <CardHeader className="pb-2 border-b border-border bg-muted/15 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <CardTitle className="text-xs font-black uppercase tracking-widest font-mono text-muted-foreground flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" />
                  3. Topic Weakness Heatmap Cross-Mapping
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Average score check per category. Green flags highlight mastery; red warns focus needs.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-[8px] font-mono mt-1 sm:mt-0">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-emerald-500" /> &gt;75%</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-indigo-500" /> 50% - 75%</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-rose-500" /> &lt;50%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5 select-none">
            <div className="space-y-4">
              
              {/* Heatmap Matrix layout */}
              <div className="space-y-2.5">
                
                {/* Columns Header (Batches) */}
                <div className="flex items-center font-mono text-[9px] font-extrabold text-muted-foreground border-b border-border pb-1">
                  <div className="w-[140px] text-left shrink-0">Topic Sector</div>
                  <div className="flex-1 grid grid-cols-4 gap-1.5 text-center">
                    <div>CCC A</div>
                    <div>DCA B</div>
                    <div>ADCA</div>
                    <div>O Level</div>
                  </div>
                </div>

                {/* Rows Grid Cell */}
                <div className="space-y-2 divide-y divide-border/25">
                  {topicPerformanceData.map((data, idx) => (
                    <div key={idx} className="flex items-center pt-2 group">
                      <div className="w-[140px] text-left font-bold text-xs text-foreground truncate block leading-none pr-2" title={data.topic}>
                        {data.topic}
                      </div>

                      <div className="flex-1 grid grid-cols-4 gap-1.5">
                        {['batch-1', 'batch-2', 'batch-3', 'batch-4'].map((bId) => {
                          const val = data.accuracy[bId] || 50;
                          let cellBg = 'bg-rose-500 text-white dark:bg-rose-600/80';
                          if (val >= 75) {
                            cellBg = 'bg-emerald-500 text-white dark:bg-emerald-600/80';
                          } else if (val >= 50) {
                            cellBg = 'bg-indigo-500 text-white dark:bg-indigo-600/80';
                          }

                          return (
                            <div
                              key={bId}
                              onMouseEnter={() => setHoveredHeatmapCell({
                                topic: data.topic,
                                value: val,
                                label: bId === 'batch-1' ? 'CCC Morning A' : bId === 'batch-2' ? 'DCA Regular B' : bId === 'batch-3' ? 'ADCA Evening Advanced' : 'O Level Programming'
                              })}
                              onMouseLeave={() => setHoveredHeatmapCell(null)}
                              className={`h-9 rounded-lg flex flex-col items-center justify-center font-bold font-mono text-[10.5px] cursor-pointer transition-all hover:scale-105 active:scale-95 ${cellBg} shadow-xs`}
                            >
                              <span>{val}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Heatmap interactive HUD */}
              <div className="bg-muted/40 border border-border/80 p-2 px-3 rounded-xl min-h-[36px] flex items-center justify-center text-center text-[10.5px]">
                {hoveredHeatmapCell ? (
                  <div className="flex items-center gap-1.5 animate-fade-in text-foreground">
                    <span className="font-bold text-primary">{hoveredHeatmapCell.label}</span>
                    <span className="text-muted-foreground">scores</span>
                    <strong className={hoveredHeatmapCell.value >= 75 ? 'text-emerald-500' : hoveredHeatmapCell.value >= 50 ? 'text-indigo-400' : 'text-rose-500'}>
                      {hoveredHeatmapCell.value}%
                    </strong>
                    <span className="text-muted-foreground">on</span>
                    <span className="font-semibold">{hoveredHeatmapCell.topic}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground italic text-[9.5px]">
                    Hover over cells above to unlock instant batch-to-topic diagnostic telemetry.
                  </span>
                )}
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Chart 4: Test completion % (Pie Chart styled as hollow ring) */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest font-mono text-muted-foreground flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              4. Test Completion Compliance Index
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Distribution of submitted digital examinations versus pending student backlogs.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 flex flex-col items-center justify-center select-none relative">
            
            <div className="h-60 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={testCompletionPercentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    onMouseEnter={(_, idx) => setPieHoverIndex(idx)}
                    onMouseLeave={() => setPieHoverIndex(null)}
                  >
                    {testCompletionPercentData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        opacity={pieHoverIndex === null || pieHoverIndex === index ? 1 : 0.4}
                        stroke="var(--card)"
                        strokeWidth={2}
                        className="transition-all duration-300"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Inner Circle content label */}
              <div className="absolute inset-x-0 top-0 bottom-0 m-auto flex flex-col items-center justify-center h-28 w-28 text-center pointer-events-none">
                <span className="text-[10px] font-mono text-muted-foreground uppercase font-semibold leading-none">Compliant</span>
                <span className="text-2xl font-black text-foreground block tracking-tight mt-1">
                  {testCompletionPercentData[0].value}%
                </span>
                <span className="text-[9px] text-muted-foreground leading-none mt-1">(Submitted)</span>
              </div>
            </div>

            {/* Custom Pie Legend Labels */}
            <div className="flex items-center justify-center gap-5 mt-2 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-primary" />
                <span className="font-bold text-foreground">Submitted ({testCompletionPercentData[0].value}%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="font-bold text-foreground">Pending ({testCompletionPercentData[1].value}%)</span>
              </div>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* DETAILED INTERACTIVE PERFORMANCE COHORT TABLES SECTION */}
      <Card className="border-border">
        
        {/* Header containing tabs */}
        <div className="border-b border-border bg-muted/20 p-5 pb-0 flex flex-col gap-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-xs font-black uppercase tracking-widest font-mono text-primary flex items-center gap-2">
                <Users className="h-4.5 w-4.5" />
                Institute Cohort Rankings & Diagnostics Logs
              </CardTitle>
              <CardDescription className="text-xs">
                Filter and browse deep academic dimensions across candidate scores.
              </CardDescription>
            </div>

            {/* In-tab real-time student search key */}
            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search candidate names or emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 block w-full h-8 rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 placeholder:text-muted-foreground/65"
              />
            </div>
          </div>

          {/* TAB SYSTEM BUTTONS */}
          <div className="flex items-center gap-1 mb-[-1px] overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTableTab('performers')}
              className={`pb-3.5 px-4 text-xs font-bold font-sans border-b-2 transition-all cursor-pointer shrink-0 relative ${
                activeTableTab === 'performers' 
                  ? 'border-primary text-foreground font-black' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Top Performers ({processedTables.performers.length})
              {activeTableTab === 'performers' && (
                <span className="absolute bottom-0 inset-x-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTableTab('improved')}
              className={`pb-3.5 px-4 text-xs font-bold font-sans border-b-2 transition-all cursor-pointer shrink-0 relative ${
                activeTableTab === 'improved' 
                  ? 'border-primary text-foreground font-black' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Most Improved ({processedTables.improved.length})
              {activeTableTab === 'improved' && (
                <span className="absolute bottom-0 inset-x-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTableTab('inconsistent')}
              className={`pb-3.5 px-4 text-xs font-bold font-sans border-b-2 transition-all cursor-pointer shrink-0 relative ${
                activeTableTab === 'inconsistent' 
                  ? 'border-primary text-foreground font-black' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Most Inconsistent ({processedTables.inconsistent.length})
              {activeTableTab === 'inconsistent' && (
                <span className="absolute bottom-0 inset-x-4 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>

        </div>

        <CardContent className="p-0">
          
          {/* TAB 1: TOP PERFORMERS */}
          {activeTableTab === 'performers' && (
            <div className="overflow-x-auto">
              {processedTables.performers.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground font-mono">
                  No top performers match your active visual search key.
                </div>
              ) : (
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-muted/40 border-b border-border text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-black">
                    <tr>
                      <th className="p-4 pl-6">Rank Class</th>
                      <th className="p-4">Candidate Identity</th>
                      <th className="p-4">Cohort Stream Mapped</th>
                      <th className="p-4 text-center">Diagnostic Average</th>
                      <th className="p-4 text-center">Compliancy Ratio</th>
                      <th className="p-4 text-right pr-6">Status Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {processedTables.performers.map((student, index) => {
                      const isLoggedRiya = student.email === 'bk6500416@gmail.com';
                      return (
                        <tr key={student.id} className={`hover:bg-muted/15 transition-all ${isLoggedRiya ? 'bg-primary/[0.02] border-l-2 border-l-primary' : ''}`}>
                          <td className="p-4 pl-6 font-mono text-xs font-black text-muted-foreground">
                            {index + 1 === 1 ? (
                              <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full text-[10px] font-bold border border-amber-500/20">
                                🥇 Top 1
                              </span>
                            ) : index + 1 === 2 ? (
                              <span className="inline-flex items-center gap-1 bg-slate-500/10 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-500/20">
                                🥈 Rank 2
                              </span>
                            ) : (
                              `Rank #${index + 1}`
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black uppercase text-[10.5px]">
                                {student.name.split(' ').map(n=>n[0]).join('')}
                              </div>
                              <div className="space-y-0.5">
                                <span className="font-bold text-xs text-foreground block leading-tight">
                                  {student.name}
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground block leading-none">
                                  {student.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-semibold text-foreground">
                              {student.batchName}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">
                              {student.currentScore}%
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="max-w-[100px] mx-auto space-y-1">
                              <span className="text-[10px] font-mono block text-muted-foreground leading-none">{student.completionRate}% Done</span>
                              <div className="w-full bg-muted rounded-full h-1 relative overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: `${student.completionRate}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right pr-6">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                              Elite Learner
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 2: MOST IMPROVED */}
          {activeTableTab === 'improved' && (
            <div className="overflow-x-auto">
              {processedTables.improved.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground font-mono">
                  No improved students match your active visual search key.
                </div>
              ) : (
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-muted/40 border-b border-border text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-black">
                    <tr>
                      <th className="p-4 pl-6">Rank</th>
                      <th className="p-4">Candidate Identity</th>
                      <th className="p-4">Cohort Batch</th>
                      <th className="p-4 text-center">Baseline Test Mode</th>
                      <th className="p-4 text-center">Accelerated Score</th>
                      <th className="p-4 text-center">Total Boost Gained</th>
                      <th className="p-4 text-right pr-6">Booster Acceleration Climb</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {processedTables.improved.map((student, index) => {
                      const isLoggedRiya = student.email === 'bk6500416@gmail.com';
                      return (
                        <tr key={student.id} className={`hover:bg-muted/15 transition-all ${isLoggedRiya ? 'bg-primary/[0.02] border-l-2 border-l-primary' : ''}`}>
                          <td className="p-4 pl-6 font-mono text-xs font-black text-muted-foreground">
                            #{index + 1}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-black uppercase text-[10.5px]">
                                {student.name.split(' ').map(n=>n[0]).join('')}
                              </div>
                              <div className="space-y-0.5">
                                <span className="font-bold text-xs text-foreground block leading-tight">
                                  {student.name}
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground block leading-none">
                                  {student.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-semibold text-foreground">
                              {student.batchName}
                            </span>
                          </td>
                          <td className="p-4 text-center font-mono text-xs text-muted-foreground font-bold">
                            {student.initialScore}%
                          </td>
                          <td className="p-4 text-center font-mono text-xs text-foreground font-black">
                            {student.currentScore}%
                          </td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center gap-0.5 font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded px-1.5 py-0.5">
                              <ArrowUpRight className="h-3 w-3" />
                              +{student.improvement}%
                            </span>
                          </td>
                          <td className="p-4 text-right pr-6">
                            <div className="max-w-[120px] ml-auto space-y-1">
                              <div className="w-full bg-muted rounded-full h-1.5 relative overflow-hidden">
                                <div 
                                  className="bg-emerald-500 h-full rounded-full" 
                                  style={{ width: `${Math.min(100, (student.improvement / 33) * 100)}%` }} 
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 3: MOST INCONSISTENT */}
          {activeTableTab === 'inconsistent' && (
            <div className="overflow-x-auto">
              {processedTables.inconsistent.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground font-mono">
                  No inconsistent student indexes fit your search credentials.
                </div>
              ) : (
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-muted/40 border-b border-border text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-black">
                    <tr>
                      <th className="p-4 pl-6">Volatility Rank</th>
                      <th className="p-4">Student Identity</th>
                      <th className="p-4">Cohort Group</th>
                      <th className="p-4 text-center">Lowest Score</th>
                      <th className="p-4 text-center">Highest Peak</th>
                      <th className="p-4 text-center">Spread Range Δ</th>
                      <th className="p-4 text-right pr-6">Instability Index (SD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {processedTables.inconsistent.map((student, index) => {
                      const isLoggedRiya = student.email === 'bk6500416@gmail.com';
                      // Identify high volatility triggers (SD >= 10.0 is critical trigger)
                      const isVolatile = student.sd >= 10.0;
                      return (
                        <tr key={student.id} className={`hover:bg-muted/15 transition-all ${isLoggedRiya ? 'bg-primary/[0.02] border-l-2 border-l-primary' : ''}`}>
                          <td className="p-4 pl-6 font-mono text-xs font-black text-muted-foreground">
                            #{index + 1}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center font-black uppercase text-[10.5px]">
                                {student.name.split(' ').map(n=>n[0]).join('')}
                              </div>
                              <div className="space-y-0.5">
                                <span className="font-bold text-xs text-foreground block leading-tight flex items-center gap-1.5">
                                  {student.name}
                                  {isVolatile && (
                                    <Badge variant="destructive" className="px-1 border-transparent text-[8.5px] uppercase tracking-wide py-0">
                                      Flagged
                                    </Badge>
                                  )}
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground block leading-none">
                                  {student.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-semibold text-foreground">
                              {student.batchName}
                            </span>
                          </td>
                          <td className="p-4 text-center font-mono text-xs text-rose-600 dark:text-rose-450 font-bold">
                            {student.minScore}%
                          </td>
                          <td className="p-4 text-center font-mono text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                            {student.maxScore}%
                          </td>
                          <td className="p-4 text-center font-mono text-xs text-foreground font-black">
                            {student.spread}% variance
                          </td>
                          <td className="p-4 text-right pr-6">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold ${
                              isVolatile 
                                ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20' 
                                : 'bg-slate-500/10 text-slate-700 dark:text-slate-400'
                            }`}>
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                              <span>SD: {student.sd}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </CardContent>
        
        {/* Table footer info */}
        <div className="border-t border-border/80 bg-muted/10 p-4.5 text-xs text-muted-foreground font-semibold flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5">
            <Info className="h-4 w-4 text-primary shrink-0" />
            <span>Telemetry calculated in context with active filters. Recalculates dynamically.</span>
          </div>
          <span className="font-mono text-[10.5px]">
            Showing {filteredStudents.length} candidate entries total
          </span>
        </div>

      </Card>
    </PageContainer>
  );
}
