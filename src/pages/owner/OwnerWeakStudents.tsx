import * as React from 'react';
import { 
  AlertTriangle, 
  Sparkles, 
  Send, 
  FlameKindling, 
  Compass, 
  CheckCircle, 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Layers, 
  Users, 
  Phone, 
  FileSpreadsheet, 
  Plus, 
  MessageSquare, 
  Check, 
  Info, 
  RefreshCw, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight, 
  MessageCircle,
  TrendingUp,
  HelpCircle,
  PlusCircle,
  Sliders,
  Sparkle
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge, 
  TableWrapper,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  EmptyState,
  Button,
  Modal,
  Input,
  Select,
  Separator
} from '../../components/ui/CustomComponents';
import { initialBatches } from '../../data';

// Define rich At-Risk student records
interface AtRiskStudent {
  id: string;
  name: string;
  email: string;
  mobile: string;
  batchId: string;
  batchName: string;
  averageScore: number;
  skippedTestsCount: number;
  trend: 'up' | 'down' | 'flat';
  trendPercentage: number;
  weakTopics: string[];
  teacherNotes: string;
  joinedDate: string;
}

const initialAtRiskStudents: AtRiskStudent[] = [
  {
    id: 'st-at-1',
    name: 'Ananya Goel',
    email: 'ananya.goel@resultbooster.com',
    mobile: '+91 98123 45602',
    batchId: 'batch-1',
    batchName: 'CCC Morning Batch A',
    averageScore: 54.2,
    skippedTestsCount: 2,
    trend: 'down',
    trendPercentage: 4.5,
    weakTopics: ['MS Excel Advanced Formulas', 'Windows Operating System OS', 'Keyboard Shortcuts'],
    teacherNotes: 'Understands basic formulas but struggles with complex conditions & nested IF parameters. Skipped the Excel formulas assignment last Friday.',
    joinedDate: '2026-03-15'
  },
  {
    id: 'st-at-2',
    name: 'Ishita Patel',
    email: 'ishita.patel@resultbooster.com',
    mobile: '+91 98123 45604',
    batchId: 'batch-2',
    batchName: 'DCA Regular Batch B',
    averageScore: 48.6,
    skippedTestsCount: 3,
    trend: 'down',
    trendPercentage: 6.2,
    weakTopics: ['MS Word formatting tools', 'File Extensions & Storage', 'Internet Web Security'],
    teacherNotes: 'Critical gap in file hierarchy & system storage logic. Advanced paragraph styling margins consistently below benchmark. Needs focus on practical drills.',
    joinedDate: '2026-04-03'
  },
  {
    id: 'st-at-3',
    name: 'Rohan Vasu',
    email: 'rohan.vasu@resultbooster.com',
    mobile: '+91 90512 78391',
    batchId: 'batch-1',
    batchName: 'CCC Morning Batch A',
    averageScore: 58.1,
    skippedTestsCount: 1,
    trend: 'up',
    trendPercentage: 2.3,
    weakTopics: ['LibreOffice Writer Operations', 'Operating System basics'],
    teacherNotes: 'Showing a trace of recovery after assigning the LibreOffice keyboard shortcut booster pack. Custom alignments and styles remains a blocker.',
    joinedDate: '2026-04-10'
  },
  {
    id: 'st-at-4',
    name: 'Meera Nair',
    email: 'meera.nair@resultbooster.com',
    mobile: '+91 91234 50987',
    batchId: 'batch-2',
    batchName: 'DCA Regular Batch B',
    averageScore: 51.5,
    skippedTestsCount: 4,
    trend: 'down',
    trendPercentage: 1.8,
    weakTopics: ['Network subnetting basics', 'Computer Fundamentals', 'Email Configurations'],
    teacherNotes: 'Skipped four laboratory sessions and has lowest performance indicators in Ms Access tables. Requires structured assignments enforcement.',
    joinedDate: '2026-04-18'
  },
  {
    id: 'st-at-5',
    name: 'Ranbir Kapoor',
    email: 'ranbir.k@gmail.com',
    mobile: '+91 98123 45612',
    batchId: 'batch-3',
    batchName: 'ADCA Evening Advanced',
    averageScore: 39.0,
    skippedTestsCount: 5,
    trend: 'down',
    trendPercentage: 11.4,
    weakTopics: ['Programming - Python Syntax', 'Database Keys & Field indexes', 'Web Design basics'],
    teacherNotes: 'Candidate recently skipped fundamental lectures. Heavy conceptual backlog in basic programming logic parameters and database relations.',
    joinedDate: '2026-05-01'
  },
  {
    id: 'st-at-6',
    name: 'Aditya Roy',
    email: 'aditya.roy@resultbooster.com',
    mobile: '+91 98123 45610',
    batchId: 'batch-1',
    batchName: 'CCC Morning Batch A',
    averageScore: 62.1,
    skippedTestsCount: 0,
    trend: 'up',
    trendPercentage: 5.8,
    weakTopics: ['PowerPoint Animations', 'MS Word Tab Stops'],
    teacherNotes: 'Scored above 60% in latest office tools tests but slips in advanced custom templates and macro scripting. Progressing toward stability.',
    joinedDate: '2026-04-12'
  }
];

