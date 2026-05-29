import * as React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Award, 
  Play, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { 
  Card, 
  Badge 
} from '../../components/ui/CustomComponents';

interface StudentDashboardProps {
  onNavigate: (path: string) => void;
}

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStartTest = () => {
    triggerToast("⚡ Redirecting to testing chamber... Get ready!");
    setTimeout(() => {
      onNavigate('/student/tests');
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans w-full max-w-4xl mx-auto px-4 md:px-0">
      
      {/* Visual Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 max-w-sm rounded-xl border border-primary/20 bg-card text-foreground shadow-lg flex items-start gap-3 animate-slide-in">
          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5 animate-pulse">
            <Sparkles className="h-3 w-3" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold block">Booster Action</span>
            <p className="text-[11px] text-muted-foreground leading-normal">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Main Core Layout - Focused Action Screen */}
      <div className="space-y-6">

        {/* 1. Exam Status Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/80 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              Hi Rahul
            </h1>
            <p className="text-xs text-muted-foreground">
              Welcome back to your Result Booster dashboard.
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 text-rose-600 rounded-lg border border-rose-500/10 shrink-0">
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="text-xs font-bold tracking-tight font-mono">
              CCC Exam in 18 days
            </span>
          </div>
        </div>

        {/* Pending Tests & latest Result Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* 2. Pending Tests Card */}
          <div className="border border-border/80 rounded-2xl bg-card p-6 flex flex-col justify-between h-48">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Pending Tests
                </h3>
              </div>
              
              <div className="space-y-0.5">
                <p className="text-xl font-black text-foreground font-mono">
                  You have 2 pending mock tests
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Assigned by your institute coordinator
                </p>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleStartTest}
                className="w-full inline-flex items-center justify-center gap-1.5 h-9 bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold text-xs rounded-lg cursor-pointer transition-all active:scale-[0.98]"
              >
                <Play className="h-3 w-3 shrink-0" />
                <span>Start Test</span>
              </button>
            </div>
          </div>

          {/* 3. Latest Result Card */}
          <div className="border border-border/80 rounded-2xl bg-card p-6 flex flex-col justify-between h-48">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-emerald-500 shrink-0" />
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Latest Result
                </h3>
              </div>
              
              <div className="space-y-0.5">
                <p className="text-3xl font-black text-emerald-600 font-mono">
                  Last mock score: 68%
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Target threshold marks: 60% accuracy passing
                </p>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => onNavigate('/student/progress')}
                className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Timeline</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* 4. Quick Weak Alert */}
        <div className="border border-border/80 rounded-2xl bg-card p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground">Quick Weak Alert</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-muted-foreground">Weak in: </span>
                  <Badge variant="destructive" className="bg-rose-500/10 text-rose-700 hover:bg-rose-500/10 text-[10px] font-bold py-0 border-none shrink-0">Excel</Badge>
                  <Badge variant="destructive" className="bg-rose-500/10 text-rose-700 hover:bg-rose-500/10 text-[10px] font-bold py-0 border-none shrink-0">Internet</Badge>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/student/weak-areas')}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary hover:bg-secondary/85 text-foreground text-xs font-bold rounded-lg cursor-pointer transition-all active:scale-[0.98]"
            >
              <span>View Weak Areas</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
