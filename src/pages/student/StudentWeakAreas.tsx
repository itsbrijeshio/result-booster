import * as React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  Play, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { 
  Card, 
  Badge 
} from '../../components/ui/CustomComponents';

export default function StudentWeakAreas() {
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStartPractice = () => {
    triggerToast("⚡ Loading 'CCC Excel Practice Test'... Best of luck!");
    setTimeout(() => {
      window.location.hash = '/student/tests';
    }, 1200);
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in pb-12 font-sans w-full max-w-4xl mx-auto px-4 md:px-0">
      
      {/* Toast Notification */}
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

      {/* Title Header */}
      <div className="border-b border-border/60 pb-5 pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
          <span>My Weak Areas</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1 text-slate-500 italic">
          Bhai Excel weak hai, ye practice karo • Actionable learning routes for custom mock preparations.
        </p>
      </div>

      {/* Grid containing Section 1 & Section 2 */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* SECTION 1 — Weak Topics & Why Weak? */}
        <Card className="border border-border/80 shadow-xs p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                Your Weak Topics
              </h3>
            </div>

            {/* List with Status badges */}
            <div className="space-y-3">
              {[
                { name: 'Excel Formulas', level: 'Weak' },
                { name: 'Internet Concepts', level: 'Medium' },
                { name: 'MS Word Formatting', level: 'Weak' }
              ].map((topic, i) => (
                <div 
                  key={i} 
                  className="p-3 rounded-xl border border-border/60 bg-card flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-foreground">
                    {topic.name}
                  </span>
                  
                  <Badge 
                    className={`text-[9px] font-mono uppercase tracking-wider shrink-0 font-bold px-2 py-0.5 ${
                      topic.level === 'Weak' 
                        ? 'bg-rose-500/10 text-rose-700 hover:bg-rose-500/10 border-transparent' 
                        : 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 border-transparent'
                    }`}
                  >
                    {topic.level}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border/60 pt-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>Why Weak?</span>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="p-2.5 rounded-lg bg-rose-500/5 text-[11px] leading-relaxed">
                📢 <strong className="text-rose-700">Excel Formulas:</strong> You answered questions incorrectly in your last 3 practice drills.
              </div>
              <div className="p-2.5 rounded-lg bg-amber-500/5 text-[11px] leading-relaxed">
                📢 <strong className="text-amber-700">Internet Concepts:</strong> Overall diagnostic tests scored under passing marks threshold.
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 2 — What To Improve (Focus This Week) */}
        <Card className="border border-border/80 shadow-xs p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
            <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
              Focus This Week
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { text: 'Practice Excel shortcut questions', detail: 'Revise Ctrl key combos for quick navigation' },
              { text: 'Revise Internet basics', detail: 'Familiarize with standard protocol port definitions' },
              { text: 'Attempt 1 Excel mock test', detail: 'Evaluate nested formula selections' }
            ].map((task, idx) => (
              <div key={idx} className="flex gap-3 items-start p-2.5 hover:bg-muted/10 rounded-lg transition-colors">
                <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">{task.text}</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">{task.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* SECTION 3 — Recommended Test */}
      <Card className="border border-primary/25 bg-primary/[0.01] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <Badge className="text-[9px] font-mono tracking-wider bg-primary/10 text-primary border-none font-bold">
              RECOMMENDED DRILL
            </Badge>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              Suggested Practice Test: <span className="font-black text-primary">“CCC Excel Practice Test”</span>
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl">
              Targeted simulation designed to check and improve your primary knowledge gap: Excel Formulas.
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartPractice}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary/95 text-primary-foreground font-black text-xs rounded-xl cursor-pointer active:scale-95 transition-all shrink-0"
          >
            <Play className="h-3.5 w-3.5" />
            <span>Start Practice</span>
          </button>
        </div>
      </Card>

    </div>
  );
}
