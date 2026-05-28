import * as React from 'react';
import { 
  Plus, 
  Search, 
  Trash, 
  Edit, 
  X, 
  FileText, 
  CheckCircle, 
  Eye, 
  BookOpen, 
  Clock, 
  Percent, 
  Users, 
  Grid, 
  Check, 
  Copy, 
  AlertCircle,
  MoreVertical,
  Calendar,
  Lock,
  ArrowRight,
  UserCheck,
  TrendingUp,
  Award,
  Play
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
  Textarea,
  PageContainer,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  EmptyState,
  Breadcrumbs,
  Button,
  Label
} from '../../components/ui/CustomComponents';
import { initialBatches, initialStudents, initialTestAttempts } from '../../data';
import OwnerTestDetail from './OwnerTestDetail';

interface ExtendedTest {
  id: string;
  title: string;
  type: 'Benchmark' | 'Practice Quiz' | 'Unit Check' | 'Term Exam';
  durationMinutes: number;
  batchId: string;
  batchName: string;
  questionCount: number;
  totalMarks: number;
  status: 'active' | 'draft' | 'closed';
  description: string;
  createdDate: string;
  attemptCount: number;
  totalSeats: number;
}

// Simulated initial dataset for extended mock tests with diverse fields
const initialExtendedTests: ExtendedTest[] = [
  {
    id: 'test-1',
    title: 'CCC Computer Fundamentals & Windows Mock Test',
    type: 'Benchmark',
    durationMinutes: 45,
    batchId: 'batch-1',
    batchName: 'CCC Morning Batch A',
    questionCount: 5,
    totalMarks: 100,
    status: 'active',
    description: 'A benchmark computer literacy exam evaluating Windows operations, files, folders management, and elementary shortcuts.',
    createdDate: '2026-05-18',
    attemptCount: 88,
    totalSeats: 120
  },
  {
    id: 'test-2',
    title: 'DCA Word Formatting & Excel Formula Drill',
    type: 'Practice Quiz',
    durationMinutes: 30,
    batchId: 'batch-2',
    batchName: 'DCA Regular Batch B',
    questionCount: 4,
    totalMarks: 80,
    status: 'active',
    description: 'Practical simulation check for daily office tasks: creating summaries, editing columns, sorting rows, and employing basic formulas.',
    createdDate: '2026-05-22',
    attemptCount: 65,
    totalSeats: 95
  },
  {
    id: 'test-3',
    title: 'ADCA Advanced Excel Formulas & Database Basics',
    type: 'Unit Check',
    durationMinutes: 90,
    batchId: 'batch-3',
    batchName: 'ADCA Evening Advanced',
    questionCount: 5,
    totalMarks: 100,
    status: 'draft',
    description: 'Comprehensive assessment detailing nested spreadsheet queries, structured indexes, database keys, and relational fields.',
    createdDate: '2026-05-26',
    attemptCount: 0,
    totalSeats: 150
  },
  {
    id: 'test-4',
    title: 'Networking Protocols & O Level HTML Intro',
    type: 'Term Exam',
    durationMinutes: 60,
    batchId: 'batch-4',
    batchName: 'O Level Programming Cohort',
    questionCount: 10,
    totalMarks: 150,
    status: 'closed',
    description: 'Rigorous terminal evaluation covering web layout specifications, network components, IP topologies, and simple HTML syntax structures.',
    createdDate: '2026-05-12',
    attemptCount: 45,
    totalSeats: 45
  }
];

interface OwnerTestsProps {
  onNavigate: (path: string) => void;
  subView?: 'list' | 'create' | 'detail';
  testIdParam?: string;
}

