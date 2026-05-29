import * as React from 'react';
import { 
  Users, 
  Layers, 
  FileSpreadsheet, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle, 
  Sliders, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  Check,
  Phone,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge, 
  Button,
  Modal,
  Input,
  Label,
  Separator
} from '../components/ui/CustomComponents';

export default function LandingPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  // Modal State for Demo Booking
  const [isDemoModalOpen, setIsDemoModalOpen] = React.useState(false);
  const [instituteName, setInstituteName] = React.useState('');
  const [ownerName, setOwnerName] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [studentCount, setStudentCount] = React.useState('50-100');
  const [isBooked, setIsBooked] = React.useState(false);

  // Accordion State for FAQ
  const [faqOpen, setFaqOpen] = React.useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false
  });

  const handleBookDemo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      setIsDemoModalOpen(false);
      // reset fields
      setInstituteName('');
      setOwnerName('');
      setWhatsapp('');
    }, 3000);
  };

  const toggleFaq = (idx: number) => {
    setFaqOpen(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="w-full min-h-screen bg-background text-foreground antialiased selection:bg-muted font-sans flex flex-col">
      
      {/* ================= SECTION 1: NAVBAR ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-extrabold shadow-sm">
              R
            </div>
            <div>
              <span className="font-black tracking-tight text-foreground text-sm block leading-none">
                Result Booster
              </span>
              <span className="text-[9px] text-muted-foreground font-black uppercase mt-1 block tracking-wider">
                SaaS for Institutes
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#problems" className="hover:text-foreground transition-colors">Problems We Solve</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs font-black h-9 border-border bg-background text-foreground hover:bg-muted cursor-pointer"
              onClick={() => onNavigate('/login')}
            >
              Sign In
            </Button>
            
            <Button 
              size="sm" 
              className="text-xs font-black bg-primary text-primary-foreground hover:bg-primary/90 h-9 shrink-0 shadow-sm cursor-pointer"
              onClick={() => setIsDemoModalOpen(true)}
            >
              Book Demo
            </Button>
          </div>

        </div>
      </header>

      {/* ================= SECTION 2: HERO SECTION ================= */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-border bg-gradient-to-b from-background via-muted/20 to-background">
        
        {/* Aesthetic dynamic grid accent lines */}
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10 bg-[linear-gradient(to_right,rgba(120,120,120,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          
          <div className="inline-flex items-center">
            <Badge variant="outline" className="text-[10px] uppercase font-bold font-mono tracking-widest border-primary/20 text-primary bg-primary/5 py-1 px-3">
              ★ Built for CCC, DCA, ADCA & O Level Institutes
            </Badge>
          </div>

          {/* Aggressive Headings targeting the central pain point */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1] font-sans">
            Your Students Are Not Weak. <span className="text-primary block mt-1">You Just Don’t Know Who Needs Help Early.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Most computer coaching institutes realize students are weak only after they fail their final exams. By then it is too late. Result Booster helps you identify weak students early, run automated online mock tests, improve overall pass results, and surge new admissions — without hiring extra teaching staff or manual work.
          </p>

          {/* Big Interactive Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-sm font-black bg-primary text-primary-foreground hover:bg-primary/95 shadow-lg shadow-primary/10 px-8 py-3.5 h-12 cursor-pointer transition-all active:scale-95"
              onClick={() => setIsDemoModalOpen(true)}
            >
              Book Free Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <a 
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-input bg-background/80 hover:bg-accent text-sm font-bold text-foreground h-12 px-8 py-3.5 transition-all active:scale-95 cursor-pointer"
            >
              See How It Works
            </a>
          </div>

          <div className="pt-6">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-muted-foreground block">
              Used Specically For:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-2 text-xs font-bold text-foreground">
              <span>CCC Certification</span>
              <span className="text-muted-foreground/30">•</span>
              <span>DCA Syllabus</span>
              <span className="text-muted-foreground/30">•</span>
              <span>ADCA Modules</span>
              <span className="text-muted-foreground/30">•</span>
              <span>O Level Coding Track</span>
              <span className="text-muted-foreground/30">•</span>
              <span>NIELIT Preparation</span>
            </div>
          </div>

        </div>

        {/* Hero Bottom - Robust Core Outcomes Trajectory (3 stat cards) */}
        <div className="max-w-5xl mx-auto px-4 mt-16 sm:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <Card className="border border-border bg-card/50 backdrop-blur-xs relative overflow-hidden group hover:border-border transition-all">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-destructive" />
              <CardContent className="p-6 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-destructive tracking-widest block">Core Intervention Indicator</span>
                <div className="text-2xl font-black text-foreground font-sans">↓ Absenteeism Plummets</div>
                <p className="text-xs text-muted-foreground leading-normal">
                  No more students missing Mock sessions. Automatic tracking flags incomplete practice papers on student dashboards instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50 backdrop-blur-xs relative overflow-hidden group hover:border-border transition-all">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
              <CardContent className="p-6 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-primary tracking-widest block">Passing Benchmark Boost</span>
                <div className="text-2xl font-black text-foreground font-sans">↑ Student Results Improve</div>
                <p className="text-xs text-muted-foreground leading-normal">
                  Turn mediocre grades into top-tier NIELIT pass rates. Identify exact weak topics before students apply for final exams.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card/50 backdrop-blur-xs relative overflow-hidden group hover:border-border transition-all">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
              <CardContent className="p-6 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-500 tracking-widest block">Local Success Cycle</span>
                <div className="text-2xl font-black text-foreground font-sans">↑ Admissions &amp; Goodwill</div>
                <p className="text-xs text-muted-foreground leading-normal">
                  Show parents real printed performance graphs. Build high local authority that naturally pulls admissions from word of mouth.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>

      </section>

      {/* ================= SECTION 3: ABOUT RESULT BOOSTER ================= */}
      <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 border-b border-border" id="about">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono font-black tracking-widest text-primary uppercase block">Institutional Mission</span>
            <h2 className="text-3xl font-black text-foreground tracking-tight font-sans">
              Why Result Booster Exists
            </h2>
            <div className="h-1.5 w-16 bg-primary rounded-full" />
            
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans">
              Most computer coaching institutes in India still run on absolute guesswork. Teachers work hard, but they suffer from high administrative strain and manual evaluation pipelines. Result Booster removes guesswork so you protect your goodwill.
            </p>
          </div>

          <div className="lg:col-span-7 bg-muted/30 border border-border rounded-2xl p-6 sm:p-8 space-y-4 font-sans">
            <strong className="text-xs uppercase font-mono tracking-wider text-foreground block">
              Critical gaps teachers cannot solve manually:
            </strong>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-card border rounded-lg space-y-1">
                <div className="h-5 w-5 bg-destructive/10 text-destructive rounded-full flex items-center justify-center font-bold text-[10px]">✕</div>
                <strong className="text-foreground font-black block">Weak Student Blindspot</strong>
                <p className="text-muted-foreground text-[11px] leading-normal">Which students are struggling in Excel formulas or C loop codes?</p>
              </div>

              <div className="p-3 bg-card border rounded-lg space-y-1">
                <div className="h-5 w-5 bg-destructive/10 text-destructive rounded-full flex items-center justify-center font-bold text-[10px]">✕</div>
                <strong className="text-foreground font-black block">Ghost Attendance</strong>
                <p className="text-muted-foreground text-[11px] leading-normal">Who completely stopped practicing once they finished classroom hours?</p>
              </div>

              <div className="p-3 bg-card border rounded-lg space-y-1">
                <div className="h-5 w-5 bg-destructive/10 text-destructive rounded-full flex items-center justify-center font-bold text-[10px]">✕</div>
                <strong className="text-foreground font-black block">Batch Divergences</strong>
                <p className="text-muted-foreground text-[11px] leading-normal">Which specific morning or evening batch lagging behind syllabus markers?</p>
              </div>

              <div className="p-3 bg-card border rounded-lg space-y-1">
                <div className="h-5 w-5 bg-destructive/10 text-destructive rounded-full flex items-center justify-center font-bold text-[10px]">✕</div>
                <strong className="text-foreground font-black block">Test Paper Exhaustion</strong>
                <p className="text-muted-foreground text-[11px] leading-normal">Hours wasted writing and grading O Level exams manually each week.</p>
              </div>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <p className="text-xs font-semibold text-foreground leading-relaxed">
                Result Booster centralizes mock exams, triggers smart trace warnings for weak students, and generates actionable, parent-friendly study logs in one unified portal.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* ================= SECTION 4: PROBLEMS SECTION ================= */}
      <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 border-b border-border bg-background" id="problems">
        
        <div className="space-y-4 text-center max-w-3xl mx-auto pb-10">
          <Badge variant="destructive" className="font-mono text-[9px] uppercase font-black tracking-widest py-1 px-3">
            Realities Counter-Attack
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Problems Every Computer Coaching Institute Faces
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Administrative leakage leads directly to bad reputation. If you don't track students early, local parents move their kids to other modern, organized classes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          
          <Card className="border border-destructive/15 bg-destructive/[0.01] hover:bg-destructive/[0.03] transition-colors">
            <CardHeader className="p-5 pb-2">
              <div className="h-7 w-7 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center font-black text-xs mb-2">01</div>
              <CardTitle className="text-xs sm:text-sm font-black text-foreground">
                Exams Reveal Weakness Too Late
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-normal">
                You only discover a student doesn't understand basic Excel formulas or network subnetting CIDR tags when the final marksheets arrive. By then, they fail, and your institute takes the blame.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-destructive/15 bg-destructive/[0.01] hover:bg-destructive/[0.03] transition-colors">
            <CardHeader className="p-5 pb-2">
              <div className="h-7 w-7 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center font-black text-xs mb-2">02</div>
              <CardTitle className="text-xs sm:text-sm font-black text-foreground">
                Zero Practice After Class Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-normal">
                Students attend class, close computers, and forget everything. There is no active coaching mechanism to verify if students revise syllabus at home or keep up with O Level requirements.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-destructive/15 bg-destructive/[0.01] hover:bg-destructive/[0.03] transition-colors">
            <CardHeader className="p-5 pb-2">
              <div className="h-7 w-7 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center font-black text-xs mb-2">03</div>
              <CardTitle className="text-xs sm:text-sm font-black text-foreground">
                Test Papers Are a Manual Nightmare
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-normal">
                Creating unique tests, checking answer sheets, printing question banks, and compiling progress logs consumes hours of valuable teaching time. Staff is exhausted with papers.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-destructive/15 bg-destructive/[0.01] hover:bg-destructive/[0.03] transition-colors">
            <CardHeader className="p-5 pb-2">
              <div className="h-7 w-7 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center font-black text-xs mb-2">04</div>
              <CardTitle className="text-xs sm:text-sm font-black text-foreground">
                Vague "Result Kaisa Hai?" Parent Queries
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-normal">
                When parents drop by asking about performance, teachers have no proof but verbal assurances. Without transparent logs, parents suspect your computer academy is unprofessional.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-destructive/15 bg-destructive/[0.01] hover:bg-destructive/[0.03] transition-colors">
            <CardHeader className="p-5 pb-2">
              <div className="h-7 w-7 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center font-black text-xs mb-2">05</div>
              <CardTitle className="text-xs sm:text-sm font-black text-foreground">
                Rogue Batches Corrupt Reputation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-normal">
                Just one bad batch getting zero O Level or CCC pass marks destroys your citywide reputation. Word of mouth spreads fast in Tier 2/3 towns, hurting subsequent admissions.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-destructive/15 bg-destructive/[0.01] hover:bg-destructive/[0.03] transition-colors">
            <CardHeader className="p-5 pb-2">
              <div className="h-7 w-7 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center font-black text-xs mb-2">06</div>
              <CardTitle className="text-xs sm:text-sm font-black text-foreground">
                Organized Platforms Steal Students
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-normal">
                Good, high-paying students leave for competitors because your teaching systems feel old-fashioned and unmonitored. Structured reporting keeps students bound and committed.
              </p>
            </CardContent>
          </Card>

        </div>

      </section>

      {/* ================= SECTION 5: HOW IT WORKS ================= */}
      <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 border-b border-border" id="how-it-works">
        
        <div className="space-y-4 text-center max-w-2xl mx-auto pb-12">
          <span className="text-xs font-mono font-black tracking-widest text-primary uppercase block">Structured System Flow</span>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            How Result Booster Works
          </h2>
          <p className="text-xs text-muted-foreground">
            A practical, automated, and lightning-fast software loop designed with the workflow of a busy Indian institute owner in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative font-sans">
          
          <div className="space-y-3 relative">
            <div className="h-9 w-9 bg-primary/10 text-primary font-black rounded-xl flex items-center justify-center text-sm border border-primary/25">
              1
            </div>
            <strong className="text-sm text-foreground font-black block leading-snug">Add Students &amp; Batches</strong>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Import student names in 2 minutes. Categorize them into morning/evening or weekend classes depending on study level (DCA, CCC, O Level).
            </p>
          </div>

          <div className="space-y-3 relative">
            <div className="h-9 w-9 bg-primary/10 text-primary font-black rounded-xl flex items-center justify-center text-sm border border-primary/25">
              2
            </div>
            <strong className="text-sm text-foreground font-black block leading-snug">Create Mock Tests</strong>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use your own questions or our built-in syllabus libraries to schedule online mock series. Set timers, limits, and batches.
            </p>
          </div>

          <div className="space-y-3 relative">
            <div className="h-9 w-9 bg-primary/10 text-primary font-black rounded-xl flex items-center justify-center text-sm border border-primary/25">
              3
            </div>
            <strong className="text-sm text-foreground font-black block leading-snug">Students Give Tests</strong>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Students log into their clean mobile/computer student portal. No complicated setup—they can attempt exams right on their basic smartphones.
            </p>
          </div>

          <div className="space-y-3 relative">
            <div className="h-9 w-9 bg-primary/10 text-primary font-black rounded-xl flex items-center justify-center text-sm border border-primary/25">
              4
            </div>
            <strong className="text-sm text-foreground font-black block leading-snug">Track Weak Spots &amp; Improve</strong>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dashboard instantly groups weak students together. Pinpoint exactly which formulas, codes, or port numbers they got wrong and intervene.
            </p>
          </div>

        </div>

      </section>

      {/* ================= SECTION 6: FEATURES ================= */}
      <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 border-b border-border" id="features">
        
        <div className="space-y-3 text-center max-w-2xl mx-auto pb-12">
          <Badge variant="outline" className="font-mono text-[9px] uppercase font-bold py-1 px-3 border-emerald-500/20 text-emerald-600 bg-emerald-500/5">
            Syllabus Engineered Toolkit
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Everything Needed To Improve Student Results
          </h2>
          <p className="text-xs text-muted-foreground">
            No bloated theoretical tools. Built exclusively with features that solve direct operational bottlenecks for computer institute administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
          
          <Card className="border border-border bg-card">
            <CardHeader className="p-5 pb-2">
              <FileSpreadsheet className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-xs sm:text-sm font-black text-foreground">
                Mock Test Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-normal">
                Easily publish 50-question mock tests. Limit students by time limits, strict durations, and random question sorting to prevent cheating in active computer labs.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader className="p-5 pb-2">
              <Users className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-xs sm:text-sm font-black text-foreground">
                Weak Student Auto-Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-normal">
                System highlights students falling below 50% passing marks in a separate roster. This ensures you know exactly who needs remedial attention before final NIELIT drafts.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader className="p-5 pb-2">
              <Layers className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-xs sm:text-sm font-black text-foreground">
                Batch Performance Tracing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-normal">
                Compare average mock accuracy across different slots. See if the 10:00 AM batch is performing worse than the 4:00 PM evening O Level cohort instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader className="p-5 pb-2">
              <BookOpen className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-xs sm:text-sm font-black text-foreground">
                Pre-Loaded Syllabus Banks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-normal">
                Contains preloaded question pools for CCC, DCA, O Level C arrays, and office suites. Modify, upload, or import custom MCQ papers safely.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader className="p-5 pb-2">
              <TrendingUp className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-xs sm:text-sm font-black text-foreground">
                Individual Score Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-normal">
                Watch student accuracy move from bad diagnostic grades (23%) to passing master grades (80%) on sleek progress curves that celebrate hard work.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader className="p-5 pb-2">
              <MessageSquare className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-xs sm:text-sm font-black text-foreground">
                WhatsApp Report Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-normal">
                No complex emails needed in Tier 2/3 towns. Instantly copy student mock score reports directly and send on Whatsapp. Clean, simple, and impressive.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader className="p-5 pb-2">
              <AlertTriangle className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-xs sm:text-sm font-black text-foreground">
                Detailed Topic-wise Failures
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-normal">
                Isolate structural failures down to specific modules. Drill down to know if a batch fails because of "Spreadsheet Formulas" or "Web Port Security".
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card">
            <CardHeader className="p-5 pb-2">
              <Sliders className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-xs sm:text-sm font-black text-foreground">
                Fast Student Onboarding
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <p className="text-xs text-muted-foreground leading-normal">
                Extremely humble data architecture. Add, modify, activate, or archive students using pure, single-screen dashboards with simple local forms.
              </p>
            </CardContent>
          </Card>

        </div>

      </section>

      {/* ================= SECTION 7: WHY COACHING OWNERS LIKE IT ================= */}
      <section className="py-16 sm:py-24 bg-muted/30 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 font-sans text-center">
          
          <div className="space-y-3 max-w-2xl mx-auto pb-12">
            <span className="text-xs font-mono font-black tracking-widest text-primary uppercase block">Owner Outcomes</span>
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              Less Guesswork. Better Results.
            </h2>
            <p className="text-xs text-muted-foreground">
              What does Result Booster do for your coaching business? No fancy systems—just direct, measurable progress indicators that elevate professional metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            
            <div className="space-y-2">
              <div className="h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <strong className="text-sm font-black text-foreground block">
                Know exactly who needs attention
              </strong>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Save dozens of teaching hours by focusing solely on students showing actual conceptual deficiency. Ensure no student drops off due to neglected challenges.
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <strong className="text-sm font-black text-foreground block">
                Improve institute pass ratios
              </strong>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sustained mock drills guarantee high familiarity with NIELIT and ADCA grade pattern formats. Boost your official passing scores by double-digit margins.
              </p>
            </div>

            <div className="space-y-2">
              <div className="h-5 w-5 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <strong className="text-sm font-black text-foreground block">
                Boost parent trust &amp; local admissions
              </strong>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Parents choose coaching centers that communicate progress transparently. Backing up reports drives referral signups from neighboring households.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================= SECTION 8: PRICING ================= */}
      <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 border-b border-border" id="pricing">
        
        <div className="space-y-3 text-center max-w-2xl mx-auto pb-12">
          <Badge className="font-mono text-[9px] uppercase font-black tracking-widest py-1 px-3">
            Honest Monthly Subscriptions
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Simple Pricing For Growing Institutes
          </h2>
          <p className="text-xs text-muted-foreground">
            No complex set-up fees. Free hands-on system onboarding. Upgrades or custom limits supported. Cancel anytime inside settings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch font-sans">
          
          {/* Plan 1 */}
          <Card className="border border-border bg-card flex flex-col justify-between overflow-hidden relative">
            <CardHeader className="p-6 pb-4 border-b">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">STARTER</span>
              <CardTitle className="text-base font-black mt-1">Small Institutes</CardTitle>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-black text-foreground">₹999</span>
                <span className="text-xs text-muted-foreground ml-1.5">/ month</span>
              </div>
              <CardDescription className="text-[11px] mt-1">For single labs getting started with mock tests.</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 pt-5 flex-1 flex flex-col justify-between space-y-6">
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Up to <strong>50 Active Students</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Up to <strong>3 Batches Mapped</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Unlimited Mock Exams</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Basic Topic Progress Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Manual Copy PDF Report Link</span>
                </li>
              </ul>

              <Button 
                variant="outline" 
                className="w-full text-xs font-black cursor-pointer"
                onClick={() => setIsDemoModalOpen(true)}
              >
                Choose Starter Plan
              </Button>
            </CardContent>
          </Card>

          {/* Plan 2 - HIGHLIGHTED PROFESSIONAL */}
          <Card className="border-2 border-primary bg-card flex flex-col justify-between overflow-hidden relative shadow-lg">
            <div className="absolute top-0 right-0 left-0 h-1 bg-primary" />
            <div className="absolute top-3 right-3">
              <Badge className="text-[9px] uppercase font-black font-mono tracking-wider bg-primary text-primary-foreground py-0.5 px-2">
                ★ MOST POPULAR
              </Badge>
            </div>

            <CardHeader className="p-6 pb-4 border-b bg-primary/[0.01]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">PROFESSIONAL</span>
              <CardTitle className="text-base font-black mt-1">Growing Institutes</CardTitle>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-black text-foreground">₹1,999</span>
                <span className="text-xs text-muted-foreground ml-1.5">/ month</span>
              </div>
              <CardDescription className="text-[11px] mt-1">Perfect fit for expanding multi-batch institutes.</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 pt-5 flex-1 flex flex-col justify-between space-y-6">
              <ul className="space-y-3 text-xs text-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Up to <strong>200 Active Students</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Up to <strong>10 Batches Mapped</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Unlimited Mock Exams</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Smart Weak Student Highlights</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <strong>Syllabus Progress Tracker (Excel, O Level)</strong>
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <span className="text-primary font-bold shrink-0">✓</span>
                  <span>Direct WhatsApp Report Templates</span>
                </li>
              </ul>

              <Button 
                className="w-full text-xs font-black bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer shadow-md"
                onClick={() => setIsDemoModalOpen(true)}
              >
                Choose Professional Plan
              </Button>
            </CardContent>
          </Card>

          {/* Plan 3 */}
          <Card className="border border-border bg-card flex flex-col justify-between overflow-hidden relative">
            <CardHeader className="p-6 pb-4 border-b">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">ADVANCED</span>
              <CardTitle className="text-base font-black mt-1">Large Coaching Centers</CardTitle>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-black text-foreground">₹3,999</span>
                <span className="text-xs text-muted-foreground ml-1.5">/ month</span>
              </div>
              <CardDescription className="text-[11px] mt-1">For multi-branch or massive coaching centers.</CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 pt-5 flex-1 flex flex-col justify-between space-y-6">
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Up to <strong>500 Active Students</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong>Unlimited Batches Mapped</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Unlimited Mock Exams &amp; Reprints</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Advanced Batch-to-Batch Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>Priority Help Desk Support</span>
                </li>
              </ul>

              <Button 
                variant="outline" 
                className="w-full text-xs font-black cursor-pointer"
                onClick={() => setIsDemoModalOpen(true)}
              >
                Choose Advanced Plan
              </Button>
            </CardContent>
          </Card>

        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-mono font-extrabold text-muted-foreground">
          <span>• No registration fee</span>
          <span>• Free administrative onboarding</span>
          <span>• Cancel subcription anytime</span>
        </div>

      </section>

      {/* ================= SECTION 9: TESTIMONIALS ================= */}
      <section className="py-16 sm:py-24 bg-muted/30 border-b border-border" id="testimonials">
        <div className="max-w-5xl mx-auto px-4 font-sans">
          
          <div className="space-y-3 text-center max-w-2xl mx-auto pb-12">
            <span className="text-xs font-mono font-black tracking-widest text-primary uppercase block">Authentic Ground Reports</span>
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              Believed and Adopted by Local Coaching Academies
            </h2>
            <p className="text-xs text-muted-foreground">
              Real computer academy operators share how Result Booster completely organized their daily classroom schedules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Card className="p-6 border border-border bg-card relative">
              <div className="text-amber-500 text-lg font-black tracking-tighter mb-2">★★★★★</div>
              <blockquote className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed">
                "Earlier we only knew students were weak after exams arrived. Many O Level and DCA students would struggle silently or skip exams entirely due to low confidence. Now with Result Booster, we identify exact weak sections much earlier. Our pass percentage rose significantly this term!"
              </blockquote>
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div>
                  <strong className="text-xs font-black text-foreground block">Rajesh Kumar Mishra</strong>
                  <span className="text-[10px] text-muted-foreground font-mono">Owner, Computer Coaching Institute — Gorakhpur, UP</span>
                </div>
                <Badge variant="outline" className="text-[9px] uppercase font-mono">CCC &amp; O Level Specialist</Badge>
              </div>
            </Card>

            <Card className="p-6 border border-border bg-card relative">
              <div className="text-amber-500 text-lg font-black tracking-tighter mb-2">★★★★★</div>
              <blockquote className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed">
                "Parents in our town used to drop by asking 'Result kaisa hai?' all the time. Now we instantly print or WhatsApp their dynamic progress charts. They trust our academy so much more. This has directly driven up our batch recommendations and referrals!"
              </blockquote>
              <div className="mt-4 pt-4 border-t flex items-center justify-between">
                <div>
                  <strong className="text-xs font-black text-foreground block">Sandeep Shrivastav</strong>
                  <span className="text-[10px] text-muted-foreground font-mono">Director, Shrivastav IT Academy — Patna, Bihar</span>
                </div>
                <Badge variant="outline" className="text-[9px] uppercase font-mono">DCA &amp; ADCA Courses</Badge>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* ================= SECTION 10: FINAL CTA ================= */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.04] -z-10" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Your Coaching Results Can Improve — But Only If You Track Students Early.
          </h2>
          
          <p className="text-xs sm:text-sm text-primary-foreground/80 max-w-xl mx-auto leading-relaxed">
            Stop waiting for final NIELIT certificates to discover student difficulties. Start active mock tests, verify batches, and build the most successful computer coaching center in your district.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-sm font-black bg-background text-foreground hover:bg-muted shadow-xl h-12 px-8 cursor-pointer active:scale-95"
              onClick={() => setIsDemoModalOpen(true)}
            >
              Book Free Demo
            </Button>
            
            <a 
              href="https://wa.me/919876543210" 
              target="_blank" 
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-sm font-extrabold text-primary-foreground h-12 px-8 transition-all active:scale-95 cursor-pointer"
            >
              <Phone className="h-4 w-4 shrink-0" />
              <span>Talk on WhatsApp</span>
            </a>
          </div>

          <div className="text-[10px] font-mono font-semibold opacity-75">
            ✓ Quick Setup • Setup Support Included • Instant Classroom Launch
          </div>

        </div>
      </section>

      {/* ================= EXTRA: INTERACTIVE FAQ CONTROL ACCORDION ================= */}
      <section className="py-16 max-w-3xl mx-auto px-4 font-sans border-b border-border">
        <div className="space-y-2 text-center pb-8">
          <h3 className="text-xl font-black text-foreground">Frequently Asked Questions</h3>
          <p className="text-xs text-muted-foreground">Answers to typical operational doubts raised by computer coaching administrators.</p>
        </div>

        <div className="space-y-3">
          
          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <button 
              type="button"
              className="w-full p-4 text-left font-black text-xs sm:text-sm flex items-center justify-between text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
              onClick={() => toggleFaq(0)}
            >
              <span>Can we write exams in Hindi and English?</span>
              <span className="text-muted-foreground font-mono">{faqOpen[0] ? '−' : '+'}</span>
            </button>
            {faqOpen[0] && (
              <div className="p-4 pt-0 text-xs text-muted-foreground border-t leading-relaxed">
                Yes absolutely! Our testing software supports creating mock papers in both languages easily. You can write custom bilingual questions for CCC and DCA exams with ease.
              </div>
            )}
          </div>

          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <button 
              type="button"
              className="w-full p-4 text-left font-black text-xs sm:text-sm flex items-center justify-between text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
              onClick={() => toggleFaq(1)}
            >
              <span>How do students login without smart devices?</span>
              <span className="text-muted-foreground font-mono">{faqOpen[1] ? '−' : '+'}</span>
            </button>
            {faqOpen[1] && (
              <div className="p-4 pt-0 text-xs text-muted-foreground border-t leading-relaxed">
                If they don't have personal smartphones, they can simply log in on your institute's desktop computer lab systems using their designated Roll ID, making it convenient to take simulated exams inside active lab classes.
              </div>
            )}
          </div>

          <div className="border border-border rounded-xl bg-card overflow-hidden">
            <button 
              type="button"
              className="w-full p-4 text-left font-black text-xs sm:text-sm flex items-center justify-between text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
              onClick={() => toggleFaq(2)}
            >
              <span>Is there any limit on mock tests we publish?</span>
              <span className="text-muted-foreground font-mono">{faqOpen[2] ? '−' : '+'}</span>
            </button>
            {faqOpen[2] && (
              <div className="p-4 pt-0 text-xs text-muted-foreground border-t leading-relaxed">
                No limit at all. All plans allow you to publish as many simulated or diagnostic tests as required to make your students absolute pass champions.
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ================= SECTION 11: FOOTER ================= */}
      <footer className="bg-muted/20 border-t border-border mt-auto font-sans text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Column 1 */}
            <div className="space-y-3">
              <strong className="text-xs font-black text-foreground uppercase tracking-wider block">Product</strong>
              <ul className="space-y-2 text-muted-foreground font-medium">
                <li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
                <li><a href="#features" className="hover:text-foreground">Syllabus Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing Plans</a></li>
                <li><button onClick={() => setIsDemoModalOpen(true)} className="hover:text-foreground text-left cursor-pointer">Request Live Demo</button></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <strong className="text-xs font-black text-foreground uppercase tracking-wider block">Company</strong>
              <ul className="space-y-2 text-muted-foreground font-medium">
                <li><span className="text-muted-foreground/60">About Result Booster</span></li>
                <li><span className="text-muted-foreground/60">Contact: support@resultbooster.in</span></li>
                <li><span className="text-muted-foreground/60 text-[10px] font-mono bg-muted py-0.5 px-1.5 rounded">Gorakhpur HQ, UP</span></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <strong className="text-xs font-black text-foreground uppercase tracking-wider block">For Institutes</strong>
              <ul className="space-y-2 text-muted-foreground font-medium">
                <li><span className="text-muted-foreground">CCC Exam Prep</span></li>
                <li><span className="text-muted-foreground">DCA Modules</span></li>
                <li><span className="text-muted-foreground">ADCA Office Suites</span></li>
                <li><span className="text-muted-foreground">O Level Programming</span></li>
              </ul>
            </div>

            {/* Column 4 - Brand Signature */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-[11px]">
                  R
                </div>
                <strong className="text-xs font-black text-foreground tracking-tight">Result Booster</strong>
              </div>
              <p className="text-[11px] text-muted-foreground leading-normal max-w-xs">
                Premium, practical assessment engine empowering Tier 2 and Tier 3 computer coaching academies inside India. Built with honesty in Gorakhpur, Uttar Pradesh.
              </p>
            </div>

          </div>

          <Separator className="my-8" />

          {/* Footer Bottom section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-muted-foreground font-medium">
            <span>© 2026 Result Booster Tech Systems. All rights reserved.</span>
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Made for Indian Computer Coaching Institutes</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ================= BOOK CODE DEMO DIALOG MODAL ================= */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Book Your Free Personal System Demo 🎯"
        description="Fill these simple details, and our local implementation coach will reach out on WhatsApp to show you the student panel in action."
      >
        {isBooked ? (
          <div className="space-y-3 py-6 text-center font-sans">
            <div className="h-12 w-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-black text-foreground">Demo Registration Sent!</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dhanyawad! We have received your query. Our system representative will drop a draft login code on your register WhatsApp number <strong>{whatsapp}</strong> in 10 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBookDemo} className="space-y-4 font-sans text-left text-slate-900 dark:text-slate-100">
            
            <div className="space-y-1.5">
              <Label htmlFor="instName">Coaching Institute Name</Label>
              <Input 
                id="instName"
                placeholder="e.g. Gorakhpur Computer Academy" 
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ownName">Your Full Name (Director/Owner)</Label>
              <Input 
                id="ownName"
                placeholder="e.g. Ramesh Chandra Mishra" 
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wpNum">WhatsApp Contact Number</Label>
              <Input 
                id="wpNum"
                type="tel"
                placeholder="e.g. +91 98765 43210" 
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stdCount">Approximate Active Student Strength</Label>
              <select 
                id="stdCount"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={studentCount}
                onChange={(e) => setStudentCount(e.target.value)}
              >
                <option value="under-50">Under 50 Students</option>
                <option value="50-100">50 to 100 Students</option>
                <option value="100-200">100 to 200 Students</option>
                <option value="over-200">More than 200 Students</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDemoModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-black cursor-pointer">
                Confirm Booking
              </Button>
            </div>

          </form>
        )}
      </Modal>

    </div>
  );
}
