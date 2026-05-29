import * as React from 'react';
import { 
  Award, 
  Layers, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Filter,
  Download,
  Sparkles
} from 'lucide-react';
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
  TableCell
} from '../../components/ui/CustomComponents';

// Types for representation
interface BatchPerformance {
  batch: string;
  avgScore: number;
  weakTopic: string;
  status: 'Good' | 'Average' | 'Weak';
}

interface RankedStudent {
  rank: number;
  name: string;
  batch: string;
  score: number;
}

const batchPerformanceData: BatchPerformance[] = [
  { batch: 'CCC Morning', avgScore: 72, weakTopic: 'Excel shortcuts', status: 'Good' },
  { batch: 'CCC Evening', avgScore: 49, weakTopic: 'Internet concepts', status: 'Weak' },
  { batch: 'DCA Batch', avgScore: 81, weakTopic: 'Windows Operating System', status: 'Good' },
  { batch: 'O Level Cohort', avgScore: 89, weakTopic: 'C Programming Syntax', status: 'Good' },
  { batch: 'ADCA Evening', avgScore: 61, weakTopic: 'Database Query logic', status: 'Average' }
];

const topStudentsData: RankedStudent[] = [
  { rank: 1, name: 'Devansh Verma', batch: 'DCA Batch', score: 92 },
  { rank: 2, name: 'Nehal Shah', batch: 'O Level Cohort', score: 92 },
  { rank: 3, name: 'Kabir Bose', batch: 'ADCA Evening', score: 89 },
  { rank: 4, name: 'Sneha Reddy', batch: 'ADCA Evening', score: 88 },
  { rank: 5, name: 'Aarav Sharma', batch: 'CCC Morning', score: 84 }
];

const overallWeakTopics = [
  { topic: 'Excel formulas', count: 18, risk: 'High' },
  { topic: 'Networking basics & IP Subnets', count: 12, risk: 'Medium' },
  { topic: 'Internet concepts & HTTPS protocols', count: 11, risk: 'High' },
  { topic: 'C Syntax & Array Indices', count: 7, risk: 'Medium' }
];

