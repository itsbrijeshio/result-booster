import * as React from 'react';
import { 
  Plus, 
  Upload, 
  Search, 
  Trash, 
  Edit, 
  X, 
  FileText, 
  CheckCircle, 
  Eye, 
  BookOpen, 
  Filter, 
  Sparkles, 
  Download, 
  Database, 
  AlertCircle, 
  Check, 
  Loader2,
  ListFilter
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
  Label
} from '../../components/ui/CustomComponents';
import { initialQuestions } from '../../data';
import { Question } from '../../types';

interface ExtendedQuestion extends Question {
  course: string;
  subject: string;
  topic: string;
  createdDate: string;
}

export default function OwnerQuestions() {
  // Enhanced dataset mapped from initialQuestions with detailed fields required by user specs
  const [questions, setQuestions] = React.useState<ExtendedQuestion[]>(() => {
    return initialQuestions.map((q, idx) => {
      let course = 'CCC Certification';
      let subject = 'Computer Fundamentals';
      let topic = q.tags[0] || 'General';
      let createdDate = `2026-05-${15 + idx}`;

      if (q.id === 'q-2') {
        course = 'DCA Diploma';
        subject = 'MS Office Suite';
        topic = 'MS Excel Formulas';
      } else if (q.id === 'q-3') {
        course = 'CCC Certification';
        subject = 'Networking & Internet';
        topic = 'Internet Protocols';
      } else if (q.id === 'q-4') {
        course = 'CCC Certification';
        subject = 'Office Utilities';
        topic = 'LibreOffice Writer shortcuts';
      } else if (q.id === 'q-5') {
        course = 'O Level IT';
        subject = 'Information Technology';
        topic = 'Evolution of Web & Browsers';
      }

      return {
        ...q,
        course,
        subject,
        topic,
        createdDate
      };
    });
  });

  // UI state for search and filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [courseFilter, setCourseFilter] = React.useState('All');
  const [topicFilter, setTopicFilter] = React.useState('All');
  const [difficultyFilter, setDifficultyFilter] = React.useState('All');
  
  // Tabs for list views or filtered layouts
  const [activeTab, setActiveTab] = React.useState<'all' | 'essential' | 'advanced'>('all');

  // Interactive drawer/sheet state
  const [selectedQuestion, setSelectedQuestion] = React.useState<ExtendedQuestion | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Modal active triggers
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Form states (Add & Edit)
  const [formCourse, setFormCourse] = React.useState('CCC Certification');
  const [formSubject, setFormSubject] = React.useState('Computer Fundamentals');
  const [formTopic, setFormTopic] = React.useState('');
  const [formDifficulty, setFormDifficulty] = React.useState<'easy' | 'medium' | 'hard'>('medium');
  const [formText, setFormText] = React.useState('');
  const [formOptA, setFormOptA] = React.useState('');
  const [formOptB, setFormOptB] = React.useState('');
  const [formOptC, setFormOptC] = React.useState('');
  const [formOptD, setFormOptD] = React.useState('');
  const [formCorrectIdx, setFormCorrectIdx] = React.useState(0);

  // Bulk Import state values
  const [csvContent, setCsvContent] = React.useState('');
  const [importFeedback, setImportFeedback] = React.useState<string | null>(null);

  // Interactive Toast State
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // Simulate loading spinner when filtering questions to give smooth feedback
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, courseFilter, topicFilter, difficultyFilter, activeTab]);

  // Aggregate topics dynamically for filter options
  const distinctTopics = React.useMemo(() => {
    return Array.from(new Set(questions.map(q => q.topic))).filter(Boolean);
  }, [questions]);

  // Handle Create Question Form
  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText || !formOptA || !formOptB) {
      triggerToast('Error: Please write a valid question and fill in at least Option A and B.');
      return;
    }

    const newQuestion: ExtendedQuestion = {
      id: `q-${Date.now()}`,
      text: formText,
      options: [formOptA, formOptB, formOptC || 'None of the above', formOptD || 'All of the above'].filter(Boolean),
      correctOptionIdx: Number(formCorrectIdx),
      tags: [formSubject, formTopic],
      difficulty: formDifficulty,
      course: formCourse,
      subject: formSubject,
      topic: formTopic || 'General Basics',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setQuestions([newQuestion, ...questions]);
    setIsAddOpen(false);
    triggerToast('Successfully registered new benchmark MCQ to the central bank!');
    
    // Reset Form fields
    setFormText('');
    setFormOptA('');
    setFormOptB('');
    setFormOptC('');
    setFormOptD('');
    setFormCorrectIdx(0);
    setFormTopic('');
  };

  // Switch context to Edit state
  const handleOpenEdit = (q: ExtendedQuestion, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedQuestion(q);
    setFormCourse(q.course);
    setFormSubject(q.subject || 'Office Application Tools');
    setFormTopic(q.topic);
    setFormDifficulty(q.difficulty);
    setFormText(q.text);
    setFormOptA(q.options[0] || '');
    setFormOptB(q.options[1] || '');
    setFormOptC(q.options[2] || '');
    setFormOptD(q.options[3] || '');
    setFormCorrectIdx(q.correctOptionIdx);
    
    setIsDrawerOpen(false);
    setIsEditOpen(true);
  };

  // Submit and save edited question
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion) return;

    setQuestions(questions.map(q => {
      if (q.id === selectedQuestion.id) {
        return {
          ...q,
          course: formCourse,
          subject: formSubject,
          topic: formTopic || 'General Units',
          difficulty: formDifficulty,
          text: formText,
          options: [formOptA, formOptB, formOptC, formOptD].filter(Boolean),
          correctOptionIdx: Number(formCorrectIdx),
          tags: [formSubject, formTopic]
        };
      }
      return q;
    }));

    setIsEditOpen(false);
    triggerToast('Selected question updated successfully.');
  };

  // Delete question item
  const handleDeleteQuestion = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setQuestions(questions.filter(q => q.id !== id));
    setIsDrawerOpen(false);
    triggerToast('Question successfully removed from the repository database.');
  };

  // Reset filter constraints
  const handleResetFilters = () => {
    setSearchQuery('');
    setCourseFilter('All');
    setTopicFilter('All');
    setDifficultyFilter('All');
    triggerToast('All filter criteria cleared successfully.');
  };

  // Perform Simulated Bulk CSV Parsing
  const handleBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulated pre-packed test questions for extremely high-fidelity CSV parse
    const demoCsvQuestions: ExtendedQuestion[] = [
      {
        id: `q-bulk-1`,
        text: 'Which function tracks cell change audit trails inside LibreOffice Calc spreadsheets?',
        options: ['Edit -> Track Changes', 'Sheet -> Merge Cells', 'Tools -> Macros', 'Insert -> Document Comment'],
        correctOptionIdx: 0,
        tags: ['LibreOffice Calc', 'Formulas'],
        difficulty: 'medium',
        course: 'CCC Certification',
        subject: 'Office Utilities',
        topic: 'LibreOffice Calc Audits',
        createdDate: '2026-05-28'
      },
      {
        id: `q-bulk-2`,
        text: 'What protocol resolves human-readable DNS hostnames into system dynamic IP addresses?',
        options: ['HTML Protocol', 'Domain Name System (DNS)', 'SMTP Express Mailing', 'File Transfer Protocol FTP'],
        correctOptionIdx: 1,
        tags: ['Internet Concepts', 'Protocols'],
        difficulty: 'easy',
        course: 'CCC Certification',
        subject: 'Networking & Internet',
        topic: 'Internet Protocols',
        createdDate: '2026-05-28'
      },
      {
        id: `q-bulk-3`,
        text: 'What error code triggers if a formula executes division by zero in Microsoft Excel sheets?',
        options: ['#NULL!', '#VALUE!', '#DIV/0!', '#REF!'],
        correctOptionIdx: 2,
        tags: ['MS Excel', 'Formula Errors'],
        difficulty: 'medium',
        course: 'DCA Diploma',
        subject: 'MS Office Suite',
        topic: 'MS Excel Formulas',
        createdDate: '2026-05-28'
      },
      {
        id: `q-bulk-4`,
        text: 'In web layout architectures, which HTML tag holds semantic metadata variables for page responsiveness?',
        options: ['<meta>', '<header>', '<aside>', '<script>'],
        correctOptionIdx: 0,
        tags: ['HTML Coding', 'Web Development'],
        difficulty: 'hard',
        course: 'O Level IT',
        subject: 'Advanced Web Design',
        topic: 'Evolution of Web & Browsers',
        createdDate: '2026-05-28'
      }
    ];

    setQuestions([...demoCsvQuestions, ...questions]);
    setIsImportOpen(false);
    setCsvContent('');
    triggerToast('🎯 Bulk CSV parse complete inside engine: Loaded 4 system MCQs instantly!');
  };

  // Click on generic row triggers the side over drawer
  const handleRowClick = (q: ExtendedQuestion) => {
    setSelectedQuestion(q);
    setIsDrawerOpen(true);
  };

  // Filter questions output log
  const filteredQuestions = React.useMemo(() => {
    return questions.filter(q => {
      const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            q.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            q.topic.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCourse = courseFilter === 'All' || q.course === courseFilter;
      const matchesTopic = topicFilter === 'All' || q.topic === topicFilter;
      const matchesDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter;

      // Handle custom tags views
      let matchesTab = true;
      if (activeTab === 'essential') {
        matchesTab = q.difficulty === 'easy';
      } else if (activeTab === 'advanced') {
        matchesTab = q.difficulty === 'hard' || q.difficulty === 'medium';
      }

      return matchesSearch && matchesCourse && matchesTopic && matchesDifficulty && matchesTab;
    });
  }, [questions, searchQuery, courseFilter, topicFilter, difficultyFilter, activeTab]);

  return (
    <PageContainer>
      {/* Toast popup */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-55 max-w-sm p-4 bg-foreground text-background dark:bg-card dark:text-foreground border border-border rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in font-medium">
          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
          <div className="text-xs">{toastMsg}</div>
        </div>
      )}

      {/* Title block */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-primary/10 text-primary font-mono text-[10px] uppercase font-black rounded-md tracking-wider">
              Central Repository
            </span>
            <span className="text-xs text-muted-foreground font-mono">v3.4 Production Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Central Question Bank
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Register individual MCQs, manage course mappings for CCC, DCA, ADCA courses, and import bulk structured CSV files with automated option parsing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Import CSV Trigger */}
          <button
            type="button"
            onClick={() => setIsImportOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg border border-border hover:bg-muted text-foreground transition-all cursor-pointer bg-background"
          >
            <Upload className="h-4 w-4 text-muted-foreground" />
            Import CSV File
          </button>

          {/* Add Question Trigger */}
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all cursor-pointer shadow-sm"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            Add Single MCQ
          </button>
        </div>
      </div>

      {/* Toolbar controls and search fields */}
      <div className="space-y-3 bg-muted/15 p-4 rounded-xl border border-border/70">
        
        {/* Row 1: Search Queries & Filters dropdown */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-12">
          
          {/* Search Question text input */}
          <div className="relative md:col-span-4">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground/60" />
            <Input
              type="text"
              placeholder="Search by keywords or course..."
              className="pl-9 text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Course filter select dropdown */}
          <div className="md:col-span-2.5">
            <Select
              className="text-xs font-semibold"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="All">All Course Streams</option>
              <option value="CCC Certification">CCC Certification</option>
              <option value="DCA Diploma">DCA Diploma</option>
              <option value="ADCA Diploma">ADCA Diploma</option>
              <option value="O Level IT">O Level IT</option>
            </Select>
          </div>

          {/* Topic filter select dropdown */}
          <div className="md:col-span-2.5">
            <Select
              className="text-xs font-semibold"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
            >
              <option value="All">All Topics ({distinctTopics.length})</option>
              {distinctTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </Select>
          </div>

          {/* Difficulty filter dropdown */}
          <div className="md:col-span-2">
            <Select
              className="text-xs font-semibold"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              <option value="easy">Easy Level</option>
              <option value="medium">Medium Level</option>
              <option value="hard">Hard Level</option>
            </Select>
          </div>

          {/* Reset Filters action */}
          <div className="md:col-span-1 flex items-stretch">
            <button
              onClick={handleResetFilters}
              title="Reset All Search Settings"
              className="w-full flex items-center justify-center rounded-lg border border-border/80 bg-background text-muted-foreground hover:text-foreground text-xs font-bold hover:bg-muted/30 transition-all cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Level Tabs and Stats status info */}
        <div className="border-t border-border/60 pt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs">
          
          {/* Visual selector tabs */}
          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-lg self-start">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all' 
                  ? 'bg-background text-foreground shadow-xs' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All MCQs ({questions.length})
            </button>
            <button
              onClick={() => setActiveTab('essential')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'essential' 
                  ? 'bg-background text-foreground shadow-xs' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Easy Basics
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'advanced' 
                  ? 'bg-background text-foreground shadow-xs' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Medium & Hard Checks
            </button>
          </div>

          <div className="text-muted-foreground font-mono font-bold flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Found {filteredQuestions.length} matched MCQs based on filters
          </div>
        </div>

      </div>

      {/* Main Table Layout */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-mono">Syncing computer science question grids...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No questions matched filter metrics"
          description="We couldn't search any question entries in database. Try resetting topic selects or write a new custom entry."
          actionLabel="Clear All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="border border-border/80 rounded-2xl overflow-hidden bg-card shadow-xs">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-[11px] font-black uppercase text-foreground py-3.5 pl-6">Question Content</TableHead>
                <TableHead className="text-[11px] font-black uppercase text-foreground py-3.5">Course</TableHead>
                <TableHead className="text-[11px] font-black uppercase text-foreground py-3.5">Topic & Tag</TableHead>
                <TableHead className="text-[11px] font-black uppercase text-foreground py-3.5 text-center">Difficulty</TableHead>
                <TableHead className="text-[11px] font-black uppercase text-foreground py-3.5">Correct Option</TableHead>
                <TableHead className="text-[11px] font-black uppercase text-foreground py-3.5">Approved Date</TableHead>
                <TableHead className="text-[11px] font-black uppercase text-foreground py-3.5 text-right pr-6">Database Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((q) => {
                // Formatting difficulty highlights
                let diffBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400';
                if (q.difficulty === 'medium') {
                  diffBadge = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400';
                } else if (q.difficulty === 'hard') {
                  diffBadge = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400';
                }

                // Correct answer option lettering mapping
                const optionLetter = String.fromCharCode(65 + q.correctOptionIdx);
                const correctTextPreview = q.options[q.correctOptionIdx] || '';

                return (
                  <TableRow 
                    key={q.id}
                    onClick={() => handleRowClick(q)}
                    className="hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    {/* Column 1: Question text */}
                    <TableCell className="p-4 pl-6 max-w-sm">
                      <div className="space-y-1">
                        <span className="font-extrabold text-xs text-foreground line-clamp-2 leading-relaxed">
                          {q.text}
                        </span>
                        <span className="text-[9px] font-mono font-bold text-muted-foreground">
                          ID: {q.id}
                        </span>
                      </div>
                    </TableCell>

                    {/* Column 2: Course */}
                    <TableCell className="p-4">
                      <Badge variant="outline" className="font-bold text-[10px] uppercase">
                        {q.course}
                      </Badge>
                    </TableCell>

                    {/* Column 3: Topic */}
                    <TableCell className="p-4">
                      <div className="space-y-0.5 max-w-[130px]">
                        <span className="font-semibold text-xs text-foreground block truncate">
                          {q.topic}
                        </span>
                        <span className="text-[9px] text-muted-foreground block truncate">
                          {q.subject || 'Essentials'}
                        </span>
                      </div>
                    </TableCell>

                    {/* Column 4: Difficulty */}
                    <TableCell className="p-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] tracking-wide font-extrabold uppercase ${diffBadge}`}>
                        {q.difficulty}
                      </span>
                    </TableCell>

                    {/* Column 5: Correct Answer */}
                    <TableCell className="p-4">
                      <div className="flex items-center gap-1.5 min-w-[110px]">
                        <span className="h-5.5 w-5.5 font-mono text-[10px] font-black rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
                          {optionLetter}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground line-clamp-1">
                          {correctTextPreview}
                        </span>
                      </div>
                    </TableCell>

                    {/* Column 6: Created Date */}
                    <TableCell className="p-4 py-3.5 text-xs font-mono text-muted-foreground">
                      {q.createdDate || '2026-05-24'}
                    </TableCell>

                    {/* Column 7: Actions */}
                    <TableCell className="p-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRowClick(q)}
                          title="Preview Question"
                          className="p-1 px-2 text-[10px] font-bold rounded-md bg-secondary text-foreground hover:bg-muted transition-all border border-border/40 cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>

                        <button
                          onClick={(e) => handleOpenEdit(q, e)}
                          title="Edit Question Details"
                          className="p-1 px-2 text-[10px] font-bold rounded-md bg-secondary text-foreground hover:bg-muted transition-all border border-border/40 cursor-pointer flex items-center gap-1"
                        >
                          <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                          Edit
                        </button>

                        <button
                          onClick={(e) => handleDeleteQuestion(q.id, e)}
                          title="Delete from Database"
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors border border-border/30 cursor-pointer"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* DYNAMIC SHEET/DRAWER PREVIEW (A Slide-over Sheet component styled in pure Tailwind) */}
      {selectedQuestion && isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop blur element */}
          <div 
            className="absolute inset-0 bg-foreground/35 backdrop-blur-xs transition-opacity duration-300" 
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer main chassis */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col justify-between animate-slide-in">
              
              {/* Drawer Top Header */}
              <div className="p-6 border-b border-border space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">
                    MCQ Record Index: {selectedQuestion.id}
                  </span>
                  
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-muted border border-border/40 text-muted-foreground hover:text-foreground transition-all"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase font-black text-[10px] tracking-wide px-2.5">
                    {selectedQuestion.course}
                  </Badge>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-extrabold uppercase ${
                    selectedQuestion.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    selectedQuestion.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {selectedQuestion.difficulty} Level
                  </span>
                </div>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                
                {/* Full Question Text */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">
                    Question Content Text
                  </span>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-xs sm:text-sm font-extrabold leading-relaxed text-foreground">
                    {selectedQuestion.text}
                  </div>
                </div>

                {/* Sub Metadata info */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-muted/10 rounded-lg border border-border/40">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground block">Subject Stream</span>
                    <span className="font-bold text-foreground mt-0.5 block">{selectedQuestion.subject || 'Office Systems'}</span>
                  </div>
                  <div className="p-3 bg-muted/10 rounded-lg border border-border/40">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground block">Topic Tag</span>
                    <span className="font-bold text-foreground mt-0.5 block truncate" title={selectedQuestion.topic}>{selectedQuestion.topic}</span>
                  </div>
                </div>

                {/* Simulated Options List & correctness feedback */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">
                    Alternative Choices (Options A - D)
                  </span>

                  <div className="space-y-2">
                    {selectedQuestion.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === selectedQuestion.correctOptionIdx;
                      const letter = String.fromCharCode(65 + optIdx);

                      return (
                        <div 
                          key={optIdx}
                          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-3 transition-colors ${
                            isCorrect 
                              ? 'border-emerald-600/30 bg-emerald-500/[0.03] text-emerald-600' 
                              : 'border-border/60 bg-muted/10 text-muted-foreground'
                          }`}
                        >
                          <span className={`h-6 w-6 font-mono font-bold text-xs rounded-lg flex items-center justify-center border shrink-0 ${
                            isCorrect 
                              ? 'bg-emerald-500 text-white border-transparent' 
                              : 'bg-background border-border text-muted-foreground'
                          }`}>
                            {letter}
                          </span>
                          <span className="flex-1 leading-normal">{opt}</span>
                          {isCorrect && (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-extrabold uppercase text-[9px]">
                              Correct Choice
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stats block inside drawer */}
                <div className="p-4 rounded-xl bg-primary/[0.02] border border-primary/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Database className="h-4.5 w-4.5 text-primary" />
                    <span className="font-semibold text-muted-foreground">Global Registry Status:</span>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 uppercase font-extrabold text-[9px]">
                    Verified Audit Approved
                  </Badge>
                </div>

              </div>

              {/* Drawer Bottom Footer Actions Panel */}
              <div className="p-6 border-t border-border bg-muted/10 grid grid-cols-2 gap-3.5 shrink-0">
                {/* Delete button option */}
                <button
                  onClick={() => handleDeleteQuestion(selectedQuestion.id)}
                  className="px-4 py-2.5 text-xs font-bold rounded-lg border border-destructive/20 hover:bg-destructive/10 text-destructive flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash className="h-4 w-4" />
                  Delete Question
                </button>

                {/* Edit button option */}
                <button
                  onClick={() => handleOpenEdit(selectedQuestion)}
                  className="px-4 py-2.5 text-xs font-black rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Edit className="h-4 w-4" />
                  Edit Parameters
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ADD QUESTION MODAL */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Compose Central MCQ"
        description="Fill in subject streams, define correct answers, and save to the central memory bank."
      >
        <form onSubmit={handleCreateQuestion} className="space-y-4 pt-1">
          
          <div className="grid grid-cols-2 gap-3">
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
              <label className="text-xs font-bold text-foreground block">Target Difficulty</label>
              <Select
                value={formDifficulty}
                onChange={(e) => setFormDifficulty(e.target.value as any)}
              >
                <option value="easy">Easy Level</option>
                <option value="medium">Medium Level</option>
                <option value="hard">Hard Level</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Subject Group</label>
              <Select
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
              >
                <option value="Computer Fundamentals">Computer Fundamentals</option>
                <option value="MS Office Suite">MS Office Suite</option>
                <option value="LibreOffice Utilities">LibreOffice Utilities</option>
                <option value="Networking & Internet">Networking & Internet</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Advanced Web Design">Advanced Web Design</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Topic Tag / Unit *</label>
              <Input
                required
                placeholder="e.g. VLOOKUP, CSS sizing"
                value={formTopic}
                onChange={(e) => setFormTopic(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground block">Question text content *</label>
            <Textarea
              required
              placeholder="Write the comprehensive MCQ description inquiry..."
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Options Choices</span>
            
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1">
                <Input required placeholder="Option A *" value={formOptA} onChange={(e) => setFormOptA(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Input required placeholder="Option B *" value={formOptB} onChange={(e) => setFormOptB(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Input placeholder="Option C (Optional)" value={formOptC} onChange={(e) => setFormOptC(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Input placeholder="Option D (Optional)" value={formOptD} onChange={(e) => setFormOptD(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Correct choice selection field */}
          <div className="space-y-1.5 pt-2 border-t border-border">
            <label className="text-xs font-bold text-foreground block">Assign Correct Solution Option</label>
            <Select
              value={formCorrectIdx}
              onChange={(e) => setFormCorrectIdx(Number(e.target.value))}
            >
              <option value={0}>Option A is Correct</option>
              <option value={1}>Option B is Correct</option>
              <option value={2}>Option C is Correct</option>
              <option value={3}>Option D is Correct</option>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border mt-2">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:bg-muted/90 cursor-pointer"
            >
              Discard Form
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-black rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer shadow-sm"
            >
              Confirm Creation
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT QUESTION MODAL */}
      {selectedQuestion && isEditOpen && (
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Update MCQ Parameters"
          description={`Modify configurations and correct key indicators for index record ${selectedQuestion.id}.`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 pt-1">
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Course Stream Layout</label>
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
                <label className="text-xs font-bold text-foreground block">Target Difficulty</label>
                <Select
                  value={formDifficulty}
                  onChange={(e) => setFormDifficulty(e.target.value as any)}
                >
                  <option value="easy">Easy Level</option>
                  <option value="medium">Medium Level</option>
                  <option value="hard">Hard Level</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Subject Stream Category</label>
                <Select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                >
                  <option value="Computer Fundamentals">Computer Fundamentals</option>
                  <option value="MS Office Suite">MS Office Suite</option>
                  <option value="LibreOffice Utilities">LibreOffice Utilities</option>
                  <option value="Networking & Internet">Networking & Internet</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Advanced Web Design">Advanced Web Design</option>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">Topic Tag / Unit Name</label>
                <Input
                  required
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground block">Question Text Description *</label>
              <Textarea
                required
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Alternative choices</span>
              
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="space-y-1">
                  <Input required placeholder="Option A *" value={formOptA} onChange={(e) => setFormOptA(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Input required placeholder="Option B *" value={formOptB} onChange={(e) => setFormOptB(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Input placeholder="Option C" value={formOptC} onChange={(e) => setFormOptC(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Input placeholder="Option D" value={formOptD} onChange={(e) => setFormOptD(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="text-xs font-bold text-foreground block">Re-Assign Correct Solution Option</label>
              <Select
                value={formCorrectIdx}
                onChange={(e) => setFormCorrectIdx(Number(e.target.value))}
              >
                <option value={0}>Option A is Correct</option>
                <option value={1}>Option B is Correct</option>
                <option value={2}>Option C is Correct</option>
                <option value={3}>Option D is Correct</option>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:bg-muted/90 cursor-pointer"
              >
                Discard Changes
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-black rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer shadow-sm active:scale-95"
              >
                Save Question Parameters
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* REVOLUTIONARY BULK CSV IMPORT MODAL */}
      <Modal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Simulate CSV MCQ Bulk Import"
        description="Preview schema variables, write mock spreadsheet data, or parse simulated tables instantly."
      >
        <form onSubmit={handleBulkImport} className="space-y-4 pt-1">
          
          <div className="p-3.5 rounded-xl border border-dashed border-border/80 bg-muted/20 space-y-2">
            <span className="text-[10px] font-mono uppercase font-black tracking-wider text-foreground flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5 text-primary" />
              Standard File Schema Variable Tree
            </span>
            <code className="text-[9.5px] font-mono leading-relaxed block text-muted-foreground select-all bg-card p-2 border border-border/40 rounded-lg">
              QuestionText,OptionA,OptionB,OptionC,OptionD,CorrectOptionIdx,Difficulty,Course,Subject,Topic
            </code>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-foreground">Spreadsheet CSV raw content</label>
              <button
                type="button"
                onClick={() => {
                  setCsvContent(
                    `"Which program converts high-level Python script code into bytecodes?", "Compiler", "Interpreter", "Linker", "Assembler", 1, "medium", "O Level IT", "Programming", "Python compilation"`
                  );
                }}
                className="text-primary hover:underline font-extrabold cursor-pointer"
              >
                Load Sample Snippet
              </button>
            </div>
            
            <Textarea
              rows={4}
              placeholder='e.g. "What is shortcut to paste?","Ctrl+X","Ctrl+C","Ctrl+V","Ctrl+A",2,"easy","CCC Certification","Windows Shortcuts"'
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              className="text-xs font-mono"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-orange-500/[0.03] border border-orange-500/10 space-y-1">
            <span className="text-[11px] font-bold text-amber-700 block flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              Bulk Demonstration Helper
            </span>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              For testing purposes, submitting this form will bypass parsing raw comma-separated entries and directly merge <strong>4 high-quality computer certification, LibreOffice Calc, network protocols, & HTML layout benchmark MCQs</strong>.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsImportOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:bg-muted/90 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-black rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 cursor-pointer shadow-sm active:scale-95 text-center"
            >
              Import 4 MCQs Instantly
            </button>
          </div>
        </form>
      </Modal>

    </PageContainer>
  );
}
