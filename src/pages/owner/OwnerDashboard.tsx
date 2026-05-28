import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  Layers, 
  FileSpreadsheet, 
  TrendingUp, 
  Sparkles, 
  AlertTriangle, 
  Plus, 
  Compass, 
  ArrowUpRight,
  Database,
  Bell,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  Clock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Mail,
  MoreVertical,
  Activity,
  Send,
  Sliders,
  Play
} from 'lucide-react';
import { 
  StatCard, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  TableWrapper,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
  Button
} from '../../components/ui/CustomComponents';
import { initialOwnerStats, initialBatches, initialTests, initialStudents } from '../../data';
import { Student, Batch, Test } from '../../types';

// Simple custom Avatar helper
function CustomAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  
  // Choose colors deterministically based on initials for visual rhythm
  const colorSchemes = [
    'bg-primary/10 text-primary border-primary/25',
    'bg-accent text-accent-foreground border-border',
    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'bg-destructive/10 text-destructive border-destructive/20',
  ];
  const index = initials.charCodeAt(0) % colorSchemes.length;
  const schemeClass = colorSchemes[index];

  return (
    <div className={`h-8 w-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border ${schemeClass}`}>
      {initials}
    </div>
  );
}

// Simple custom interactive Dropdown menu
function CustomDropdownMenu({ 
  student, 
  onTriggerAlert, 
  onPrescribeBooster 
}: { 
  student: Student; 
  onTriggerAlert: (student: Student, type: string) => void;
  onPrescribeBooster: (student: Student) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-all cursor-pointer active:scale-95"
      >
        <span>Actions</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-border bg-card p-1 text-card-foreground shadow-md">
          <button
            type="button"
            onClick={() => {
              onPrescribeBooster(student);
              setIsOpen(false);
            }}
            className="flex w-full items-center px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-accent text-foreground text-left cursor-pointer"
          >
            Prescribe Booster Drill
          </button>
          <button
            type="button"
            onClick={() => {
              onTriggerAlert(student, 'parent_sms');
              setIsOpen(false);
            }}
            className="flex w-full items-center px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-accent text-foreground text-left cursor-pointer"
          >
            Trigger Parent SMS Alert
          </button>
          <button
            type="button"
            onClick={() => {
              onTriggerAlert(student, 'email_coord');
              setIsOpen(false);
            }}
            className="flex w-full items-center px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-accent text-foreground text-left cursor-pointer"
          >
            E-mail Batch Coordinator
          </button>
        </div>
      )}
    </div>
  );
}

// Simple Skeleton structure for dynamic interactive refreshes
function TableSkeletonRow() {
  return (
    <TableRow className="animate-pulse">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted/40" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-muted/40 rounded" />
            <div className="h-2 w-16 bg-muted/20 rounded" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="h-3.5 w-32 bg-muted/30 rounded" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-12 bg-muted/30 rounded" />
      </TableCell>
      <TableCell>
        <div className="h-5 w-16 bg-muted/40 rounded-full" />
      </TableCell>
      <TableCell>
        <div className="h-3 w-24 bg-muted/30 rounded" />
      </TableCell>
      <TableCell className="text-right">
        <div className="h-8 w-20 bg-muted/30 rounded-lg ml-auto" />
      </TableCell>
    </TableRow>
  );
}

interface OwnerDashboardProps {
  onNavigate: (path: string) => void;
}

