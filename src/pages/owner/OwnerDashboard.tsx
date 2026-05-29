import * as React from 'react';
import { 
  AlertTriangle, 
  MessageSquare, 
  Eye, 
  Sliders, 
  Sparkles, 
  Users, 
  Layers,
  ChevronRight,
  Check,
  Send,
  BookOpen,
  ArrowUpRight,
  Phone
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
  Modal
} from '../../components/ui/CustomComponents';

interface OwnerDashboardProps {
  onNavigate: (path: string) => void;
}

export default function OwnerDashboard({ onNavigate }: OwnerDashboardProps) {
  // Live action/interaction states
  const [whatsappSent, setWhatsappSent] = React.useState<Record<string, boolean>>({});
  const [assignedTests, setAssignedTests] = React.useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Modals view controllers
  const [viewingStudent, setViewingStudent] = React.useState<string | null>(null);
  const [whatsappingStudent, setWhatsappingStudent] = React.useState<string | null>(null);
  const [assigningStudent, setAssigningStudent] = React.useState<string | null>(null);
  const [viewingBatch, setViewingBatch] = React.useState<string | null>(null);

  // Helper to trigger clean toast banners
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // State handles for student actions
  const handleCopyWhatsApp = (student: string) => {
    setWhatsappSent(prev => ({ ...prev, [student]: true }));
    setWhatsappingStudent(null);
    triggerToast(`WhatsApp alert successfully sent to ${student}'s parent!`);
  };

  const handleConfirmAssign = (student: string, testTitle: string) => {
    setAssignedTests(prev => ({ ...prev, [student]: testTitle }));
    setAssigningStudent(null);
    triggerToast(`Remedial test "${testTitle}" assigned to ${student}!`);
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in pb-12 font-sans w-full max-w-7xl mx-auto px-4 md:px-0">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 max-w-sm rounded-xl border border-primary/20 bg-card text-foreground shadow-lg flex items-start gap-3 animate-slide-in">
          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
            <Sparkles className="h-3 w-3" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold block">Action Completed</span>
            <p className="text-[11px] text-muted-foreground leading-normal">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Simplified, Humble Page Header */}
      <div className="border-b border-border/60 pb-5 pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <Sliders className="h-6 w-6 text-primary shrink-0" />
          <span>Institute Command Center</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1 text-slate-500 italic">
          “Mujhe abhi kya karna hai?” — Real-time actionable diagnostics & performance monitoring
        </p>
      </div>

      {/* Main Grid Layout to contain the two simplified cards */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* SECTION 2: Needs Attention (Spans 7 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border border-border/80 shadow-xs h-full flex flex-col justify-between">
            <div>
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-black text-foreground flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                      Needs Attention
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      High-priority student interventions compiled from benchmark scoring algorithms
                    </CardDescription>
                  </div>
                  <Badge variant="destructive" className="text-[10px] font-mono shrink-0">
                    3 Pending
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0">
                <div className="overflow-x-auto border border-border/60 rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold text-xs">Student</TableHead>
                        <TableHead className="font-bold text-xs">Problem</TableHead>
                        <TableHead className="font-bold text-xs text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Rahul Row */}
                      <TableRow className="hover:bg-muted/50 transition-colors">
                        <TableCell className="align-middle py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center font-mono">
                              R
                            </div>
                            <div>
                              <span className="font-bold text-foreground text-xs block">Rahul</span>
                              <span className="text-[9px] text-muted-foreground font-mono">CCC Morning Batch</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="align-middle py-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600">
                            Low score
                          </span>
                        </TableCell>
                        <TableCell className="text-right align-middle py-3.5">
                          <button
                            type="button"
                            onClick={() => setViewingStudent('Rahul')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </button>
                        </TableCell>
                      </TableRow>

                      {/* Aman Row */}
                      <TableRow className="hover:bg-muted/50 transition-colors">
                        <TableCell className="align-middle py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center justify-center font-mono">
                              A
                            </div>
                            <div>
                              <span className="font-bold text-foreground text-xs block">Aman</span>
                              <span className="text-[9px] text-muted-foreground font-mono">CCC Evening Batch</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="align-middle py-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600">
                            Missed 3 tests
                          </span>
                        </TableCell>
                        <TableCell className="text-right align-middle py-3.5">
                          {whatsappSent['Aman'] ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold pr-2">
                              <Check className="h-3.5 w-3.5" />
                              WhatsApp Sent
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setWhatsappingStudent('Aman')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95 shadow-xs"
                            >
                              <Phone className="h-3 w-3" />
                              <span>WhatsApp</span>
                            </button>
                          )}
                        </TableCell>
                      </TableRow>

                      {/* Priya Row */}
                      <TableRow className="hover:bg-muted/50 transition-colors">
                        <TableCell className="align-middle py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-violet-500/10 text-violet-600 font-bold text-xs flex items-center justify-center font-mono">
                              P
                            </div>
                            <div>
                              <span className="font-bold text-foreground text-xs block">Priya</span>
                              <span className="text-[9px] text-muted-foreground font-mono">DCA Batch</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="align-middle py-3.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-violet-500/10 text-violet-600">
                            Weak in Excel
                          </span>
                        </TableCell>
                        <TableCell className="text-right align-middle py-3.5">
                          {assignedTests['Priya'] ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-primary font-bold pr-2 max-w-[120px] truncate" title={`Assigned: ${assignedTests['Priya']}`}>
                              <Check className="h-3.5 w-3.5 shrink-0" />
                              {assignedTests['Priya']}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setAssigningStudent('Priya')}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95"
                            >
                              <BookOpen className="h-3 w-3" />
                              <span>Assign Test</span>
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </div>
            
            <CardFooter className="p-4 bg-muted/10 border-t border-border/40 flex justify-between items-center text-[11px] text-muted-foreground select-none rounded-b-2xl mt-4">
              <span>Remedial targets are updated dynamic-live</span>
              <button 
                type="button"
                onClick={() => onNavigate('/owner/students')}
                className="text-primary hover:underline font-bold text-[10px] uppercase tracking-wider cursor-pointer"
              >
                Go to Student Registry
              </button>
            </CardFooter>
          </Card>
        </div>

        {/* SECTION 3: Batch Performance (Spans 4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border border-border/80 shadow-xs h-full flex flex-col justify-between">
            <div>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base font-black text-foreground flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-primary shrink-0" />
                  Batch Health
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-0.5">
                  Click on any batch to check diagnostic topics and student breakdown
                </CardDescription>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3">
                
                {/* CCC Morning Card */}
                <button
                  type="button"
                  onClick={() => setViewingBatch('CCC Morning')}
                  className="w-full text-left p-3.5 rounded-xl border border-border/80 hover:border-border hover:bg-muted/40 transition-all select-none cursor-pointer flex items-center justify-between group active:scale-98 bg-card"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground">CCC Morning</span>
                    <span className="text-[10px] text-muted-foreground block">120 Students registered</span>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-sm font-black text-emerald-600 font-mono">72% avg</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* CCC Evening Card */}
                <button
                  type="button"
                  onClick={() => setViewingBatch('CCC Evening')}
                  className="w-full text-left p-3.5 rounded-xl border border-border/80 hover:border-border hover:bg-muted/40 transition-all select-none cursor-pointer flex items-center justify-between group active:scale-98 bg-card"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      CCC Evening
                      <span className="text-[10px] text-amber-500 animate-pulse font-bold" title="Critical Health Alert">⚠️</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground block">84 Students registered</span>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-sm font-black text-rose-500 font-mono">51% avg ⚠️</span>
                    <ChevronRight className="h-3.5 w-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* DCA Batch Card */}
                <button
                  type="button"
                  onClick={() => setViewingBatch('DCA Batch')}
                  className="w-full text-left p-3.5 rounded-xl border border-border/80 hover:border-border hover:bg-muted/40 transition-all select-none cursor-pointer flex items-center justify-between group active:scale-98 bg-card"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground">DCA Batch</span>
                    <span className="text-[10px] text-muted-foreground block">95 Students registered</span>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-sm font-black text-primary font-mono">81% avg</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

              </CardContent>
            </div>

            <CardFooter className="p-4 bg-muted/10 border-t border-border/40 text-center select-none rounded-b-2xl">
              <button 
                type="button"
                onClick={() => onNavigate('/owner/batches')}
                className="text-primary hover:underline font-bold text-[10px] uppercase tracking-wider cursor-pointer mx-auto flex items-center gap-1"
              >
                Manage Class Batches <ArrowUpRight className="h-3 w-3" />
              </button>
            </CardFooter>
          </Card>
        </div>

      </div>

      {/* ==================== INTERACTIVE MODAL WINDOWS ==================== */}

      {/* MODAL 1: View Student Profile (Rahul) */}
      <Modal
        isOpen={viewingStudent === 'Rahul'}
        onClose={() => setViewingStudent(null)}
        title="Student Diagnostic Brief"
        description="Comprehensive mock test metrics & evaluation detail"
      >
        <div className="space-y-4 pt-1 text-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <span className="text-lg font-black text-foreground">Rahul</span>
              <p className="text-xs text-muted-foreground">CCC Morning Batch A • Candidate</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-rose-500 font-mono">42%</span>
              <p className="text-[9px] font-bold text-rose-600 uppercase tracking-wider block">Average Accuracy</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">Identified Weak Areas:</span>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              <li>Computer Fundamentals (Hardware & CPU architecture definitions)</li>
              <li>Operating Systems operations (specifically CLI & Windows permissions)</li>
              <li>LibreOffice Shortcuts (Ctrl keys & Writer menus)</li>
            </ul>
          </div>

          <div className="rounded-xl bg-orange-500/5 border border-amber-500/10 p-3 text-xs leading-relaxed text-slate-600 space-y-1">
            <span className="font-bold text-amber-700 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Recommended Study Plan:
            </span>
            <p>
              Advise Rahul to pass the basic Hardware mock training before aiming for multi-batch mock matches. Standard training maps show visual feedback boosts score by 15%.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setViewingStudent(null);
                setAssigningStudent('Rahul');
              }}
              className="px-3.5 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition-all cursor-pointer"
            >
              Assign Remedial Quiz
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: Parent WhatsApp Reminder (Aman) */}
      <Modal
        isOpen={whatsappingStudent === 'Aman'}
        onClose={() => setWhatsappingStudent(null)}
        title="Send Parental Update via WhatsApp"
        description="Provide direct alert warning of missed trainings to parents"
      >
        <div className="space-y-4 pt-1 text-sm">
          <div className="space-y-1 text-xs">
            <span className="font-bold text-slate-500 uppercase tracking-wider">Parent contact message preview:</span>
            <div className="p-3 bg-muted/70 rounded-xl border border-border font-sans leading-relaxed text-foreground select-all text-[11px] whitespace-pre-wrap">
              {`Dear Parent, your ward Aman remains inactive and has missed 3 consecutive mock exams on the Result Booster tracking system. Daily practice is crucial to pass the upcoming CCC/DCA certification. Please ensure they complete their dashboard tests today.\n\n- Result Booster Institute Admin`}
            </div>
          </div>

          <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/15 p-3 text-xs text-emerald-800 flex items-start gap-2">
            <Phone className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
            <p className="leading-normal">
              Clicking send will simulate WhatsApp Web messaging. For actual integration, the template hooks with standard WhatsApp business gateway API.
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setWhatsappingStudent(null)}
              className="px-3 py-2 border border-border hover:bg-accent rounded-lg text-xs font-semibold text-muted-foreground cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleCopyWhatsApp('Aman')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs"
            >
              <Send className="h-3 w-3" />
              <span>Send Message</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 3: Assign Remedial Quiz (Priya / Rahul) */}
      <Modal
        isOpen={assigningStudent !== null}
        onClose={() => setAssigningStudent(null)}
        title={`Assign Remedial Benchmark Quiz`}
        description={`Configure a mock assessment route specifically customized to improve scores for ${assigningStudent}`}
      >
        <div className="space-y-4 pt-1 text-sm">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Choose Focused Drill:</span>
            <div className="space-y-2">
              {[
                { title: 'Excel formulas special drill (20 min)', desc: 'Focuses on formulas: SUM, AVERAGE, VLOOKUP, IF functions' },
                { title: 'MS Office basic formatting tools (15 min)', desc: 'Para spacing, alignment formats, page layout options' },
                { title: 'CCC concepts mock revision (30 min)', desc: 'NIELIT test benchmark patterns check' }
              ].map((test, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleConfirmAssign(assigningStudent || '', test.title)}
                  className="w-full text-left p-3 border border-border/80 hover:border-primary hover:bg-primary/[0.01] rounded-xl transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-foreground text-xs block group-hover:text-primary transition-colors">{test.title}</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">{test.desc}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* MODAL 4: Batch Health Clickable Details */}
      <Modal
        isOpen={viewingBatch !== null}
        onClose={() => setViewingBatch(null)}
        title={`Batch Performance Index: ${viewingBatch}`}
        description="Detailed diagnostics and study focus overview"
      >
        <div className="space-y-4 pt-1 text-sm">
          {viewingBatch === 'CCC Morning' && (
            <>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <div>
                  <span className="text-2xl font-black text-emerald-600 font-mono">72%</span>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Average Performance Score</p>
                </div>
                <Badge variant="outline" className="text-emerald-700 bg-emerald-500/5">Passing Pace</Badge>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">Batch Insights:</span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Morning students are highly active. Word formatting and basic spreadsheets show great metrics. However, average score is dragged down by hard-difficulty keyboard short keys.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">Immediate Recommendation:</span>
                <p className="text-xs text-slate-700 font-medium">
                  Trigger CCC shortcuts practice drill to boost class average score to &gt; 80%.
                </p>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewingBatch(null);
                    triggerToast("CCC shortcuts exercise dispatched to CCC Morning batch students!");
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/90 transition-all cursor-pointer"
                >
                  Dispatch Shortcuts Quiz
                </button>
              </div>
            </>
          )}

          {viewingBatch === 'CCC Evening' && (
            <>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <div>
                  <span className="text-2xl font-black text-rose-500 font-mono">51% ⚠️</span>
                  <p className="text-[10px] font-bold text-rose-600 uppercase">Critical Score Warnings</p>
                </div>
                <Badge variant="destructive" className="animate-pulse">At Critical Risk</Badge>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">Issues Detected:</span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  High rate of absenteeism (missed tests) is the leading cause. Weak subject areas include Internet security protocols and formulas.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">Immediate Command Action:</span>
                <div className="p-3 bg-rose-500/5 rounded-xl border border-rose-500/10 text-xs text-rose-700 font-semibold space-y-1.5">
                  <p>Send warning alerts directly to parents of all students in CCC Evening batch.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setViewingBatch(null);
                      triggerToast("Urgent warning alerts dispatched to parents of 84 students!");
                    }}
                    className="w-full py-1.5 bg-rose-500 text-white rounded hover:bg-rose-600 text-[11px] font-bold transition-all text-center"
                  >
                    Broadcast Parent SMS Alerts
                  </button>
                </div>
              </div>
            </>
          )}

          {viewingBatch === 'DCA Batch' && (
            <>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <div>
                  <span className="text-2xl font-black text-primary font-mono">81%</span>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Average Performance Score</p>
                </div>
                <Badge variant="success">Strong Mastery</Badge>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">Strengths Analysis:</span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Excellent grasp of MS Excel sorting, pivot data, and formatting tools. 90% syllabus covered on time.
                </p>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewingBatch(null);
                    triggerToast("Dispatched Advanced DCA Certification mock match to DCA batch!");
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/95 transition-all cursor-pointer"
                >
                  Launch Advanced Mock Match
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

    </div>
  );
}