// Heatmap dynamic data
interface HeatmapTopic {
  name: string;
  category: 'Office Suite' | 'Fundamentals' | 'Programming' | 'Internet';
  strugglingCount: number;
  impactLevel: 'High' | 'Critical' | 'Medium';
}

const initialHeatmapTopics: HeatmapTopic[] = [
  { name: 'MS Excel Advanced Formulas', category: 'Office Suite', strugglingCount: 8, impactLevel: 'Critical' },
  { name: 'Windows Operating System OS', category: 'Fundamentals', strugglingCount: 12, impactLevel: 'Critical' },
  { name: 'Programming - Python Syntax', category: 'Programming', strugglingCount: 15, impactLevel: 'Critical' },
  { name: 'MS Word formatting tools', category: 'Office Suite', strugglingCount: 9, impactLevel: 'High' },
  { name: 'Network subnetting basics', category: 'Internet', strugglingCount: 6, impactLevel: 'Medium' },
  { name: 'LibreOffice Writer Operations', category: 'Office Suite', strugglingCount: 5, impactLevel: 'Medium' },
  { name: 'Database Keys & Field indexes', category: 'Programming', strugglingCount: 11, impactLevel: 'High' },
  { name: 'Email Configurations', category: 'Internet', strugglingCount: 7, impactLevel: 'Medium' }
];