export default function OwnerTests({ onNavigate, subView = 'list', testIdParam }: OwnerTestsProps) {
  // Main state holding extended mock tests
  const [tests, setTests] = React.useState<ExtendedTest[]>(() => {
    const saved = localStorage.getItem('resultbooster_tests');
    return saved ? JSON.parse(saved) : initialExtendedTests;
  });

  // Save tests whenever updated
  React.useEffect(() => {
    localStorage.setItem('resultbooster_tests', JSON.stringify(tests));
  }, [tests]);

  // UI state for filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All');
  const [batchFilter, setBatchFilter] = React.useState('All');
  const [activeTab, setActiveTab] = React.useState<'all' | 'active' | 'draft' | 'closed'>('all');

  // Popup overlay ID for Row Dropdown menu
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  // Modals controller states
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState<ExtendedTest | null>(null);

  // Toast feedback state
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  // Dynamic status-matching background arrays
  const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20',
    draft: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20',
    closed: 'bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 border-slate-500/20'
  };

  // Form states for creating or editing test instances
  const [formTitle, setFormTitle] = React.useState('');
  const [formType, setFormType] = React.useState<'Benchmark' | 'Practice Quiz' | 'Unit Check' | 'Term Exam'>('Benchmark');
  const [formBatchId, setFormBatchId] = React.useState(initialBatches[0]?.id || 'batch-1');
  const [formDuration, setFormDuration] = React.useState('45');
  const [formQuestionCount, setFormQuestionCount] = React.useState('5');
  const [formTotalMarks, setFormTotalMarks] = React.useState('100');
  const [formDescription, setFormDescription] = React.useState('');
  const [formStatus, setFormStatus] = React.useState<'active' | 'draft' | 'closed'>('active');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // 1. Calculations for Dashboard Stats Widget
  const stats = React.useMemo(() => {
    const total = tests.length;
    const active = tests.filter(t => t.status === 'active').length;
    
    // Uncompleted attempts of active exams = sum(totalSeats - attemptCount) for active mock papers
    const activeTestsList = tests.filter(t => t.status === 'active');
    const pending = activeTestsList.reduce((acc, t) => acc + Math.max(0, t.totalSeats - t.attemptCount), 0);

    // Weighted average completion percentage across all published/closed assessments
    const finishedTests = tests.filter(t => t.totalSeats > 0);
    const avgPct = finishedTests.length > 0 
      ? Math.round(finishedTests.reduce((acc, t) => acc + (t.attemptCount / t.totalSeats * 100), 0) / finishedTests.length) 
      : 0;

    return {
      total,
      active,
      pending,
      avgPct
    };
  }, [tests]);

  // Combined filters applied to computed list
  const filteredTests = React.useMemo(() => {
    return tests.filter(test => {
      const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            test.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            test.batchName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBatch = batchFilter === 'All' || test.batchId === batchFilter;
      
      // Filter tab can override select filter, or vice versa
      const currentStatusMatch = statusFilter === 'All' ? true : test.status === statusFilter;
      const activeTabMatch = activeTab === 'all' ? true : test.status === activeTab;

      return matchesSearch && matchesBatch && currentStatusMatch && activeTabMatch;
    });
  }, [tests, searchQuery, statusFilter, batchFilter, activeTab]);

  // Action Methods
  const handleOpenAddModal = () => {
    setFormTitle('');
    setFormType('Benchmark');
    setFormBatchId(initialBatches[0]?.id || 'batch-1');
    setFormDuration('45');
    setFormQuestionCount('5');
    setFormTotalMarks('100');
    setFormDescription('');
    setFormStatus('active');
    setIsAddOpen(true);
  };

  const handleCreateTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      triggerToast('Error: Test title is required.');
      return;
    }

    const matchedBatch = initialBatches.find(b => b.id === formBatchId);

    const newTest: ExtendedTest = {
      id: `test-${Date.now()}`,
      title: formTitle,
      type: formType,
      durationMinutes: Number(formDuration) || 45,
      batchId: formBatchId,
      batchName: matchedBatch ? matchedBatch.name : 'All Batches',
      questionCount: Number(formQuestionCount) || 5,
      totalMarks: Number(formTotalMarks) || 100,
      status: formStatus,
      description: formDescription || 'Benchmark worksheet tracking test rules.',
      createdDate: new Date().toISOString().split('T')[0],
      attemptCount: 0,
      totalSeats: matchedBatch ? matchedBatch.studentCount : 50
    };

    setTests([newTest, ...tests]);
    setIsAddOpen(false);
    triggerToast(`✨ "${newTest.title}" published successfully as ${newTest.status.toUpperCase()}!`);
  };

  const handleOpenEditModal = (test: ExtendedTest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedTest(test);
    setFormTitle(test.title);
    setFormType(test.type);
    setFormBatchId(test.batchId);
    setFormDuration(String(test.durationMinutes));
    setFormQuestionCount(String(test.questionCount));
    setFormTotalMarks(String(test.totalMarks));
    setFormDescription(test.description);
    setFormStatus(test.status);
    
    setOpenMenuId(null);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTest) return;

    const matchedBatch = initialBatches.find(b => b.id === formBatchId);

    setTests(tests.map(t => {
      if (t.id === selectedTest.id) {
        return {
          ...t,
          title: formTitle,
          type: formType,
          batchId: formBatchId,
          batchName: matchedBatch ? matchedBatch.name : t.batchName,
          durationMinutes: Number(formDuration),
          questionCount: Number(formQuestionCount),
          totalMarks: Number(formTotalMarks),
          description: formDescription,
          status: formStatus,
          totalSeats: matchedBatch ? matchedBatch.studentCount : t.totalSeats
        };
      }
      return t;
    }));

    setIsEditOpen(false);
    setSelectedTest(null);
    triggerToast('✅ Mock test settings updated in local state.');
  };

  const handleDuplicateTest = (test: ExtendedTest, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const duplicated: ExtendedTest = {
      ...test,
      id: `test-dup-${Date.now()}`,
      title: `Copy of ${test.title}`,
      status: 'draft',
      attemptCount: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setTests([duplicated, ...tests]);
    setOpenMenuId(null);
    triggerToast(`📋 Duplicated "${test.title}" into draft.`);
  };

  const handleCloseTest = (testId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTests(tests.map(t => {
      if (t.id === testId) {
        return { ...t, status: 'closed' as const };
      }
      return t;
    }));
    setOpenMenuId(null);
    triggerToast('🔒 Mock test closed. Interactive attempts are frozen.');
  };

  const handleDeleteTest = (testId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this mock test from the institute archive? All student scores in-memory will be disconnected.')) {
      setTests(tests.filter(t => t.id !== testId));
      setOpenMenuId(null);
      triggerToast('🗑️ Mock test record permanently archived.');
    }
  };

  // Detail view lookups
  const activeTestDetail = tests.find(t => t.id === testIdParam);
  const attemptsOnTest = activeTestDetail ? initialTestAttempts.filter(att => att.testId === activeTestDetail.id) : [];

  return (
    <PageContainer>
      {/* Dynamic Toast popup notifications */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 p-4 bg-foreground text-background dark:bg-card dark:text-foreground border border-border rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-5 font-medium transition-all">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
          <span className="text-xs">{toastMsg}</span>
        </div>
      )}

      {/* Evaluation Hub Breadcrumbs */}
      <div className="mb-2">
        <Breadcrumbs
          items={[
            { label: 'Evaluation Hub', onClick: () => onNavigate('/owner/tests') },
            ...(subView === 'detail' ? [{ label: activeTestDetail?.title || 'Mock Test Detail' }] : []),
            ...(subView === 'create' ? [{ label: 'Create Test Form' }] : []),
          ]}
        />
      </div>

      {subView === 'list' && (
        <div className="space-y-6">
          {/* Top Section */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2.5 bg-primary/10 text-primary font-mono text-[9px] uppercase font-black rounded-md tracking-wider">
                  Test Controller Panel
                </span>
                <span className="text-xs text-muted-foreground font-mono">Exam Engine Live</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Mock Tests List
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl">
                Create practice sessions, schedule major diagnostic mock papers, analyze student attempt rates, and control test states for all batch cohorts.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('/owner/tests/create')}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Plus className="h-4 w-4 stroke-[3]" />
                Create Mock Test
              </button>
            </div>
          </div>

          {/* Core Dashboard Summary Cards Container */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Card 1: Total Tests */}
            <Card className="hover:border-border/100 transition-all border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
                  Total Tests Created
                </CardTitle>
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <FileText className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black tracking-tight text-foreground">
                  {stats.total}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                  System repository benchmark count
                </p>
              </CardContent>
            </Card>

            {/* Card 2: Active Tests */}
            <Card className="hover:border-border/100 transition-all border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">
                  Active Tests
                </CardTitle>
                <div className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-600">
                  <Play className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black tracking-tight text-foreground">
                  {stats.active}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 font-mono text-emerald-600">
                  Accepting online submissions
                </p>
              </CardContent>
            </Card>

            {/* Card 3: Pending Attempts */}
            <Card className="hover:border-border/100 transition-all border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest font-mono">
                  Pending Attempts
                </CardTitle>
                <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-600 animate-pulse">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black tracking-tight text-foreground">
                  {stats.pending} <span className="text-xs font-semibold text-muted-foreground">students</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                  Incomplete seats in active cohorts
                </p>
              </CardContent>
            </Card>

            {/* Card 4: Average Completion % */}
            <Card className="hover:border-border/100 transition-all border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest font-mono">
                  Average Completion %
                </CardTitle>
                <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-600">
                  <Percent className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black tracking-tight text-foreground flex items-baseline gap-1">
                  {stats.avgPct}%
                  <TrendingUp className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                  Participation rate over semesters
                </p>
              </CardContent>
            </Card>

          </div>

          {/* Dynamic Search & Actions Toolbar */}
          <div className="space-y-4 bg-muted/20 p-4 rounded-xl border border-border/80">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-12">
              
              {/* Keyword text search input */}
              <div className="relative md:col-span-5">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
                <Input
                  type="text"
                  placeholder="Search test names, types or batches..."
                  className="pl-9 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Batch Filter selector */}
              <div className="md:col-span-3">
                <Select
                  className="text-xs font-semibold"
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                >
                  <option value="All">All Student Batches</option>
                  {initialBatches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </Select>
              </div>

              {/* Status Filter selector */}
              <div className="md:col-span-3">
                <Select
                  className="text-xs font-semibold"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All States (Draft, Active, Closed)</option>
                  <option value="active">Active Only</option>
                  <option value="draft">Drafts Only</option>
                  <option value="closed">Closed Only</option>
                </Select>
              </div>

              {/* Reset button */}
              <div className="md:col-span-1">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All');
                    setBatchFilter('All');
                    setActiveTab('all');
                    triggerToast('All test archive filters cleared.');
                  }}
                  className="w-full h-10 px-3 bg-card border border-border hover:bg-muted text-foreground transition-all rounded-lg text-xs font-bold cursor-pointer"
                >
                  Reset
                </button>
              </div>

            </div>

            {/* Interactive Tabs Layout Row matching Shadcn aesthetic */}
            <div className="border-t border-border/40 pt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'all' 
                      ? 'bg-background text-foreground shadow-xs' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All Assessments ({tests.length})
                </button>
                <button
                  onClick={() => setActiveTab('active')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'active' 
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-extrabold shadow-none' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Active ({tests.filter(t => t.status === 'active').length})
                </button>
                <button
                  onClick={() => setActiveTab('draft')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'draft' 
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-extrabold shadow-none' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Drafts ({tests.filter(t => t.status === 'draft').length})
                </button>
                <button
                  onClick={() => setActiveTab('closed')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'closed' 
                      ? 'bg-slate-500/10 text-slate-700 dark:text-slate-400 font-extrabold shadow-none' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Closed ({tests.filter(t => t.status === 'closed').length})
                </button>
              </div>

              <div className="font-mono text-[11px] text-muted-foreground flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Query returned {filteredTests.length} mock tests
              </div>
            </div>

          </div>

          {/* Test Table List Container */}
          {filteredTests.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No mock tests fit your filter variables"
              description="Write a different database query, check spelling or create your first mock exam layout today!"
              actionLabel="Add Mock Test"
              onAction={() => onNavigate('/owner/tests/create')}
            />
          ) : (
            <div className="border border-border/80 rounded-2xl overflow-hidden bg-card shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-[11px] font-mono py-3.5 pl-5">Test Name</TableHead>
                    <TableHead className="text-[11px] font-mono py-3.5">Type</TableHead>
                    <TableHead className="text-[11px] font-mono py-3.5">Batch Name</TableHead>
                    <TableHead className="text-[11px] font-mono py-3.5 text-center">Questions</TableHead>
                    <TableHead className="text-[11px] font-mono py-3.5 text-center">Time Limit</TableHead>
                    <TableHead className="text-[11px] font-mono py-3.5 text-center">Status</TableHead>
                    <TableHead className="text-[11px] font-mono py-3.5">Attempt Progress (Class Cohort)</TableHead>
                    <TableHead className="text-[11px] font-mono py-3.5">Created</TableHead>
                    <TableHead className="text text-[11px] font-mono text-right pr-5">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.map((test) => {
                    const progressPercent = test.totalSeats > 0 
                      ? Math.round((test.attemptCount / test.totalSeats) * 100) 
                      : 0;

                    // Progress bar color based on completion rate
                    let barColor = 'bg-primary';
                    if (progressPercent >= 100) barColor = 'bg-emerald-500';
                    else if (progressPercent > 50) barColor = 'bg-indigo-500';
                    else if (progressPercent > 0) barColor = 'bg-amber-500';
                    else barColor = 'bg-slate-300 dark:bg-slate-800';

                    return (
                      <TableRow 
                        key={test.id}
                        onClick={() => onNavigate(`/owner/tests/${test.id}`)}
                        className="group hover:bg-muted/40 transition-all cursor-pointer"
                      >
                        {/* Column 1: Test Name & Desc */}
                        <TableCell className="p-4 pl-5 max-w-sm">
                          <div className="space-y-1">
                            <span className="font-extrabold text-xs text-foreground group-hover:text-primary transition-colors block line-clamp-1 leading-normal">
                              {test.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground line-clamp-1 block">
                              {test.description}
                            </span>
                          </div>
                        </TableCell>

                        {/* Column 2: Test Type */}
                        <TableCell className="p-4">
                          <Badge variant="outline" className="font-mono text-[9px] font-black uppercase tracking-wide">
                            {test.type}
                          </Badge>
                        </TableCell>

                        {/* Column 3: Mapped Batch */}
                        <TableCell className="p-4 text-xs font-bold text-foreground">
                          {test.batchName}
                        </TableCell>

                        {/* Column 4: Questions Count */}
                        <TableCell className="p-4 text-center font-mono font-bold text-xs">
                          {test.questionCount} MCQs
                        </TableCell>

                        {/* Column 5: Time Limit */}
                        <TableCell className="p-4 text-center font-mono text-xs text-muted-foreground">
                          <div className="inline-flex items-center gap-1 bg-muted/30 p-1 px-2 rounded-md border border-border/40 font-bold text-foreground">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {test.durationMinutes} mins
                          </div>
                        </TableCell>

                        {/* Column 6: Status Tag */}
                        <TableCell className="p-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] uppercase tracking-wider font-extrabold ${statusColors[test.status]}`}>
                            {test.status}
                          </span>
                        </TableCell>

                        {/* Column 7: Attempt Progress Bar */}
                        <TableCell className="p-4 min-w-[160px]">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="font-extrabold text-foreground">
                                {test.attemptCount} / {test.totalSeats} seats
                              </span>
                              <span className="text-muted-foreground">{progressPercent}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden border border-border/20">
                              <div 
                                className={`${barColor} h-full transition-all duration-500`}
                                style={{ width: `${Math.min(100, progressPercent)}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>

                        {/* Column 8: Date Created */}
                        <TableCell className="p-4 text-xs font-mono text-muted-foreground">
                          {test.createdDate}
                        </TableCell>

                        {/* Column 9: Dropdown Choices Menu */}
                        <TableCell className="p-4 text-right pr-5" onClick={(e) => e.stopPropagation()}>
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={() => setOpenMenuId(openMenuId === test.id ? null : test.id)}
                              className="p-1 px-2 hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border rounded-md transition-all cursor-pointer"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            {openMenuId === test.id && (
                              <>
                                {/* Click-outside closer portal wrapper */}
                                <div 
                                  className="fixed inset-0 z-30" 
                                  onClick={() => setOpenMenuId(null)} 
                                />
                                
                                <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-lg py-1.5 z-40 animate-in fade-in slide-in-from-top-1 text-left">
                                  
                                  <button
                                    onClick={() => {
                                      onNavigate(`/owner/tests/${test.id}`);
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full px-3.5 py-2 text-xs hover:bg-muted text-foreground flex items-center gap-2 transition-all font-semibold"
                                  >
                                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                    View Details
                                  </button>

                                  <button
                                    onClick={() => handleOpenEditModal(test)}
                                    className="w-full px-3.5 py-2 text-xs hover:bg-muted text-foreground flex items-center gap-2 transition-all font-semibold"
                                  >
                                    <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                                    Edit Test
                                  </button>

                                  <button
                                    onClick={(e) => handleDuplicateTest(test, e)}
                                    className="w-full px-3.5 py-2 text-xs hover:bg-muted text-foreground flex items-center gap-2 transition-all font-semibold"
                                  >
                                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                    Duplicate
                                  </button>

                                  {test.status === 'active' && (
                                    <button
                                      onClick={(e) => handleCloseTest(test.id, e)}
                                      className="w-full px-3.5 py-2 text-xs hover:bg-muted text-amber-600 flex items-center gap-2 transition-all font-semibold"
                                    >
                                      <Lock className="h-3.5 w-3.5 text-amber-500" />
                                      Close Test
                                    </button>
                                  )}

                                  <div className="border-t border-border/60 my-1" />

                                  <button
                                    onClick={(e) => handleDeleteTest(test.id, e)}
                                    className="w-full px-3.5 py-2 text-xs hover:bg-destructive/10 text-destructive flex items-center gap-2 transition-all font-bold"
                                  >
                                    <Trash className="h-3.5 w-3.5 shrink-0" />
                                    Delete Archive
                                  </button>

                                </div>
                              </>
                            )}
                          </div>
                        </TableCell>

                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

        </div>
      )}

      {/* CREATE SUBVIEW: Dedicated Test Creation Page Area */}
      {subView === 'create' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="space-y-1 border-b border-border/60 pb-4">
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              Create Mock Assessment
            </h1>
            <p className="text-xs text-muted-foreground">
              Define question variables, link test timers, and bind grading standards inside a class.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleCreateTestSubmit} className="space-y-4">
                
                <div className="space-y-1.5">
                  <Label>Mock Paper Title *</Label>
                  <Input 
                    required 
                    placeholder="e.g. LibreOffice Writer Shortcuts Master Diagnostics" 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Assessment Type</Label>
                    <Select 
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                    >
                      <option value="Benchmark">Benchmark Test</option>
                      <option value="Practice Quiz">Practice Quiz</option>
                      <option value="Unit Check">Unit Check</option>
                      <option value="Term Exam">Term Exam</option>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Allocate Cohort Batch</Label>
                    <Select 
                      value={formBatchId}
                      onChange={(e) => setFormBatchId(e.target.value)}
                    >
                      {initialBatches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label>Duration (Mins)</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      value={formDuration}
                      onChange={(e) => setFormDuration(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Question Count</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      value={formQuestionCount}
                      onChange={(e) => setFormQuestionCount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Total Marks</Label>
                    <Input 
                      type="number" 
                      min={1} 
                      value={formTotalMarks}
                      onChange={(e) => setFormTotalMarks(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Test Instructions & Scope</Label>
                  <Textarea 
                    placeholder="Describe exam coverage rules, negative grading variables etc."
                    rows={4}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border">
                  <Label>Default Blueprint Status</Label>
                  <Select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                  >
                    <option value="active">Active (Open for student attempts immediately)</option>
                    <option value="draft">Draft (Do not list yet)</option>
                  </Select>
                </div>

                <div className="flex justify-end gap-2.5 pt-4">
                  <button
                    type="button"
                    onClick={() => onNavigate('/owner/tests')}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-all cursor-pointer"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-black rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer"
                  >
                    Publish to Cohort
                  </button>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* DETAIL COLUMN ROUTE SWAPPER */}
      {subView === 'detail' && (
        <OwnerTestDetail 
          testId={testIdParam || ''} 
          onNavigate={onNavigate} 
        />
      )}

      {/* CREATE MODAL LAYOUT */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Compose Central Mock Test"
        description="Fill in subject streams, target timings, and publication targets."
      >
        <form onSubmit={handleCreateTestSubmit} className="space-y-4 pt-1">
          
          <div className="space-y-1.5">
            <Label>Mock Assessment Title *</Label>
            <Input 
              required 
              placeholder="e.g. MS Office Suite & LibreOffice Fundamentals Session" 
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Assessment Type</Label>
              <Select 
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
              >
                <option value="Benchmark">Benchmark Test</option>
                <option value="Practice Quiz">Practice Quiz</option>
                <option value="Unit Check">Unit Check</option>
                <option value="Term Exam">Term Exam</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Cohort Batch Target</Label>
              <Select 
                value={formBatchId}
                onChange={(e) => setFormBatchId(e.target.value)}
              >
                {initialBatches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Duration (Mins)</Label>
              <Input 
                type="number" 
                min={1} 
                value={formDuration}
                onChange={(e) => setFormDuration(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>MCQ Count</Label>
              <Input 
                type="number" 
                min={1} 
                value={formQuestionCount}
                onChange={(e) => setFormQuestionCount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Max Points</Label>
              <Input 
                type="number" 
                min={1} 
                value={formTotalMarks}
                onChange={(e) => setFormTotalMarks(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Instructions & Scope Outlines</Label>
            <Textarea 
              rows={3}
              placeholder="Provide exam criteria rules, negative marks info etc."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Release State</Label>
            <Select
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as any)}
            >
              <option value="active">Active (Available for students instantly)</option>
              <option value="draft">Draft State</option>
              <option value="closed">Closed State</option>
            </Select>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-border/65">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-all cursor-pointer"
            >
              Discard Form
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-black rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              Confirm Publication
            </button>
          </div>

        </form>
      </Modal>

      {/* EDIT MODAL LAYOUT */}
      {selectedTest && isEditOpen && (
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Update Mock Test Parameters"
          description={`Modify configurations and settings parameters for test record ${selectedTest.id}.`}
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-1">
            
            <div className="space-y-1.5">
              <Label>Mock Paper Title *</Label>
              <Input 
                required 
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Assessment Type</Label>
                <Select 
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                >
                  <option value="Benchmark">Benchmark Test</option>
                  <option value="Practice Quiz">Practice Quiz</option>
                  <option value="Unit Check">Unit Check</option>
                  <option value="Term Exam">Term Exam</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Target Student Batch</Label>
                <Select 
                  value={formBatchId}
                  onChange={(e) => setFormBatchId(e.target.value)}
                >
                  {initialBatches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Duration (Mins)</Label>
                <Input 
                  type="number" 
                  min={1} 
                  value={formDuration}
                  onChange={(e) => setFormDuration(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>MCQ Count</Label>
                <Input 
                  type="number" 
                  min={1} 
                  value={formQuestionCount}
                  onChange={(e) => setFormQuestionCount(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Total Weight</Label>
                <Input 
                  type="number" 
                  min={1} 
                  value={formTotalMarks}
                  onChange={(e) => setFormTotalMarks(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Description / Syllabus Scope</Label>
              <Textarea 
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Assessment Status</Label>
              <Select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
              >
                <option value="active">Active (Open for student attempt)</option>
                <option value="draft">Draft (Private state)</option>
                <option value="closed">Closed (View grades only)</option>
              </Select>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-border/65">
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedTest(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-all cursor-pointer"
              >
                Cancel Changes
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-black rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 shadow-xs transition-with cursor-pointer active:scale-95"
              >
                Save Paper Parameters
              </button>
            </div>

          </form>
        </Modal>
      )}

    </PageContainer>
  );
}