export default function OwnerDashboard({ onNavigate }: OwnerDashboardProps) {
  // Synchronized state
  const [studentsList, setStudentsList] = React.useState<Student[]>(initialStudents);
  const [batchesList, setBatchesList] = React.useState<Batch[]>(initialBatches);
  const [testsList, setTestsList] = React.useState<Test[]>(initialTests);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'critical' | 'all'>('critical');
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  // Custom interactive highlights and alerts simulated state
  const [recentActivities, setRecentActivities] = React.useState([
    { id: 1, type: 'quiz', text: 'Riya Sen answered CCC Computer Fundamentals Mock Test with 80% accuracy', time: '12 mins ago', icon: CheckCircle, color: 'text-emerald-500' },
    { id: 2, type: 'alert', text: 'Diagnostic Alert triggered: Ishita Patel fell below the 60% limit in MS Word Formatting Tools', time: '1 hr ago', icon: AlertTriangle, color: 'text-destructive' },
    { id: 3, type: 'test', text: 'New mock exam "DCA Word Formatting & Excel Formula Drill" deployed to DCA Regular Batch B', time: '4 hrs ago', icon: FileSpreadsheet, color: 'text-primary' },
    { id: 4, type: 'batch', text: 'Weekly evaluation reports summarized for O Level Programming Cohort', time: 'Yesterday', icon: Layers, color: 'text-foreground' }
  ]);

  const [notification, setNotification] = React.useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Simulate remote synchronization
  const handleSyncDatabase = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showNotification('Successfully synchronized diagnostic pipelines with multi-tenant regional database!');
    }, 1200);
  };

  // Quick simulated action: Broadcast warnings to parents
  const handleBroadcastWarnings = () => {
    const atRiskCount = studentsList.filter(s => s.averageScore < 60).length;
    showNotification(`Dispatched urgent remedial SMS and WhatsApp reports to parents of ${atRiskCount} at-risk students!`);
  };

  // Dropdown triggered action
  const handleDropdownTriggerAlert = (student: Student, type: string) => {
    if (type === 'parent_sms') {
      showNotification(`Urgent SMS recommendation dispatched to parents of ${student.name}. Topic Focus: ${student.weakSubjects[0] || 'Unassigned subject'}`);
    } else {
      showNotification(`E-mail brief sent to ${student.batchName} Coordinator for local offline remedial sessions for ${student.name}.`);
    }
  };

  const handlePrescribeBooster = (student: Student) => {
    showNotification(`Remedial booster homework packet generated and scheduled for ${student.name} in batch ${student.batchName}`);
    // Simulate updating real activities
    const newAct = {
      id: Date.now(),
      type: 'booster',
      text: `Remedial Revision prescribed to ${student.name} targeting weak spots: ${student.weakSubjects.join(', ')}`,
      time: 'Just now',
      icon: Compass,
      color: 'text-primary'
    };
    setRecentActivities(prev => [newAct, ...prev]);
  };

  // Quickly publish upcoming test from fourth section
  const handlePublishUpcomingTest = (testId: string) => {
    setTestsList(prev => 
      prev.map(t => t.id === testId ? { ...t, status: 'active' } : t)
    );
    const test = testsList.find(t => t.id === testId);
    showNotification(`Benchmark Assessment "${test?.title || 'Draft Assessment'}" has been changed to ACTIVE status.`);
  };

  // Search logic and filtering students
  const filteredStudents = studentsList.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.batchName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'critical') {
      return matchesSearch && student.averageScore < 60;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in pb-12 font-sans">
      
      {/* Central Flash Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 p-4 max-w-sm rounded-xl border border-primary/20 bg-card text-foreground shadow-lg flex items-start gap-3 animate-slide-in">
          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
            <Sparkles className="h-3 w-3" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-black block">Central Command Broadcast</span>
            <p className="text-[11px] text-muted-foreground leading-normal">{notification}</p>
          </div>
        </div>
      )}

      {/* SECTION 1: Page Header and Quick Actions Banner */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-5">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Sliders className="h-7 w-7 text-primary shrink-0" />
            Institute Command Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
            Welcome back, <strong className="text-foreground">Institute Owner</strong>. You are currently tracking <span className="text-foreground font-semibold">{batchesList.length} active computer training batches</span> and mock tests benchmarked against standard NIELIT exam criteria.
          </p>
        </div>

        {/* Quick actions triggers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSyncDatabase}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-border bg-card hover:bg-accent text-foreground text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-50"
            title="Force synchronization with global database index"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            Sync Database
          </button>

          <button
            type="button"
            onClick={handleBroadcastWarnings}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 text-destructive text-xs font-bold rounded-lg transition-all cursor-pointer"
          >
            <Bell className="h-3.5 w-3.5" />
            Broadcast Remedial Alerts
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/owner/tests/create')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-extrabold rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Create Benchmark Test
          </button>
        </div>
      </div>

      {/* SECTION 2: Dynamic Stat Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Students */}
        <Card className="border border-border shadow-xs hover:border-border/100 transition-all select-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Active Candidates</CardTitle>
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-black text-foreground">{initialOwnerStats.totalActiveStudents.toLocaleString()}</div>
            <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{initialOwnerStats.studentsGrowth}%</span>
              <span>trimester-over-trimester escalation</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Active Batches */}
        <Card className="border border-border shadow-xs hover:border-border/100 transition-all select-none opacity-95">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Managed Classroom Batches</CardTitle>
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Layers className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-black text-foreground">{initialOwnerStats.totalBatches}</div>
            <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{initialOwnerStats.batchesGrowth}%</span>
              <span>training cohorts configured</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Tests Conducted */}
        <Card className="border border-border shadow-xs hover:border-border/100 transition-all select-none opacity-95">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Benchmark Tests Conducted</CardTitle>
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-black text-foreground">{initialOwnerStats.totalTestsCreated}</div>
            <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{initialOwnerStats.testsGrowth}%</span>
              <span>exams mapped to micro subjects</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 4: At-Risk Students */}
        <Card className="border border-destructive/20 bg-destructive/5 shadow-xs transition-style select-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <CardTitle className="text-xs font-bold text-destructive uppercase tracking-wider">At-Risk Candidates</CardTitle>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-black text-destructive">
              {studentsList.filter(s => s.averageScore < 60).length}
            </div>
            <p className="text-[11px] text-destructive/80 font-medium mt-1.5">
              Accuracy under the 60% mastery limit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 3: Batch-wise average performance cards */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-foreground">Cohort Performance Matrix</h2>
            <p className="text-xs text-muted-foreground">Classroom stream analytics and their average scoring indices</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/owner/batches')}
            className="text-xs hover:underline text-primary font-semibold flex items-center gap-1 cursor-pointer"
          >
            Manage Streams <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {batchesList.map((batch) => {
            // Calculate a status based on average performance score
            const isHighMastery = batch.avgPerformance >= 85;
            const isMediumMastery = batch.avgPerformance >= 75 && batch.avgPerformance < 85;
            
            return (
              <Card key={batch.id} className="border border-border/80 hover:border-border/100 transition-all">
                <CardHeader className="p-4 pb-2">
                  <Badge variant="outline" className="text-[9px] uppercase font-mono font-bold leading-none w-fit">
                    {batch.schedule}
                  </Badge>
                  <CardTitle className="text-sm font-bold mt-2 text-foreground line-clamp-1 h-5">{batch.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-3">
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs text-muted-foreground">{batch.studentCount} students</span>
                    <span className="text-base font-black text-foreground font-mono">{batch.avgPerformance}%</span>
                  </div>

                  {/* Meter graph bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          isHighMastery 
                            ? 'bg-emerald-500' 
                            : isMediumMastery 
                              ? 'bg-primary' 
                              : 'bg-destructive'
                        }`}
                        style={{ width: `${batch.avgPerformance}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span>Accuracy Mean</span>
                      {isHighMastery && <span className="text-emerald-600 dark:text-emerald-400 font-bold">Strong Mastery</span>}
                      {isMediumMastery && <span className="text-primary font-bold">Passing Pace</span>}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 border-t border-border/30 bg-muted/[0.02] text-[10px] text-muted-foreground flex justify-between items-center">
                  <span>{batch.activeTestsCount} Live Benchmark Exams</span>
                  <button
                    type="button"
                    onClick={() => onNavigate('/owner/performance')}
                    className="text-primary hover:underline font-semibold cursor-pointer"
                  >
                    Details
                  </button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* COMPARATIVE DOUBLE GRID: Columns matching third and fourth / fifth sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* SECTION 4: Weak Students Preview Table & Actions Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-foreground">Diagnostics Exception Tracker</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Urgent support roster showing scores hovering under threshold</p>
            </div>

            {/* Micro Tabs switcher inside card headers */}
            <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground select-none">
              <button
                type="button"
                onClick={() => setActiveTab('critical')}
                className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'critical' 
                    ? 'bg-background text-foreground shadow-xs' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Critical Risk (Score &lt; 60%)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all' 
                    ? 'bg-background text-foreground shadow-xs' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Learners
              </button>
            </div>
          </div>

          {/* Quick search bar for students */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Search candidate index by name or batch cohort..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-border/80 rounded-lg bg-card text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Main Table Wrapper */}
          <Card className="border border-border shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Candidate</TableHead>
                    <TableHead>Class Batch</TableHead>
                    <TableHead className="text-center">Mean Accuracy</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Specific Weak Topic</TableHead>
                    <TableHead className="text-right">Action Coordinate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isRefreshing ? (
                    <>
                      <TableSkeletonRow />
                      <TableSkeletonRow />
                      <TableSkeletonRow />
                    </>
                  ) : filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        <Compass className="h-8 w-8 text-muted-foreground/45 mx-auto mb-2.5" />
                        <span className="text-xs font-semibold block text-foreground">No exception logs indexed matching metrics</span>
                        <p className="text-[10px] mt-0.5 text-muted-foreground">Adjust filters or search queries above</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => {
                      const isAtCriticalRisk = student.averageScore < 60;
                      const isAtModerateRisk = student.averageScore >= 60 && student.averageScore < 75;
                      const isAtLowRisk = student.averageScore >= 75;

                      return (
                        <TableRow key={student.id} className="hover:bg-muted/30">
                          {/* Student identity with custom initials avatar */}
                          <TableCell className="align-middle">
                            <div className="flex items-center gap-2.5">
                              <CustomAvatar name={student.name} />
                              <div>
                                <span className="font-bold text-foreground block text-xs leading-none">{student.name}</span>
                                <span className="text-[9px] text-muted-foreground font-mono font-medium block mt-1">{student.email}</span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Batch */}
                          <TableCell className="align-middle">
                            <span className="font-semibold text-foreground text-xs leading-relaxed max-w-[150px] block truncate" title={student.batchName}>
                              {student.batchName}
                            </span>
                          </TableCell>

                          {/* Latest Score / Mean Score */}
                          <TableCell className="align-middle text-center font-mono text-xs font-black">
                            <span className={isAtCriticalRisk ? 'text-destructive' : 'text-foreground'}>
                              {student.averageScore}%
                            </span>
                          </TableCell>

                          {/* Risk level derived index badge */}
                          <TableCell className="align-middle">
                            {isAtCriticalRisk && (
                              <Badge variant="destructive" className="text-[9px] px-1.5 py-0 uppercase font-bold tracking-wide">
                                CRT Risk <AlertTriangle className="h-2 w-2 shrink-0 ml-1" />
                              </Badge>
                            )}
                            {isAtModerateRisk && (
                              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 uppercase font-bold tracking-wide text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400">
                                Moderate
                              </Badge>
                            )}
                            {isAtLowRisk && (
                              <Badge variant="success" className="text-[9px] px-1.5 py-0 uppercase font-bold tracking-wide">
                                Low Risk
                              </Badge>
                            )}
                          </TableCell>

                          {/* Weak topics mapped */}
                          <TableCell className="align-middle">
                            <span className="text-[11px] font-mono text-muted-foreground font-medium block max-w-[180px] break-words">
                              {student.weakSubjects.join(', ') || 'No mapped alerts'}
                            </span>
                          </TableCell>

                          {/* Trigger dropdown items or manual booster trigger */}
                          <TableCell className="text-right align-middle">
                            <CustomDropdownMenu 
                              student={student} 
                              onTriggerAlert={handleDropdownTriggerAlert}
                              onPrescribeBooster={handlePrescribeBooster}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            
            <CardFooter className="p-3 bg-muted/20 border-t border-border/80 flex justify-between items-center text-[11px] text-muted-foreground select-none">
              <span>Roster synced live with candidate response indices</span>
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

        {/* SIDE BAR WIDGETS COLUMN */}
        <div className="space-y-6">
          
          {/* SECTION 5: Pending & Draft Benchmark Tests Widget */}
          <Card className="border border-border/85 shadow-xs">
            <CardHeader className="p-5 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-black text-foreground">Pending Benchmark Hub</CardTitle>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold font-mono">
                  {testsList.filter(t => t.status === 'draft').length} Drafts
                </span>
              </div>
              <CardDescription className="text-xs">Benchmark assessments queued for cohort rollout</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              <div className="space-y-3">
                {testsList.map((test) => {
                  const isDraft = test.status === 'draft';
                  return (
                    <div 
                      key={test.id} 
                      className={`p-3 rounded-xl border transition-all ${
                        isDraft 
                          ? 'border-dashed border-border bg-muted/10' 
                          : 'border-border bg-card'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <span className="font-bold text-foreground text-xs block leading-tight">{test.title}</span>
                          <span className="text-[9px] font-mono text-muted-foreground mt-0.5 block">{test.batchName}</span>
                        </div>
                        <Badge variant={isDraft ? 'outline' : 'success'} className="text-[8px] font-black uppercase px-1.5 py-0 leading-none">
                          {test.status}
                        </Badge>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-border/40 flex justify-between items-center">
                        <span className="text-[9px] text-muted-foreground font-semibold flex items-center gap-1">
                          <Clock className="h-3 w-3 inline text-muted-foreground/60" />
                          {test.durationMinutes} mins • {test.questionCount} Questions
                        </span>

                        {isDraft ? (
                          <button
                            type="button"
                            onClick={() => handlePublishUpcomingTest(test.id)}
                            className="inline-flex items-center gap-1 text-[10px] bg-primary text-primary-foreground font-black px-2 py-1 rounded shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
                          >
                            <Play className="h-2.5 w-2.5 shrink-0" />
                            Launch Bench
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onNavigate(`/owner/tests/${test.id}`)}
                            className="text-primary hover:underline text-[10px] font-bold cursor-pointer"
                          >
                            Class Reports →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* SECTION 6: Recent Activity Real-time Feed */}
          <Card className="border border-border shadow-xs">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-black text-foreground">Institute Stream Activity</CardTitle>
              <CardDescription className="text-xs">Real-time learning analytics events feed on your campus channels</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="relative border-l border-border pl-4 ml-2.5 space-y-5 py-2">
                {recentActivities.map((act) => {
                  const ActIcon = act.icon;
                  return (
                    <div key={act.id} className="relative group">
                      {/* Left circular target node */}
                      <span className="absolute -left-[24px] top-0 h-4 w-4 rounded-full border border-background bg-card flex items-center justify-center text-foreground shadow-xs">
                        <ActIcon className={`h-2.5 w-2.5 ${act.color || 'text-muted-foreground'}`} />
                      </span>
                      
                      <div className="space-y-0.5 pl-1.5">
                        <p className="text-xs font-semibold text-foreground leading-normal">{act.text}</p>
                        <span className="text-[9px] font-mono text-muted-foreground block">{act.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-border/50 text-center">
                <span className="text-[10px] text-muted-foreground font-semibold">
                  ⚡ Socket Listening Continuous
                </span>
              </div>
            </CardContent>
          </Card>

          {/* AI Advisor Assistant Prompt */}
          <Card className="border border-primary/20 bg-primary/[0.01] border-dashed">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-xs uppercase font-bold text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                Result Booster Advisor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                Comparative curves show that candidates in <strong className="text-foreground">CCC Morning Batch A</strong> who engaged in targeted mock practice tests built on weak metrics gained an average of <span className="text-foreground font-black">+14.2%</span> on real NIELIT certification tests.
              </p>
              <button 
                type="button"
                onClick={() => onNavigate('/owner/performance')}
                className="text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer text-[11px]"
              >
                Review research performance reports
              </button>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  );
}