export default function OwnerWeakStudents() {
  // --- CORE INTERVENTIONS CONTROLS ---
  const [students, setStudents] = React.useState<AtRiskStudent[]>(initialAtRiskStudents);
  const [thresholdFilter, setThresholdFilter] = React.useState<number>(65); // Slider/selector for under threshold score limit
  const [selectedBatchId, setSelectedBatchId] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  
  // Highlight chosen topic in heatmap to filter table dynamically!
  const [selectedHeatmapTopic, setSelectedHeatmapTopic] = React.useState<string | null>(null);

  // --- INTERACTIVE MODALS STRATEGY ---
  const [activeModalStudent, setActiveModalStudent] = React.useState<AtRiskStudent | null>(null);
  const [modalType, setModalType] = React.useState<'practice' | 'whatsapp' | 'view' | 'edit-note' | null>(null);
  
  // Custom states for modal payloads
  const [customTestTopic, setCustomTestTopic] = React.useState<string>('');
  const [customTestDuration, setCustomTestDuration] = React.useState<string>('30');
  const [customTestQuestions, setCustomTestQuestions] = React.useState<string>('15');
  const [interactiveTeacherNote, setInteractiveTeacherNote] = React.useState<string>('');
  const [isNoteModified, setIsNoteModified] = React.useState<boolean>(false);

  // General Notification System UI
  const [notification, setNotification] = React.useState<string | null>(null);

  const triggerNotification = (text: string) => {
    setNotification(text);
    setTimeout(() => setNotification(null), 4000);
  };

  // Filter students based on current selection parameters
  const filteredStudents = students.filter(st => {
    // 1. Check Search Query
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          st.weakTopics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 2. Filter by threshold score limit
    const matchesThreshold = st.averageScore <= thresholdFilter;

    // 3. Filter by batch
    const matchesBatch = selectedBatchId === 'all' || st.batchId === selectedBatchId;

    // 4. Heatmap highlighted filter (Double visual synergy)
    const matchesHeatmap = !selectedHeatmapTopic || st.weakTopics.includes(selectedHeatmapTopic);

    return matchesSearch && matchesThreshold && matchesBatch && matchesHeatmap;
  });

  // --- CORE SYSTEM OPERATIONS ---
  const handleOpenAssignModal = (student: AtRiskStudent) => {
    setActiveModalStudent(student);
    setCustomTestTopic(student.weakTopics[0] || 'MS Excel Advanced Formulas');
    setCustomTestDuration('35');
    setCustomTestQuestions('15');
    setModalType('practice');
  };

  const submitAssignPracticeTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalStudent) return;

    triggerNotification(
      `🎯 Personalized Adaptive Practice set dispatched to ${activeModalStudent.name}! Target sub-unit: ${customTestTopic} (${customTestQuestions} Questions, ${customTestDuration} mins)`
    );
    setModalType(null);
    setActiveModalStudent(null);
  };

  const handleOpenWhatsAppModal = (student: AtRiskStudent) => {
    setActiveModalStudent(student);
    setModalType('whatsapp');
  };

  const submitWhatsAppReport = () => {
    if (!activeModalStudent) return;
    triggerNotification(
      `💬 Remedial breakdown dispatched to parents of ${activeModalStudent.name} is scheduled on WhatsApp! SMS log saved in command center index.`
    );
    setModalType(null);
    setActiveModalStudent(null);
  };

  const handleOpenEditNoteModal = (student: AtRiskStudent) => {
    setActiveModalStudent(student);
    setInteractiveTeacherNote(student.teacherNotes);
    setModalType('edit-note');
  };

  const saveTeacherNoteChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalStudent) return;

    setStudents(prev => prev.map(s => {
      if (s.id === activeModalStudent.id) {
        return { ...s, teacherNotes: interactiveTeacherNote };
      }
      return s;
    }));

    triggerNotification(`📝 Updated coordinator notes for student ${activeModalStudent.name}`);
    setModalType(null);
    setActiveModalStudent(null);
  };

  const triggerResetFilters = () => {
    setSearchQuery('');
    setThresholdFilter(65);
    setSelectedBatchId('all');
    setSelectedHeatmapTopic(null);
    triggerNotification('Successfully restored default active dashboard filter parameters.');
  };

  // Calculate stats for layout reference
  const totalStruggling = students.length;
  const criticalThreatCount = students.filter(s => s.averageScore < 50).length;
  const skippedWorksetsSum = students.reduce((acc, current) => acc + current.skippedTestsCount, 0);

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in pb-12 font-sans">
      
      {/* Central Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 p-4 max-w-sm rounded-xl border border-primary/20 bg-card text-foreground shadow-lg flex items-start gap-3 animate-slide-in">
          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
            <Sparkles className="h-3 w-3" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-black block">Result Booster Intervention Broadcast</span>
            <p className="text-[11px] text-muted-foreground leading-normal">{notification}</p>
          </div>
        </div>
      )}

      {/* TOP SECTION: Hero Page Title, Interactive Action, Explanation Texts */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-destructive animate-pulse" />
            Weak Student Detection
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
            Result Booster's flagship workspace engine. Monitor candidates whose continuous diagnostic score models hover below limits. Deploy adaptive task homework modules and synchronize warning cards directly with registered parents.
          </p>
        </div>

        {/* Global Stats Indicators */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3.5 py-2 rounded-xl bg-destructive/5 border border-destructive/20 text-center">
            <span className="text-[10px] text-muted-foreground uppercase font-black block">Threat Status</span>
            <strong className="text-sm font-black text-destructive">{criticalThreatCount} Critical (&lt;50%)</strong>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
            <span className="text-[10px] text-muted-foreground uppercase font-black block">Missed Papers</span>
            <strong className="text-sm font-black text-amber-600 dark:text-amber-400">{skippedWorksetsSum} Total Skipped</strong>
          </div>
        </div>
      </div>

      {/* INTERACTIVE CONTROLS TOOLBAR */}
      <Card className="p-4 bg-muted/20 border border-border/85 select-none">
        <div className="grid gap-4 md:grid-cols-12 items-end">
          
          {/* 1. Risk Threshold slider Filter */}
          <div className="md:col-span-4 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-foreground">Scoring Threshold Cut: </span>
              <Badge variant="destructive" className="font-mono font-bold text-[10px]">&le; {thresholdFilter}% Accuracy</Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground">40%</span>
              <input 
                type="range" 
                min="40" 
                max="80" 
                step="5" 
                value={thresholdFilter}
                onChange={(e) => setThresholdFilter(Number(e.target.value))}
                className="w-full h-1.5 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer accent-primary" 
              />
              <span className="text-[10px] text-muted-foreground">80%</span>
            </div>
          </div>

          {/* 2. Batch Selector Filter */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase">Classroom Batch</label>
            <Select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="h-9 text-xs bg-background"
            >
              <option value="all">📁 All Classroom Streams</option>
              {initialBatches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </Select>
          </div>

          {/* 3. Search Field input */}
          <div className="md:col-span-3 space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase">Query Topic or Name</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
              <Input
                placeholder="Search candidate or weak module..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8.5 h-9 text-xs bg-background placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Reset Action Button */}
          <div className="md:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={triggerResetFilters}
              className="w-full h-9 gap-1.5 font-bold text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Filters
            </Button>
          </div>

        </div>

        {/* Informational strip if topic highlighted */}
        {selectedHeatmapTopic && (
          <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs bg-primary/5 p-2 rounded-lg">
            <span className="text-muted-foreground">
              Filtering specifically for candidates struggling in: <strong className="text-foreground font-semibold">{selectedHeatmapTopic}</strong>
            </span>
            <button
              onClick={() => setSelectedHeatmapTopic(null)}
              className="text-primary hover:underline font-bold text-[10px] uppercase"
            >
              Clear Heatmap Filter ×
            </button>
          </div>
        )}
      </Card>

      {/* DOUBLE DOUBLE GRID CORE VIEW LAYOUT */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* LEFT COLUMN: Premium Candidate Table */}
        <div className="lg:col-span-2 space-y-4">
          <TableWrapper
            title="Comprehensive At-Risk Candidate Queue"
            description={`Displaying ${filteredStudents.length} candidate rows struggling in critical performance indicators`}
          >
            {filteredStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Student Candidate</TableHead>
                    <TableHead className="text-xs">Class Batch</TableHead>
                    <TableHead className="text-xs text-center font-bold">Accuracy Mean &amp; Trend</TableHead>
                    <TableHead className="text-xs">Risk Matrix</TableHead>
                    <TableHead className="text-xs">Key Weak Subjects</TableHead>
                    <TableHead className="text-xs text-center">Skipped</TableHead>
                    <TableHead className="text-xs text-right">Intervention Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((st) => {
                    const isCritical = st.averageScore < 50;
                    const isHigh = st.averageScore >= 50 && st.averageScore < 60;
                    const isModerate = st.averageScore >= 60;

                    return (
                      <React.Fragment key={st.id}>
                        {/* Student Primary Row */}
                        <TableRow className="border-b-0 hover:bg-muted/10">
                          
                          {/* Student Details Component */}
                          <TableCell className="align-top py-4">
                            <div className="flex items-start gap-2.5">
                              <div className={`h-8 w-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border ${
                                isCritical 
                                  ? 'bg-destructive/10 text-destructive border-destructive/25' 
                                  : 'bg-amber-500/10 text-amber-500 border-amber-500/25'
                              }`}>
                                {st.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-extrabold text-foreground text-xs block leading-none">{st.name}</span>
                                <span className="text-[9px] text-muted-foreground font-mono block mt-1">{st.email}</span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Classroom Batch */}
                          <TableCell className="align-top py-4 text-xs font-semibold text-foreground max-w-[120px] truncate" title={st.batchName}>
                            {st.batchName}
                          </TableCell>

                          {/* Latest Acc Mean & Trend Visualizer */}
                          <TableCell className="align-top py-4 text-center font-mono">
                            <div className="space-y-1">
                              <span className={`text-xs font-black block ${
                                isCritical ? 'text-destructive font-black' : 'text-foreground'
                              }`}>
                                {st.averageScore}%
                              </span>
                              
                              <span className={`inline-flex items-center gap-0.5 text-[9px] font-bold ${
                                st.trend === 'up' 
                                  ? 'text-emerald-600 dark:text-emerald-400' 
                                  : st.trend === 'down' 
                                    ? 'text-destructive' 
                                    : 'text-muted-foreground'
                              }`}>
                                {st.trend === 'up' && <ArrowUpRight className="h-2.5 w-2.5" />}
                                {st.trend === 'down' && <ArrowDownRight className="h-2.5 w-2.5" />}
                                <span>{st.trendPercentage}%</span>
                              </span>
                            </div>
                          </TableCell>

                          {/* Risk Badging derived */}
                          <TableCell className="align-top py-4">
                            {isCritical && (
                              <Badge variant="destructive" className="text-[8px] tracking-wide uppercase font-black px-1.5 py-0 leading-none">
                                Critical Alert
                              </Badge>
                            )}
                            {isHigh && (
                              <Badge className="text-[8px] tracking-wide uppercase font-black px-1.5 py-0 leading-none border-transparent text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400">
                                High Risk
                              </Badge>
                            )}
                            {isModerate && (
                              <Badge variant="secondary" className="text-[8px] tracking-wide uppercase font-black px-1.5 py-0 leading-none border-transparent text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400">
                                Moderate Risk
                              </Badge>
                            )}
                          </TableCell>

                          {/* Specific weak subjects */}
                          <TableCell className="align-top py-4 max-w-[180px]">
                            <div className="flex flex-wrap gap-1">
                              {st.weakTopics.map((topic, i) => (
                                <Badge 
                                  key={i} 
                                  variant="outline" 
                                  onClick={() => setSelectedHeatmapTopic(selectedHeatmapTopic === topic ? null : topic)}
                                  className={`text-[9px] font-mono px-1 py-0 cursor-pointer hover:bg-primary/5 transition-colors ${
                                    selectedHeatmapTopic === topic 
                                      ? 'bg-primary/10 text-primary border-primary/45' 
                                      : 'bg-muted/40 text-muted-foreground'
                                  }`}
                                  title="Click to screen students with this conceptual blocker"
                                >
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>

                          {/* Missed exam count */}
                          <TableCell className="align-top py-4 text-center font-mono font-bold text-xs">
                            {st.skippedTestsCount > 0 ? (
                              <span className={`px-2 py-0.5 text-[10px] rounded-md ${
                                st.skippedTestsCount >= 3 
                                  ? 'bg-destructive/10 text-destructive' 
                                  : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {st.skippedTestsCount}
                              </span>
                            ) : (
                              <span className="text-emerald-500 text-[10px]">None</span>
                            )}
                          </TableCell>

                          {/* Inline Interventions Actions */}
                          <TableCell className="align-top py-4 text-right pr-4">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* View details */}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveModalStudent(st);
                                  setModalType('view');
                                }}
                                className="p-1 border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-all"
                                title="View Dossier Details"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>

                              {/* WhatsApp Direct */}
                              <button
                                type="button"
                                onClick={() => handleOpenWhatsAppModal(st)}
                                className="p-1 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded transition-all"
                                title="Send WhatsApp parent report card"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                              </button>

                              {/* Assign remedial homework drill */}
                              <button
                                type="button"
                                onClick={() => handleOpenAssignModal(st)}
                                className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-primary text-primary-foreground hover:bg-primary/95 px-2 py-1 rounded transition-all active:scale-95 cursor-pointer shadow-xs"
                              >
                                <PlusCircle className="h-3 w-3 shrink-0" />
                                Remedial Test
                              </button>
                            </div>
                          </TableCell>

                        </TableRow>

                        {/* Coordinated Extra Child Row containing teacher notes preview & edit */}
                        <TableRow className="bg-muted/[0.01] hover:bg-transparent">
                          <TableCell colSpan={7} className="pt-0 pb-4 pl-12 pr-4 border-b border-border">
                            <div className="rounded-xl border border-dashed border-border/85 bg-card/65 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                              
                              {/* Note text summary */}
                              <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground uppercase font-black block flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3 text-primary shrink-0" />
                                  Academic Action Checklist Remark
                                </span>
                                <p className="text-muted-foreground leading-normal italic text-[11px]">
                                  &ldquo;{st.teacherNotes}&rdquo;
                                </p>
                              </div>

                              {/* Fast inline remark edit popover clicker */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditNoteModal(st)}
                                className="text-primary hover:underline font-bold text-[10px] flex items-center gap-1 shrink-0 uppercase tracking-widest self-end sm:self-center"
                              >
                                Update Note
                              </button>

                            </div>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <EmptyState
                icon={CheckCircle}
                title="No students match the customized filter bounds"
                description="This indicates that currently, all system learners are either exceeding the target risk threshold parameters, belong to other class branches, or have cleared the spotlight topics."
                actionLabel="Reset Applied Filters"
                onAction={triggerResetFilters}
              />
            )}
          </TableWrapper>
        </div>

        {/* RIGHT COLUMN SIDE PANEL: Deep Analytics Bento Cards */}
        <div className="space-y-6">
          
          {/* ANALYTICS CARD 1: Topic Heatmap tracker */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="p-5 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-black text-foreground flex items-center gap-1.5">
                  <FlameKindling className="h-4 w-4 text-destructive shrink-0" />
                  Blocker Matrix Heatmap
                </CardTitle>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                  Concept Fail Rates
                </span>
              </div>
              <CardDescription className="text-xs">
                Highest failure frequency tags. <strong className="text-foreground font-semibold">Click a grid cell</strong> to filter active failing candidates.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              
              {/* Dynamic Heatmap cells grid */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                {initialHeatmapTopics.map((topic, index) => {
                  const isHighlighted = selectedHeatmapTopic === topic.name;
                  
                  // Heatmap color code mappings based on impact
                  let bgClasses = 'bg-muted text-foreground border-border hover:border-foreground/45';
                  if (topic.impactLevel === 'Critical') {
                    bgClasses = isHighlighted 
                      ? 'bg-destructive/15 text-destructive border-destructive ring-2 ring-destructive ring-offset-2' 
                      : 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20';
                  } else if (topic.impactLevel === 'High') {
                    bgClasses = isHighlighted
                      ? 'bg-amber-500/15 text-amber-600 border-amber-500 ring-2 ring-amber-500 ring-offset-2 dark:text-amber-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20';
                  } else if (topic.impactLevel === 'Medium') {
                    bgClasses = isHighlighted
                      ? 'bg-primary/15 text-primary border-primary ring-2 ring-primary ring-offset-2'
                      : 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10';
                  }

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedHeatmapTopic(selectedHeatmapTopic === topic.name ? null : topic.name)}
                      className={`p-3 rounded-lg border text-left transition-all relative cursor-pointer ${bgClasses}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono opacity-80 uppercase leading-none">{topic.category}</span>
                        <span className="text-[9.5px] font-black leading-none bg-background/50 px-1 py-0.5 rounded border border-border/15">
                          {topic.strugglingCount} Candidates
                        </span>
                      </div>
                      
                      <p className="mt-2.5 text-[11px] font-black leading-tight truncate">
                        {topic.name}
                      </p>

                      <div className="mt-1 flex justify-between items-center text-[8px] font-mono opacity-80">
                        <span>Severity Index</span>
                        <span className="font-bold">{topic.impactLevel}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Informational guide */}
              <p className="text-[10px] text-muted-foreground leading-normal flex items-start gap-1.5 pt-1 border-t border-border">
                <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>Impact metrics show student ratios with sub-55% accuracy on standard question tag checkpoints.</span>
              </p>

            </CardContent>
          </Card>

          {/* ANALYTICS CARD 2: Batch conceptual weakness summaries */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-black text-foreground flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-primary shrink-0" />
                Cohort Blocker Summaries
              </CardTitle>
              <CardDescription className="text-xs">
                Micro-concept accuracy drop points mapped specifically to managed batches.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4 font-sans">
              
              {/* Batch 1 Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground">CCC Morning Batch A</span>
                  <span className="text-[10px] font-mono text-muted-foreground">Limit: Cell Referencing</span>
                </div>
                {/* Visual score slider bar representation */}
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-destructive" style={{ width: '42%' }} />
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-muted-foreground leading-none">
                    <span>LibreOffice Calc Math Formulas</span>
                    <span className="text-destructive font-bold">42% Accuracy Mean</span>
                  </div>
                </div>
              </div>

              {/* Batch 2 Breakdown */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground">DCA Regular Batch B</span>
                  <span className="text-[10px] font-mono text-muted-foreground">Limit: Access Queries</span>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-destructive" style={{ width: '49%' }} />
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-muted-foreground leading-none">
                    <span>MS Access Primary Keys & Indexes</span>
                    <span className="text-destructive font-bold">49% Accuracy Mean</span>
                  </div>
                </div>
              </div>

              {/* Batch 3 Breakdown */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground">ADCA Evening Advanced</span>
                  <span className="text-[10px] font-mono text-muted-foreground">Limit: HTML Layout</span>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-500" style={{ width: '58%' }} />
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-muted-foreground leading-none">
                    <span>HTML div sizing & CSS attributes</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">58% Accuracy Mean</span>
                  </div>
                </div>
              </div>

              {/* Batch 4 Breakdown */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-foreground">Olympiad Excellence Cohort</span>
                  <span className="text-[10px] font-mono text-muted-foreground">Limit: Permutations Calculus</span>
                </div>
                <div className="space-y-1">
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: '71%' }} />
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-muted-foreground leading-none">
                    <span>Mathematical induction proofs</span>
                    <span className="text-emerald-500 font-bold">71% Accuracy Mean</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => window.location.hash = '/owner/performance'}
                  className="w-full py-1.5 border border-dashed border-border hover:border-foreground/35 rounded-lg text-center font-bold text-[10px] text-muted-foreground hover:text-foreground uppercase tracking-widest block"
                >
                  Review performance trends
                </button>
              </div>

            </CardContent>
          </Card>

          {/* SYSTEM INTERVENTION RECOMMENDATION FEED */}
          <Card className="p-4 bg-primary/[0.01] border-dashed border-primary/20">
            <h4 className="text-xs uppercase font-extrabold text-primary flex items-center gap-1">
              <Sparkles className="h-4 w-4 shrink-0" />
              Intelligence Remedial Advisor
            </h4>
            <div className="text-[11px] text-muted-foreground mt-2 leading-relaxed space-y-2">
              <p>
                Candidates with high homework skip records (e.g. <strong className="text-foreground">Ranbir Kapoor</strong>) showed an immediate <span className="text-foreground font-semibold">+22% score recovery</span> within 10 days of launching remedial modules of sub-12 minutes duration.
              </p>
              <p>
                Suggesting dispatch of WhatsApp warning metrics to Ranbir's registered parent phone <strong className="text-foreground font-mono">+91 98123 45612</strong>.
              </p>
            </div>
          </Card>

        </div>

      </div>

      {/* --- REUSABLE MODAL LAYERS --- */}

      {/* MODAL A: ASSIGN REMEDIAL DRILL */}
      <Modal
        isOpen={modalType === 'practice' && !!activeModalStudent}
        onClose={() => { setModalType(null); setActiveModalStudent(null); }}
        title="Deploy Adaptive Intervention Drill"
        description={`Custom build and dispatch interactive practice exercises specifically to counter conceptual weaknesses for ${activeModalStudent?.name}.`}
      >
        {activeModalStudent && (
          <form onSubmit={submitAssignPracticeTest} className="space-y-4 pt-2 text-left">
            
            <div className="p-3 bg-muted/30 border border-border rounded-xl">
              <span className="text-[10px] text-muted-foreground block uppercase font-mono">Current Candidate Diagnosis</span>
              <strong className="text-xs font-bold text-foreground mt-0.5 block">{activeModalStudent.name} ({activeModalStudent.batchName})</strong>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {activeModalStudent.weakTopics.map((sub, i) => (
                  <Badge key={i} variant="outline" className="text-[9px] font-mono bg-background">
                    {sub}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Target Drill Subject-Unit</label>
              <Select
                value={customTestTopic}
                onChange={(e) => setCustomTestTopic(e.target.value)}
              >
                {activeModalStudent.weakTopics.map((topic, idx) => (
                  <option key={idx} value={topic}>{topic}</option>
                ))}
                <option value="MS Excel Pivot Tables & Sorts">MS Excel Pivot Tables & Sorts</option>
                <option value="Operating System Basics & Files">Operating System Basics & Files</option>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Question Limit Count</label>
                <Select
                  value={customTestQuestions}
                  onChange={(e) => setCustomTestQuestions(e.target.value)}
                >
                  <option value="10">10 Questions (Essential)</option>
                  <option value="15">15 Questions (Standard Practice)</option>
                  <option value="25">25 Questions (Intensive Review)</option>
                  <option value="40">40 Questions (Deep Mock)</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Time Duration Limit</label>
                <Select
                  value={customTestDuration}
                  onChange={(e) => setCustomTestDuration(e.target.value)}
                >
                  <option value="20">20 minutes</option>
                  <option value="35">35 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Intervention Mode Setting</label>
              <div className="p-3 rounded-lg border border-primary/20 bg-primary/[0.01] text-xs text-muted-foreground leading-normal font-medium">
                ⚡ <strong className="text-primary font-bold">Concept Booster Mode</strong> is active. The engine dynamically sets easier starting steps for the first 4 questions to stabilize the candidate confidence baseline.
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setModalType(null); setActiveModalStudent(null); }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 font-extrabold text-xs"
              >
                Deploy Homework Drill
              </Button>
            </div>

          </form>
        )}
      </Modal>

      {/* MODAL B: SEND WHATSAPP REPORT */}
      <Modal
        isOpen={modalType === 'whatsapp' && !!activeModalStudent}
        onClose={() => { setModalType(null); setActiveModalStudent(null); }}
        title="Dispatch WhatsApp Parent Warn Card"
        description={`Send a direct analytical diagnostic brief to the parent of ${activeModalStudent?.name}.`}
      >
        {activeModalStudent && (
          <div className="space-y-4 pt-2">
            
            <div className="p-3 border rounded-xl bg-muted/40 font-mono text-xs text-foreground space-y-2">
              <span className="text-[10px] text-muted-foreground block uppercase font-black font-sans">Message Preview Log</span>
              <p className="leading-relaxed whitespace-pre-line text-[11px]">
                {`Respected Parent,
This is diagnostic brief info from Result Booster.
Candidate: ${activeModalStudent.name} (Batch: ${activeModalStudent.batchName})
Current overall accuracy is at ${activeModalStudent.averageScore}% (Target: 70%).

Conceptual block issues detected in:
${activeModalStudent.weakTopics.map(t => `• ${t}`).join('\n')}

Pending remedial tasks skipped: ${activeModalStudent.skippedTestsCount} homework papers.
We have deployed tailored revision units. Please ensure daily adherence at home.
Regards, Result Booster Admin.`}
              </p>
            </div>

            <div className="space-y-2 text-xs text-muted-foreground leading-normal">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary shrink-0" />
                <span>Parent Mobile Coordinate: <strong className="text-foreground tracking-wider font-mono">{activeModalStudent.mobile}</strong></span>
              </div>
              <p>
                Dispatched metrics will include immediate links for parent authorization sheets and previous year error indices.
              </p>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setModalType(null); setActiveModalStudent(null); }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={submitWhatsAppReport}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5"
              >
                <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                Secure Dispatch Now
              </Button>
            </div>

          </div>
        )}
      </Modal>

      {/* MODAL C: DETAILED STUDENT DOSSIER VIEW */}
      <Modal
        isOpen={modalType === 'view' && !!activeModalStudent}
        onClose={() => { setModalType(null); setActiveModalStudent(null); }}
        title="Candidate Diagnostic Brief"
        description="Comprehensive summary of conceptual struggles and action items."
      >
        {activeModalStudent && (
          <div className="space-y-4 pt-2 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-foreground">{activeModalStudent.name}</h3>
                <p className="text-[10px] text-muted-foreground font-mono">{activeModalStudent.email}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-destructive block">{activeModalStudent.averageScore}% Accuracy</span>
                <span className="text-[9px] text-muted-foreground block">Roster joined: {activeModalStudent.joinedDate}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground font-bold block uppercase tracking-wider">Specific conceptual blocks</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalStudent.weakTopics.map((topic, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] font-mono bg-muted/40">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-1.5">
                <span className="text-[10px] text-muted-foreground font-bold block uppercase tracking-wider">Current teacher notes &amp; plans</span>
                <div className="p-3 bg-muted/20 rounded-lg text-xs italic text-muted-foreground leading-relaxed">
                  &ldquo;{activeModalStudent.teacherNotes}&rdquo;
                </div>
              </div>

              <div className="space-y-1 pt-1.5">
                <span className="text-[10px] text-muted-foreground font-bold block uppercase tracking-wider">Core Parameters</span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2 border rounded-lg bg-card">
                    <span className="text-[9px] text-muted-foreground block uppercase">Missed sessions</span>
                    <strong className="text-foreground text-sm font-black">{activeModalStudent.skippedTestsCount} tests</strong>
                  </div>
                  <div className="p-2 border rounded-lg bg-card">
                    <span className="text-[9px] text-muted-foreground block uppercase">SMS Notification Contact</span>
                    <strong className="text-foreground text-xs font-mono block mt-1">{activeModalStudent.mobile}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between gap-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Direct jump pathway to edit coordinates in candidates roster
                  window.location.hash = `/owner/students`;
                }}
                className="text-primary hover:text-primary/90 font-bold text-xs"
              >
                Go to Candidate Profile
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => { setModalType(null); setActiveModalStudent(null); }}
              >
                Close Dossier
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL D: EDIT TEACHER NOTES */}
      <Modal
        isOpen={modalType === 'edit-note' && !!activeModalStudent}
        onClose={() => { setModalType(null); setActiveModalStudent(null); }}
        title="Update Candidate Remedial Remark"
        description={`Modify central coordination action items and notes for ${activeModalStudent?.name}.`}
      >
        {activeModalStudent && (
          <form onSubmit={saveTeacherNoteChange} className="space-y-4 pt-2 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Teacher / Coordinator Remedial Remark Notes</label>
              <textarea
                value={interactiveTeacherNote}
                onChange={(e) => setInteractiveTeacherNote(e.target.value)}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed"
                placeholder="Describe current candidate struggle patterns or parent feedback log..."
                required
              />
              <p className="text-[10px] text-muted-foreground">
                This remark will appear on dynamic exception dashboard blocks for institute directors. Mention recommended hours of 1-1 session if any.
              </p>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setModalType(null); setActiveModalStudent(null); }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-xs font-extrabold"
              >
                Save Intervention Note
              </Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