export default function OwnerPerformance() {
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');
  const [toast, setToast] = React.useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleExport = () => {
    triggerToast("📥 Performance Report downloaded successfully in text table suite!");
  };

  const filteredBatches = batchPerformanceData.filter(b => {
    if (selectedStatus === 'all') return true;
    return b.status.toLowerCase() === selectedStatus.toLowerCase();
  });

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in pb-12 font-sans w-full max-w-7xl mx-auto px-4 md:px-0">
      
      {/* Toast popup */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 p-4 max-w-sm rounded-xl border border-primary/20 bg-card text-foreground shadow-lg flex items-start gap-3 animate-slide-in">
          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
            <Sparkles className="h-3 w-3" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold block">Status Update</span>
            <p className="text-[11px] text-muted-foreground leading-normal">{toast}</p>
          </div>
        </div>
      )}

      {/* Humble Page Header */}
      <div className="border-b border-border/60 pb-5 pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary shrink-0" />
            <span>Institute Performance Report</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 text-slate-500 italic">
            Simplified overview mapping active batches, ranked top performers, and overall critical weaknesses.
          </p>
        </div>
        
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95 self-start sm:self-center"
        >
          <Download className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Export Simple Report</span>
        </button>
      </div>

      {/* Grid wrapper for three primary reports specified by user */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Report 1: Batch Performance Table (Spans 8 Columns) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border border-border/80 shadow-xs h-full flex flex-col justify-between">
            <div>
              <CardHeader className="p-5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-black text-foreground flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-primary shrink-0" />
                    Batch Performance Table
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Average student mastery score versus identified weakest topic segment
                  </CardDescription>
                </div>
                
                {/* Status Filter */}
                <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground/65 shrink-0" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="text-xs border border-border bg-background rounded-lg px-2.5 py-1.5 focus:border-primary/50 outline-hidden"
                  >
                    <option value="all">All statuses</option>
                    <option value="good">Good (&gt; 70%)</option>
                    <option value="average">Average (50% - 70%)</option>
                    <option value="weak">Weak (&lt; 50%)</option>
                  </select>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0">
                <div className="overflow-x-auto border border-border/60 rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/10">
                        <TableHead className="font-extrabold text-xs">Batch</TableHead>
                        <TableHead className="font-extrabold text-xs text-center">Avg Score</TableHead>
                        <TableHead className="font-extrabold text-xs">Weak Topic</TableHead>
                        <TableHead className="font-extrabold text-xs text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBatches.map((b, idx) => (
                        <TableRow key={idx} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="align-middle py-3.5 font-bold text-xs text-foreground">
                            {b.batch}
                          </TableCell>
                          
                          <TableCell className="align-middle py-3.5 text-center font-mono font-extrabold text-xs">
                            <span className={b.avgScore < 50 ? 'text-rose-500' : b.avgScore < 75 ? 'text-amber-500' : 'text-emerald-500'}>
                              {b.avgScore}%
                            </span>
                          </TableCell>
                          
                          <TableCell className="align-middle py-3.5">
                            <Badge variant="outline" className="text-[10px] font-mono py-0 bg-muted/35 font-bold">
                              {b.weakTopic}
                            </Badge>
                          </TableCell>
                          
                          <TableCell className="align-middle py-3.5 text-right">
                            <Badge className={`text-[10px] font-bold ${
                              b.status === 'Good' 
                                ? 'bg-emerald-500/10 text-emerald-600' 
                                : b.status === 'Average' 
                                ? 'bg-amber-500/10 text-amber-600' 
                                : 'bg-rose-500/10 text-rose-600'
                            }`} variant="custom">
                              {b.status} {b.status === 'Weak' && '⚠️'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </div>

            <CardContent className="p-5 pt-0">
              <div className="p-3.5 bg-muted/20 border border-border/60 rounded-xl text-xs flex items-start gap-2 text-slate-600 mt-2">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="leading-normal">
                  <strong>Practical Recommendation:</strong> Direct the coordinator of <span className="font-bold text-rose-600">CCC Evening</span> batch to schedule a remedial test on <span className="font-bold">Internet concepts</span> this week. No custom configuration required.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report 2: Weak Topics Overall (Spans 4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border border-border/80 shadow-xs h-full flex flex-col justify-between">
            <div>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base font-black text-foreground flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                  Weak Topics Overall
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Top problem concepts based on low-scoring mock responses
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3">
                {overallWeakTopics.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-border/80 bg-card hover:bg-muted/20 transition-all flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-foreground block">{item.topic}</span>
                      <span className="text-[10px] text-muted-foreground block">{item.count} students struggling</span>
                    </div>
                    <div>
                      <Badge className={`text-[9px] font-mono leading-none ${
                        item.risk === 'High' 
                          ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' 
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`} variant="custom">
                        {item.risk} Risk
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </div>

            <CardContent className="p-5 pt-0">
              <div className="h-px bg-border/60 mb-3" />
              <p className="text-[10px] text-muted-foreground italic text-center select-none">
                Risk triggers auto-calculate from failed practice mock attempts
              </p>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Report 3: Top Students (Ranked list) */}
      <Card className="border border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-base font-black text-foreground flex items-center gap-1.5">
            <Award className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
            Top Performing Students
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Ranked list of highest scoring learners across every institute batch
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 pt-0">
          <div className="overflow-x-auto border border-border/60 rounded-xl">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10">
                  <TableHead className="font-extrabold text-xs w-[80px] text-center">Rank</TableHead>
                  <TableHead className="font-extrabold text-xs pl-4">Student name</TableHead>
                  <TableHead className="font-extrabold text-xs">Current Batch</TableHead>
                  <TableHead className="font-extrabold text-xs text-right pr-4">Mean Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topStudentsData.map((student) => (
                  <TableRow key={student.rank} className="hover:bg-muted/20 transition-colors">
                    {/* Rank Badge Column */}
                    <TableCell className="align-middle text-center py-3.5">
                      <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                        student.rank === 1 
                          ? 'bg-yellow-500/10 text-yellow-600 font-extrabold' 
                          : student.rank === 2 
                          ? 'bg-slate-300 text-slate-800' 
                          : student.rank === 3 
                          ? 'bg-amber-600/15 text-amber-700' 
                          : 'text-muted-foreground'
                      }`}>
                        #{student.rank}
                      </span>
                    </TableCell>

                    {/* Student Name */}
                    <TableCell className="align-middle py-3.5 font-bold text-xs text-foreground pl-4">
                      {student.name}
                    </TableCell>

                    {/* Current Class Batch */}
                    <TableCell className="align-middle py-3.5 text-xs text-muted-foreground">
                      {student.batch}
                    </TableCell>

                    {/* Mean Score Result % */}
                    <TableCell className="align-middle py-3.5 text-right font-mono font-black text-xs text-emerald-600 pr-4">
                      {student.score}% Accuracy
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
