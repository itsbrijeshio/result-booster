import * as React from 'react';
import { 
  Layers, 
  Calendar, 
  Plus, 
  CheckCircle, 
  ChevronRight, 
  User, 
  Search, 
  AlertTriangle, 
  Trash2, 
  Edit, 
  Archive, 
  Clock, 
  Sparkles, 
  Share2, 
  FileText, 
  Filter, 
  BookOpen,
  ArrowRight,
  TrendingUp,
  X,
  Send,
  Loader2
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge, 
  Modal, 
  Input, 
  Select,
  PageContainer,
  EmptyState,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '../../components/ui/CustomComponents';
import { initialBatches, initialStudents, initialTestAttempts } from '../../data';
import { Batch } from '../../types';

interface ExtendedBatch extends Batch {
  courseName: string;
  examDate: string;
  isArchived: boolean;
}

export default function OwnerBatches() {
  // Enhance initial mock batches for visual fidelity and SaaS requirements
  const [batches, setBatches] = React.useState<ExtendedBatch[]>(() => {
    return initialBatches.map(b => {
      let courseName = 'CCC Certification';
      let examDate = '2026-06-25';
      if (b.id === 'batch-2') {
        courseName = 'DCA Diploma';
        examDate = '2026-07-20';
      } else if (b.id === 'batch-3') {
        courseName = 'ADCA Diploma';
        examDate = '2026-08-15';
      } else if (b.id === 'batch-4') {
        courseName = 'O Level IT';
        examDate = '2026-09-10';
      }
      return {
        ...b,
        courseName,
        examDate,
        isArchived: false
      };
    });
  });

  // UI state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [courseFilter, setCourseFilter] = React.useState('All');
  const [viewStatus, setViewStatus] = React.useState<'active' | 'archived'>('active');
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  
  // Selected batche state for Detail & Edit
  const [selectedBatch, setSelectedBatch] = React.useState<ExtendedBatch | null>(null);

  // Form states (Create / Edit)
  const [formName, setFormName] = React.useState('');
  const [formCourse, setFormCourse] = React.useState('CCC Certification');
  const [formSchedule, setFormSchedule] = React.useState('');
  const [formStudentCount, setFormStudentCount] = React.useState('40');
  const [formExamDate, setFormExamDate] = React.useState('2026-07-20');
  const [formAvgScore, setFormAvgScore] = React.useState('75');

  // Interactive feedback
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  // Trigger toast timer utility
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Simulate server sync for search/filter operations to add visual high-value weight
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, courseFilter, viewStatus]);

  // Handle Create Batch Form submission
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSchedule) {
      triggerToast('Error: Please fill in all required fields.');
      return;
    }

    const newId = `batch-${Date.now()}`;
    const newBatch: ExtendedBatch = {
      id: newId,
      name: formName,
      courseName: formCourse,
      studentCount: parseInt(formStudentCount, 10) || 0,
      schedule: formSchedule,
      avgPerformance: parseInt(formAvgScore, 10) || 75.0,
      activeTestsCount: 0,
      examDate: formExamDate,
      isArchived: false
    };

    setBatches([newBatch, ...batches]);
    setIsCreateOpen(false);
    triggerToast(`Batch "${formName}" successfully created and registered.`);
    
    // Reset Form fields
    setFormName('');
    setFormSchedule('');
    setFormStudentCount('40');
    setFormExamDate('2026-07-20');
    setFormAvgScore('75');
  };

  // Open Edit Batch form context
  const handleOpenEdit = (batch: ExtendedBatch, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening details
    setSelectedBatch(batch);
    setFormName(batch.name);
    setFormCourse(batch.courseName);
    setFormSchedule(batch.schedule);
    setFormStudentCount(batch.studentCount.toString());
    setFormExamDate(batch.examDate);
    setFormAvgScore(batch.avgPerformance.toString());
    setIsEditOpen(true);
  };

  // Submit Edit Batch changes
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;

    setBatches(batches.map(b => {
      if (b.id === selectedBatch.id) {
        return {
          ...b,
          name: formName,
          courseName: formCourse,
          schedule: formSchedule,
          studentCount: parseInt(formStudentCount, 10) || 0,
          examDate: formExamDate,
          avgPerformance: parseInt(formAvgScore, 10) || 75
        };
      }
      return b;
    }));

    setIsEditOpen(false);
    triggerToast(`Batch information updated successfully.`);
  };

  // Toggle archive status
  const handleToggleArchive = (batch: ExtendedBatch, e: React.MouseEvent) => {
    e.stopPropagation();
    setBatches(batches.map(b => {
      if (b.id === batch.id) {
        return { ...b, isArchived: !b.isArchived };
      }
      return b;
    }));
    triggerToast(`Batch "${batch.name}" has been ${batch.isArchived ? 'restored to active' : 'moved to archived'} status.`);
  };

  // Open Batch Details Panel
  const handleOpenDetails = (batch: ExtendedBatch) => {
    setSelectedBatch(batch);
    setIsDetailOpen(true);
  };

  // Send WhatsApp Progress Report Simulation
  const handleSendWhatsAppReport = (batchName: string) => {
    triggerToast(`📲 WhatsApp progress scorecard & weak topic metrics successfully compiled & sent to all candidates in ${batchName}!`);
  };

  // Calculate progress toward exam percentage helper
  const calculateExamProgress = (examDateStr: string) => {
    try {
      const current = new Date('2026-05-28');
      const target = new Date(examDateStr);
      const start = new Date('2026-01-01'); // Assume course standard start date
      
      const totalDuration = target.getTime() - start.getTime();
      const elapsed = current.getTime() - start.getTime();
      
      if (totalDuration <= 0) return 100;
      const progressPercent = Math.round((elapsed / totalDuration) * 100);
      return Math.max(10, Math.min(100, progressPercent));
    } catch (e) {
      return 65; // fallback default
    }
  };

  // Calculate days remaining toward exam helper
  const calculateDaysRemaining = (examDateStr: string) => {
    const current = new Date('2026-05-28');
    const target = new Date(examDateStr);
    const diffTime = target.getTime() - current.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter batches list based on filters
  const filteredBatches = batches.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = courseFilter === 'All' || b.courseName === courseFilter;
    
    const matchesArchived = viewStatus === 'active' ? !b.isArchived : b.isArchived;

    return matchesSearch && matchesCourse && matchesArchived;
  });

  return (
    <PageContainer>
      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm p-4 bg-foreground text-background dark:bg-card dark:text-foreground border border-border rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
          <div className="text-xs font-semibold leading-relaxed">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Institute Batches
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 tracking-wide leading-relaxed">
            Configure coaching batches, track scheduling pipelines, average scores, and coordinate scheduled NIELIT exams.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            Create Training Batch
          </button>
        </div>
      </div>

      {/* Toolbar Filter Grid */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-muted/20 p-3 rounded-xl border border-border/80">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
          {/* Searching Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground/60" />
            <Input
              type="text"
              placeholder="Search batches by name or stream..."
              className="pl-9 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filtering Dropdown Select */}
          <div className="relative w-full sm:w-48">
            <Select
              className="text-xs font-medium"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="All">All Courses</option>
              <option value="CCC Certification">CCC Course</option>
              <option value="DCA Diploma">DCA Diploma</option>
              <option value="ADCA Diploma">ADCA Diploma</option>
              <option value="O Level IT">O Level IT</option>
            </Select>
          </div>
        </div>

        {/* Active vs Archive Toggle Selector Tabs */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg self-start sm:self-auto shrink-0">
          <button
            onClick={() => setViewStatus('active')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              viewStatus === 'active' 
                ? 'bg-background text-foreground shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Active ({batches.filter(b => !b.isArchived).length})
          </button>
          <button
            onClick={() => setViewStatus('archived')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              viewStatus === 'archived' 
                ? 'bg-background text-foreground shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Archived ({batches.filter(b => b.isArchived).length})
          </button>
        </div>
      </div>

      {/* Main Grid Content Area */}
      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="text-xs text-muted-foreground font-mono">Updating batch lists data models...</span>
        </div>
      ) : filteredBatches.length === 0 ? (
        <EmptyState
          icon={Layers}
          title={searchQuery ? "No matching batches found" : `No ${viewStatus} batches available`}
          description={
            searchQuery 
              ? `We couldn't find any batches matching "${searchQuery}". Please check your filter values and try again.` 
              : `There are currently no training batches in the ${viewStatus} folder. Create a new batch or edit existing archives to match.`
          }
          actionLabel={searchQuery ? "Clear Search Filters" : "Register a New Batch"}
          onAction={
            searchQuery 
              ? () => { setSearchQuery(''); setCourseFilter('All'); }
              : () => setIsCreateOpen(true)
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBatches.map((batch) => {
            const progressPercent = calculateExamProgress(batch.examDate);
            const daysRemaining = calculateDaysRemaining(batch.examDate);

            // Determine matching styling accents based on index or course name
            let cardColorBorder = 'hover:border-primary';
            let courseTagStyle = 'bg-primary/10 text-primary';
            if (batch.courseName.includes('CCC')) {
              courseTagStyle = 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400';
            } else if (batch.courseName.includes('DCA')) {
              courseTagStyle = 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400';
            } else if (batch.courseName.includes('ADCA')) {
              courseTagStyle = 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400';
            } else if (batch.courseName.includes('O Level')) {
              courseTagStyle = 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400';
            }

            return (
              <Card 
                key={batch.id} 
                className={`relative overflow-hidden group hover:shadow-md border border-border/70 ${cardColorBorder} active:border-primary/80 transition-all flex flex-col justify-between cursor-pointer`}
                onClick={() => handleOpenDetails(batch)}
              >
                {/* Header context */}
                <CardHeader className="pb-3.5">
                  <div className="flex justify-between items-start gap-2">
                    <Badge variant="outline" className={`${courseTagStyle} font-extrabold uppercase text-[10px] tracking-wider px-2`}>
                      {batch.courseName}
                    </Badge>
                    <Badge variant={batch.avgPerformance >= 80 ? 'success' : 'secondary'}>
                      {batch.avgPerformance}% Avg Score
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground mt-3 leading-snug group-hover:text-primary transition-colors">
                    {batch.name}
                  </CardTitle>

                  <CardDescription className="text-[11px] pt-1.5 flex items-center gap-1.5 text-muted-foreground font-semibold">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                    <span className="truncate">{batch.schedule}</span>
                  </CardDescription>
                </CardHeader>

                {/* Body Metrics Progress */}
                <CardContent className="pb-4 space-y-4">
                  {/* Progress towards scheduled exam date */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-muted-foreground">Course Completion Progress</span>
                      <span className="text-foreground tracking-tight">{progressPercent}%</span>
                    </div>
                    
                    {/* Simplified progress bar structure */}
                    <div className="w-full bg-muted/65 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${progressPercent}%` }} />
                    </div>

                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span>Exam: {batch.examDate}</span>
                      <span className={daysRemaining > 0 ? "text-amber-600 font-bold" : "text-muted-foreground font-bold"}>
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Completed'}
                      </span>
                    </div>
                  </div>

                  {/* Class Info grid counts */}
                  <div className="border-t border-border/60 pt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Students</span>
                      <span className="font-mono text-sm font-black text-foreground mt-0.5 block flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-muted-foreground/70" />
                        {batch.studentCount} active
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Mock Tests Run</span>
                      <span className="font-mono text-sm font-black text-foreground mt-0.5 block flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground/70" />
                        {batch.activeTestsCount || 3} assigned
                      </span>
                    </div>
                  </div>
                </CardContent>

                {/* Action button triggers footer panel */}
                <div 
                  className="bg-muted/30 border-t border-border/50 px-5 py-3 flex items-center justify-between"
                  onClick={(e) => e.stopPropagation()} // Prevent details popup trigger
                >
                  <button 
                    onClick={() => handleOpenDetails(batch)}
                    className="inline-flex items-center text-primary font-bold hover:underline text-[11px] gap-1 cursor-pointer"
                  >
                    View Students
                    <ArrowRight className="h-3 w-3" />
                  </button>

                  <div className="flex items-center gap-1">
                    {/* Edit action */}
                    <button 
                      onClick={(e) => handleOpenEdit(batch, e)}
                      title="Edit Batch Details"
                      className="p-1 px-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-semibold transition-all flex items-center gap-1 border border-border/40"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>

                    {/* Archive toggle action */}
                    <button 
                      onClick={(e) => handleToggleArchive(batch, e)}
                      title={batch.isArchived ? "Restore to Active" : "Archive Batch"}
                      className="p-1 px-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground text-[11px] font-semibold transition-all flex items-center gap-1 border border-border/40"
                    >
                      <Archive className="h-3 w-3" />
                      {batch.isArchived ? 'Restore' : 'Archive'}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* DETAILED DIALOG/MODAL DRAWER POPUP */}
      {selectedBatch && isDetailOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop screen filter */}
          <div 
            className="fixed inset-0 bg-foreground/45 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsDetailOpen(false)}
          />

          {/* Large dynamic body panel */}
          <div className="relative z-50 w-full max-w-4xl scale-100 rounded-2xl border border-border bg-card p-4 sm:p-6 text-card-foreground shadow-2xl transition-all max-h-[92vh] overflow-y-auto">
            {/* Header section info */}
            <div className="flex justify-between items-start border-b border-border pb-4 mb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-primary/10 text-primary font-black uppercase text-[10px] tracking-wider">
                    {selectedBatch.courseName}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {selectedBatch.schedule}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  {selectedBatch.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Complete batch scorecard metrics, enrolled student database profiles, and recent class weaknesses.
                </p>
              </div>

              {/* Close Button element */}
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all border border-border/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Structured two column dashboard content */}
            <div className="grid gap-6 lg:grid-cols-12">
              
              {/* Left Column: Student List Table (takes 7 columns) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-center bg-muted/30 p-2.5 rounded-lg border border-border/40">
                  <h3 className="text-xs font-black uppercase tracking-wider text-foreground block">
                    Registered Batch Students ({initialStudents.filter(s => s.batchId === selectedBatch.id).length})
                  </h3>
                  <button
                    onClick={() => handleSendWhatsAppReport(selectedBatch.name)}
                    className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer transition-all"
                  >
                    <Send className="h-3 w-3" />
                    WhatsApp Batch Report Card
                  </button>
                </div>

                <div className="border border-border rounded-xl overflow-hidden max-h-[320px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[10px] font-extrabold uppercase py-2">Student</TableHead>
                        <TableHead className="text-[10px] font-extrabold uppercase py-2 text-center">Avg Score</TableHead>
                        <TableHead className="text-[10px] font-extrabold uppercase py-2 text-center">Attempts</TableHead>
                        <TableHead className="text-[10px] font-extrabold uppercase py-2">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {initialStudents.filter(s => s.batchId === selectedBatch.id).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-8">
                            No students currently registered in this batch.
                          </TableCell>
                        </TableRow>
                      ) : (
                        initialStudents.filter(s => s.batchId === selectedBatch.id).map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="p-3">
                              <div className="space-y-0.5">
                                <span className="font-bold text-foreground block text-xs">{student.name}</span>
                                <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[180px] block">{student.email}</span>
                              </div>
                            </TableCell>
                            <TableCell className="p-3 text-center">
                              <Badge variant={student.averageScore >= 80 ? 'success' : student.averageScore >= 60 ? 'secondary' : 'destructive'} className="font-mono text-xs font-extrabold">
                                {student.averageScore}%
                              </Badge>
                            </TableCell>
                            <TableCell className="p-3 text-center font-mono font-bold text-xs text-foreground">
                              {student.testsAttempted}
                            </TableCell>
                            <TableCell className="p-3">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Active
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Right Column: Performance & Weak Areas (takes 5 columns) */}
              <div className="lg:col-span-5 space-y-5">
                {/* Score Stats card preview */}
                <div className="bg-muted/10 border border-border p-4 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">Average Performance Mean</span>
                    <span className="text-3xl font-black text-foreground tracking-tight font-mono">
                      {selectedBatch.avgPerformance}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-primary/5 text-primary">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>

                {/* Recent test lists */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                    Classroom Mock Tests Run
                  </h4>
                  
                  <div className="space-y-2.5">
                    {initialTestAttempts.length === 0 ? (
                      <div className="p-4 rounded-lg bg-muted/20 border border-dashed border-border text-center text-xs text-muted-foreground">
                        No tests attempt data available yet.
                      </div>
                    ) : (
                      initialTestAttempts.slice(0, 3).map((attempt, index) => (
                        <div key={index} className="p-3 rounded-xl border border-border bg-card hover:bg-muted/10 transition-colors flex items-center justify-between gap-2.5">
                          <div className="space-y-1 min-w-0 flex-1">
                            <span className="text-[11px] font-extrabold text-foreground leading-snug truncate block">
                              {attempt.testTitle}
                            </span>
                            <span className="text-[9px] text-muted-foreground font-mono flex items-center gap-1.5 uppercase font-bold">
                              <span>Submitted: {attempt.submittedAt}</span>
                              <span>•</span>
                              <span>Max Marks: {attempt.maxScore}</span>
                            </span>
                          </div>
                          
                          <div className="text-right shrink-0">
                            <span className="text-xs font-mono font-black text-foreground">{attempt.score}/{attempt.maxScore}</span>
                            <span className="text-[8px] text-muted-foreground block font-bold uppercase mt-0.5">Score index</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Batch wise Weak Areas highlighting our core USP */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-destructive flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                    Detected Topics At Risk
                  </h4>

                  <div className="p-3 rounded-xl bg-destructive/[0.04] border border-destructive/20 space-y-3">
                    <p className="text-[11px] text-muted-foreground leading-normal">
                      The diagnostic engine identified the following weak concepts based on student error logs:
                    </p>

                    <div className="space-y-2">
                      {selectedBatch.courseName.includes('CCC') ? (
                        <>
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-foreground">LibreOffice Writer Alignment Margins</span>
                            <Badge variant="destructive" className="font-mono text-[9px]">34% Accuracy</Badge>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-foreground">Windows Control Panel Administration</span>
                            <Badge variant="destructive" className="font-mono text-[9px]">41% Accuracy</Badge>
                          </div>
                        </>
                      ) : selectedBatch.courseName.includes('DCA') ? (
                        <>
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-foreground">Excel VLOOKUP & Nested IF Statements</span>
                            <Badge variant="destructive" className="font-mono text-[9px]">38% Accuracy</Badge>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-foreground">MS Access Primary Keys Setup</span>
                            <Badge variant="destructive" className="font-mono text-[9px]">45% Accuracy</Badge>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-foreground">Python Condition Operators and Loops</span>
                            <Badge variant="destructive" className="font-mono text-[9px]">40% Accuracy</Badge>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-foreground">Internet TCP/IP Network Port Configs</span>
                            <Badge variant="destructive" className="font-mono text-[9px]">48% Accuracy</Badge>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Footer tools inside Detail modal */}
            <div className="flex justify-between items-center border-t border-border pt-4 mt-6">
              <span className="text-[10px] text-muted-foreground font-mono uppercase">
                ID Reference: {selectedBatch.id}
              </span>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 text-xs font-black rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Close Drawer Context
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW BATCH MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Training Batch"
        description="Allocate schedules, sync NIELIT course criteria, and register a new batch."
      >
        <form onSubmit={handleCreateBatch} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground block">Batch Custom Title *</label>
            <Input
              required
              placeholder="e.g. CCC Morning Batch C"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Coaching Stream Course</label>
              <Select
                value={formCourse}
                onChange={(e) => setFormCourse(e.target.value)}
              >
                <option value="CCC Certification">CCC Course</option>
                <option value="DCA Diploma">DCA Diploma</option>
                <option value="ADCA Diploma">ADCA Diploma</option>
                <option value="O Level IT">O Level IT</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Capacity limit (Students)</label>
              <Select
                value={formStudentCount}
                onChange={(e) => setFormStudentCount(e.target.value)}
              >
                <option value="25">Small (25 Candidates)</option>
                <option value="50">Medium (50 Candidates)</option>
                <option value="100">Standard (100 Candidates)</option>
                <option value="150">Large (150 Candidates)</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground block">Schedule timings & Hours *</label>
            <Input
              required
              placeholder="e.g. Mon, Wed, Fri 10AM - 12PM"
              value={formSchedule}
              onChange={(e) => setFormSchedule(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Target Exam Date *</label>
              <Input
                type="date"
                required
                value={formExamDate}
                onChange={(e) => setFormExamDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Starting Avg Score (%)</label>
              <Input
                type="number"
                min="30"
                max="100"
                value={formAvgScore}
                onChange={(e) => setFormAvgScore(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:bg-muted/90 cursor-pointer"
            >
              Discard Form
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-black rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer shadow-sm active:scale-95"
            >
              Confirm Registration
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT BATCH MODAL */}
      {selectedBatch && isEditOpen && (
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Update Batch Parameters"
          description={`Modify settings and track scheduled timelines for ${selectedBatch.name}.`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Batch Custom Title *</label>
              <Input
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Course Stream</label>
                <Select
                  value={formCourse}
                  onChange={(e) => setFormCourse(e.target.value)}
                >
                  <option value="CCC Certification">CCC Course</option>
                  <option value="DCA Diploma">DCA Diploma</option>
                  <option value="ADCA Diploma">ADCA Diploma</option>
                  <option value="O Level IT">O Level IT</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Student Intake Capacity</label>
                <Select
                  value={formStudentCount}
                  onChange={(e) => setFormStudentCount(e.target.value)}
                >
                  <option value="25">Small (25)</option>
                  <option value="50">Medium (50)</option>
                  <option value="100">Standard (100)</option>
                  <option value="120">Large (120)</option>
                  <option value="150">Max (150)</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Timings & Hours *</label>
              <Input
                required
                value={formSchedule}
                onChange={(e) => setFormSchedule(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Scheduled Exam Date</label>
                <Input
                  type="date"
                  required
                  value={formExamDate}
                  onChange={(e) => setFormExamDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Avg Performance (%)</label>
                <Input
                  type="number"
                  min="20"
                  max="100"
                  value={formAvgScore}
                  onChange={(e) => setFormAvgScore(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:bg-muted/90 cursor-pointer"
              >
                Cancel Changes
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-black rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer shadow-sm active:scale-95"
              >
                Save Settings
              </button>
            </div>
          </form>
        </Modal>
      )}

    </PageContainer>
  );
}
