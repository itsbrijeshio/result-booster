import * as React from 'react';
import { 
  History, 
  TrendingUp, 
  AlertTriangle, 
  Award,
  Sparkles,
  ArrowRight,
  BookOpen
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
  TableCell,
  PageContainer
} from '../../components/ui/CustomComponents';

// Simple historical data for Rahul/Riya
interface HistoryItem {
  id: string;
  title: string;
  score: number;
  date: string;
}

const mockHistory: HistoryItem[] = [
  { id: 'h-1', title: 'MS Word Office Basics Trial', score: 85, date: '2026-05-10' },
  { id: 'h-2', title: 'Diagnostic Internet Protocols Drill', score: 55, date: '2026-05-15' },
  { id: 'h-3', title: 'Excel formulas complex workbook match', score: 46, date: '2026-05-22' },
  { id: 'h-4', title: 'Computer Hardware Basic Concepts Match', score: 62, date: '2026-05-28' }
];

export default function StudentProgress() {
  const [toast, setToast] = React.useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handlePracticeRevision = (topic: string) => {
    triggerToast(`⚡ Practice revision drill opened for ${topic}! Ready for action!`);
  };

  return (
    <PageContainer className="max-w-4xl space-y-6 lg:space-y-8 animate-fade-in pb-12 font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 p-4 max-w-sm rounded-xl border border-primary/20 bg-card text-foreground shadow-lg flex items-start gap-3 animate-slide-in">
          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5 animate-pulse">
            <Sparkles className="h-3 w-3" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold block">Status Booster</span>
            <p className="text-[11px] text-muted-foreground leading-normal">{toast}</p>
          </div>
        </div>
      )}

      {/* Simplified Student Progress Header */}
      <div className="border-b border-border/60 pb-5 pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary shrink-0" />
          <span>My Performance Log</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1 text-slate-500 italic">
          Keep track of your mock results, weak topics and improvement vectors — No clutter.
        </p>
      </div>

      {/* SECTION: Improvement Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        
        {/* Average Score: 62% */}
        <Card className="border border-border/80 shadow-xs hover:border-primary/20 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Average Score
              </span>
              <h2 className="text-3xl font-black text-primary font-mono tracking-tight leading-none">
                62%
              </h2>
              <p className="text-[11px] text-muted-foreground font-semibold leading-none">
                Passing target benchmark: 60%
              </p>
            </div>
            <div className="h-11 w-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
              <Award className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Weak Topic: Excel */}
        <Card className="border border-border/80 shadow-xs hover:border-destructive/20 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Weak Topic
              </span>
              <h2 className="text-3xl font-black text-rose-500 font-mono tracking-tight leading-none flex items-center gap-1.5">
                Excel
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-1" />
              </h2>
              <p className="text-[11px] text-muted-foreground font-semibold leading-none">
                Needs target mock drills
              </p>
            </div>
            <div className="h-11 w-11 bg-rose-500/10 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Best Topic: Word */}
        <Card className="border border-border/80 shadow-xs hover:border-emerald-500/20 transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                Best Topic
              </span>
              <h2 className="text-3xl font-black text-emerald-600 font-mono tracking-tight leading-none">
                Word
              </h2>
              <p className="text-[11px] text-muted-foreground font-semibold leading-none">
                Strong conceptual grasp
              </p>
            </div>
            <div className="h-11 w-11 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* SECTION: Test History */}
      <Card className="border border-border/80 shadow-xs">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <History className="h-4 w-4 text-primary shrink-0" />
            Test History Log
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Detailed log scoring history across all completed and attempted testing drills
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 pt-0">
          <div className="overflow-x-auto border border-border/60 rounded-xl">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/10">
                  <TableHead className="font-extrabold text-xs pl-4 py-3">Test Title</TableHead>
                  <TableHead className="font-extrabold text-xs text-center">Score</TableHead>
                  <TableHead className="font-extrabold text-xs text-right pr-4">Attempt Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockHistory.map((item) => {
                  const isPassed = item.score >= 60;
                  return (
                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                      {/* Title block */}
                      <TableCell className="align-middle py-3.5 pl-4">
                        <span className="font-bold text-foreground text-xs block">
                          {item.title}
                        </span>
                      </TableCell>

                      {/* Score Result Column */}
                      <TableCell className="align-middle text-center py-3.5">
                        <Badge 
                          variant={isPassed ? 'success' : 'destructive'} 
                          className="font-mono font-black text-[10px] px-2 py-0.5"
                        >
                          {item.score}%
                        </Badge>
                      </TableCell>

                      {/* Date Column */}
                      <TableCell className="align-middle text-right pr-4 py-3.5 font-mono text-xs text-muted-foreground">
                        {item.date}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Study Action recommendation */}
      <div className="p-4 bg-muted/20 border border-border/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-2.5">
          <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-foreground block">Ready to boost your Average?</span>
            <p className="text-[11px] text-muted-foreground">Select weak topics and practice dedicated mock drills to quickly hit 75%+ averages.</p>
          </div>
        </div>
        
        <button
          type="button"
          onClick={() => handlePracticeRevision('Excel')}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <span>Practice Excel Formulas</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

    </PageContainer>
  );
}
