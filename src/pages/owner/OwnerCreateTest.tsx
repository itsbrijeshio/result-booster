import * as React from 'react';
import { 
  Plus, 
  Search, 
  X, 
  FileText, 
  CheckCircle, 
  Eye, 
  BookOpen, 
  Clock, 
  Percent, 
  Users, 
  Check, 
  Copy, 
  AlertCircle,
  Calendar,
  Lock,
  ArrowRight,
  ArrowLeft,
  Settings,
  ListPlus,
  Compass,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge, 
  Input, 
  Select, 
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
  Label,
  Checkbox
} from '../../components/ui/CustomComponents';
import { initialBatches, initialStudents, initialQuestions } from '../../data';
import { Question } from '../../types';

interface OwnerCreateTestProps {
  onNavigate: (path: string) => void;
}

export default function OwnerCreateTest({ onNavigate }: OwnerCreateTestProps) {
  // Stepper tracker (1 to 5: Config, Questions, Assignment, Timeframe, Preview)
  const [currentStep, setCurrentStep] = React.useState<number>(1);

  // STEP 1 State fields: Test Configuration
  const [testName, setTestName] = React.useState('');
  const [testType, setTestType] = React.useState<'Benchmark' | 'Practice Quiz' | 'Unit Check' | 'Term Exam'>('Benchmark');
  const [timeLimit, setTimeLimit] = React.useState('45');
  const [passMarks, setPassMarks] = React.useState('40');
  const [randomize, setRandomize] = React.useState(false);

  // STEP 2 State fields: Question Selector Filters & Choices
  const [searchQuery, setSearchQuery] = React.useState('');
  const [topicFilter, setTopicFilter] = React.useState('All');
  const [difficultyFilter, setDifficultyFilter] = React.useState('All');
  const [selectedQuestionIds, setSelectedQuestionIds] = React.useState<string[]>([]);

  // STEP 3 State fields: Assignment Targets
  const [selectedBatchId, setSelectedBatchId] = React.useState<string>('batch-1');
  const [selectedStudentIds, setSelectedStudentIds] = React.useState<string[]>([]);

  // STEP 4 State fields: Live Availability Schedule
  const [startDateTime, setStartDateTime] = React.useState('2026-05-28T13:00');
  const [endDateTime, setEndDateTime] = React.useState('2026-06-04T18:00');

  // Trigger feedback toasts
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // Dynamically load batches and students for Step 3 target feeds
  const currentBatchStudents = React.useMemo(() => {
    return initialStudents.filter(s => s.batchId === selectedBatchId);
  }, [selectedBatchId]);

  // Sync assignment checkboxes when batch swaps as safe defaults
  React.useEffect(() => {
    // Select all students of the newly swapped batch as a default
    const batchStudentIds = currentBatchStudents.map(s => s.id);
    setSelectedStudentIds(batchStudentIds);
  }, [selectedBatchId]);

  // Step 2 Calculations: Estimated Difficulty metrics & Questions filtration
  const filteredQuestions = React.useMemo(() => {
    return initialQuestions.filter(q => {
      const matchText = q.text.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTopic = topicFilter === 'All' || q.tags.some(tag => tag.toLowerCase().includes(topicFilter.toLowerCase()));
      const matchDiff = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
      return matchText && matchTopic && matchDiff;
    });
  }, [searchQuery, topicFilter, difficultyFilter]);

  // Aggregate topics dynamically for filter options
  const distinctTopics = React.useMemo(() => {
    const rawSet = new Set<string>();
    initialQuestions.forEach(q => q.tags.forEach(tag => rawSet.add(tag)));
    return Array.from(rawSet);
  }, []);

  // Compute weighted difficulty values based on chosen MCQ count
  const estimatedDifficultyStr = React.useMemo(() => {
    if (selectedQuestionIds.length === 0) return 'None Selected';
    
    const selectedList = initialQuestions.filter(q => selectedQuestionIds.includes(q.id));
    let easyCount = 0;
    let mediumCount = 0;
    let hardCount = 0;

    selectedList.forEach(q => {
      if (q.difficulty === 'easy') easyCount++;
      else if (q.difficulty === 'medium') mediumCount++;
      else hardCount++;
    });

    const easyPct = Math.round((easyCount / selectedList.length) * 100);
    const mediumPct = Math.round((mediumCount / selectedList.length) * 100);
    const hardPct = Math.round((hardCount / selectedList.length) * 100);

    // Formulate a clean semantic label
    if (easyPct >= 65) return `Easy Peak (${easyPct}% Easy)`;
    if (hardPct >= 40) return `Hard Challenge (${hardPct}% Advanced)`;
    if (mediumPct >= 50) return `Medium Balanced (${mediumPct}% Medium)`;
    return `Mixed Core (${easyPct}% E / ${mediumPct}% M / ${hardPct}% H)`;
  }, [selectedQuestionIds]);

  // Selector handlers
  const handleToggleQuestionSelect = (id: string) => {
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter(qId => qId !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  const handleSelectAllQuestions = () => {
    const currentFilteredIds = filteredQuestions.map(q => q.id);
    const allSelectedInView = currentFilteredIds.every(id => selectedQuestionIds.includes(id));

    if (allSelectedInView) {
      // Discard current view questions from global state
      setSelectedQuestionIds(selectedQuestionIds.filter(id => !currentFilteredIds.includes(id)));
    } else {
      // Merge unique ones
      const combined = Array.from(new Set([...selectedQuestionIds, ...currentFilteredIds]));
      setSelectedQuestionIds(combined);
    }
  };

  const handleToggleStudentSelect = (id: string) => {
    if (selectedStudentIds.includes(id)) {
      setSelectedStudentIds(selectedStudentIds.filter(stId => stId !== id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, id]);
    }
  };

  const handleToggleAllStudentsOfBatch = () => {
    const batchStudentIds = currentBatchStudents.map(s => s.id);
    const allSelected = batchStudentIds.every(id => selectedStudentIds.includes(id));

    if (allSelected) {
      setSelectedStudentIds(selectedStudentIds.filter(id => !batchStudentIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedStudentIds, ...batchStudentIds]));
      setSelectedStudentIds(merged);
    }
  };

  // Wizard navigation validations
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!testName.trim()) {
        triggerToast('Error: Please input a descriptive examination title.');
        return;
      }
      if (Number(timeLimit) <= 0 || isNaN(Number(timeLimit))) {
        triggerToast('Error: Please enter a valid time limit in minutes (greater than 0).');
        return;
      }
      if (Number(passMarks) < 0 || isNaN(Number(passMarks))) {
        triggerToast('Error: Please enter a valid passing threshold percentage.');
        return;
      }
    }

    if (currentStep === 2) {
      if (selectedQuestionIds.length === 0) {
        triggerToast('Notice: Selecting at least 1 benchmark MCQ ensures valid results booster runs.');
        return;
      }
    }

    if (currentStep === 3) {
      if (selectedStudentIds.length === 0) {
        triggerToast('Error: Select at least 1 target cohort student to assign this mock paper.');
        return;
      }
    }

    if (currentStep === 4) {
      if (!startDateTime || !endDateTime) {
        triggerToast('Error: Complete the availability window parameters.');
        return;
      }
      if (new Date(endDateTime) <= new Date(startDateTime)) {
        triggerToast('Error: Closing datetime must succeed the start date availability timeline.');
        return;
      }
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Build the final struct for publication and save dynamically
  const executeSubmissionAndNavigate = (publishStatus: 'active' | 'draft') => {
    const matchedBatchObj = initialBatches.find(b => b.id === selectedBatchId);
    
    const newTestObject = {
      id: `test-wizard-${Date.now()}`,
      title: testName,
      type: testType,
      durationMinutes: Number(timeLimit),
      batchId: selectedBatchId,
      batchName: matchedBatchObj ? matchedBatchObj.name : 'Selected Cohort',
      questionCount: selectedQuestionIds.length,
      totalMarks: selectedQuestionIds.length * 20, // 20 marks per question benchmark default
      status: publishStatus,
      description: `Wizard generated term check. Passing barrier: ${passMarks}%. Scheduled from: ${new Date(startDateTime).toLocaleString()} to ${new Date(endDateTime).toLocaleString()}. Randomization: ${randomize ? 'ON' : 'OFF'}.`,
      createdDate: new Date().toISOString().split('T')[0],
      attemptCount: 0,
      totalSeats: selectedStudentIds.length
    };

    // Grab previous tests
    const existingRaw = localStorage.getItem('resultbooster_tests');
    let parentTests = [];
    if (existingRaw) {
      try {
        parentTests = JSON.parse(existingRaw);
      } catch (e) {
        // Fallback
      }
    }

    // Prepend new mock paper
    const updatedCollection = [newTestObject, ...parentTests];
    localStorage.setItem('resultbooster_tests', JSON.stringify(updatedCollection));

    // Toast and navigate
    triggerToast(
      publishStatus === 'active' 
        ? '🎯 Seamlessly compiled assessment successfully shared with target class!' 
        : '💾 Assessment configuration successfully archived as Draft.'
    );

    setTimeout(() => {
      onNavigate('/owner/tests');
    }, 1500);
  };

  return (
    <PageContainer>
      {/* Toast Overlay */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-55 p-4 bg-foreground text-background dark:bg-card dark:text-foreground border border-border rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in font-medium max-w-sm">
          <Info className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="text-xs leading-relaxed">{toastMsg}</div>
        </div>
      )}

      {/* Header Container */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border/60 pb-5">
        <div className="space-y-1">
          <Breadcrumbs
            items={[
              { label: 'Evaluation Hub', onClick: () => onNavigate('/owner/tests') },
              { label: 'Create Test Wizard' }
            ]}
          />
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
            Construct Mock Assessment
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Configure dynamic MCQs, configure window timelines, and schedule smart test delivery for targeted students instantly.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/owner/tests')}
          className="px-3 py-1.5 border border-border text-foreground hover:bg-muted font-bold text-xs rounded-lg transition-all self-start cursor-pointer shrink-0"
        >
          Cancel Wizard
        </button>
      </div>

      {/* STEPPER HEADING NAVIGATION BAR */}
      <div className="bg-card border border-border/70 p-4.5 rounded-2xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between w-full">
            
            {/* Step 1 Circle */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs select-none transition-all ${
                currentStep === 1 ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 font-black' :
                currentStep > 1 ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {currentStep > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-wider font-extrabold ${currentStep === 1 ? 'text-primary' : 'text-muted-foreground'}`}>Config</span>
            </div>

            <div className={`h-0.5 flex-1 transition-all ${currentStep > 1 ? 'bg-emerald-500' : 'bg-border'}`} />

            {/* Step 2 Circle */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs select-none transition-all ${
                currentStep === 2 ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 font-black' :
                currentStep > 2 ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {currentStep > 2 ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-wider font-extrabold ${currentStep === 2 ? 'text-primary' : 'text-muted-foreground'}`}>Questions</span>
            </div>

            <div className={`h-0.5 flex-1 transition-all ${currentStep > 2 ? 'bg-emerald-500' : 'bg-border'}`} />

            {/* Step 3 Circle */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs select-none transition-all ${
                currentStep === 3 ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 font-black' :
                currentStep > 3 ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {currentStep > 3 ? <Check className="h-4 w-4" /> : '3'}
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-wider font-extrabold ${currentStep === 3 ? 'text-primary' : 'text-muted-foreground'}`}>Assign</span>
            </div>

            <div className={`h-0.5 flex-1 transition-all ${currentStep > 3 ? 'bg-emerald-500' : 'bg-border'}`} />

            {/* Step 4 Circle */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs select-none transition-all ${
                currentStep === 4 ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 font-black' :
                currentStep > 4 ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {currentStep > 4 ? <Check className="h-4 w-4" /> : '4'}
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-wider font-extrabold ${currentStep === 4 ? 'text-primary' : 'text-muted-foreground'}`}>Timeline</span>
            </div>

            <div className={`h-0.5 flex-1 transition-all ${currentStep > 4 ? 'bg-emerald-500' : 'bg-border'}`} />

            {/* Step 5 Circle */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs select-none transition-all ${
                currentStep === 5 ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 font-black' : 'bg-muted text-muted-foreground'
              }`}>
                5
              </div>
              <span className={`text-[10px] font-mono uppercase tracking-wider font-extrabold ${currentStep === 5 ? 'text-primary' : 'text-muted-foreground'}`}>Summary</span>
            </div>

          </div>
        </div>
      </div>

      {/* CORE ACTIVE VIEW CONTEXT */}
      <div className="min-h-[400px]">

        {/* STEP 1: TEST CONFIGURATION */}
        {currentStep === 1 && (
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-black flex items-center gap-2">
                    <Settings className="h-4.5 w-4.5 text-primary" />
                    General Test Configuration Parameters
                  </CardTitle>
                  <CardDescription>
                    Define structural attributes, course level limits, and grading boundaries.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  
                  {/* Test Name input */}
                  <div className="space-y-2">
                    <Label htmlFor="title-input">Test Name *</Label>
                    <Input
                      id="title-input"
                      required
                      placeholder="e.g. CCC Module 1: Comprehensive Shortcuts Examination"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                    />
                    <p className="text-[10px] text-muted-foreground">Keep the label clear so students quickly recognize it in dashboards.</p>
                  </div>

                  {/* Type select */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="type-select">Test Type</Label>
                      <Select
                        id="type-select"
                        value={testType}
                        onChange={(e) => setTestType(e.target.value as any)}
                      >
                        <option value="Benchmark">Benchmark Evaluation</option>
                        <option value="Practice Quiz">Practice Quiz Drill</option>
                        <option value="Unit Check">Unit Completion Test</option>
                        <option value="Term Exam">Term Examination</option>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration-input">Time Limit (In Minutes) *</Label>
                      <Input
                        id="duration-input"
                        type="number"
                        min="1"
                        placeholder="45"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Pass Marks and Pass Pct info */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="pass-marks-input">Pass Marks Threshold (%) *</Label>
                      <Input
                        id="pass-marks-input"
                        type="number"
                        min="10"
                        max="100"
                        placeholder="40"
                        value={passMarks}
                        onChange={(e) => setPassMarks(e.target.value)}
                      />
                    </div>

                    {/* Randomization switch block */}
                    <div className="p-3.5 bg-muted/20 border border-border/80 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5 pr-2">
                        <Label htmlFor="randomization-toggle" className="cursor-pointer block text-xs">Shuffle Questions</Label>
                        <span className="text-[10.5px] text-muted-foreground block line-clamp-1">Deliver randomized items per session</span>
                      </div>
                      <Checkbox
                        id="randomization-toggle"
                        checked={randomize}
                        onChange={(e) => setRandomize(e.target.checked)}
                        className="h-5 w-5 rounded-md border-primary cursor-pointer"
                      />
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>

            {/* Config Sidebar Hint tips */}
            <div className="space-y-4">
              <Card className="bg-muted/10">
                <CardHeader>
                  <CardTitle className="text-xs font-black uppercase tracking-widest font-mono text-primary flex items-center gap-1.5">
                    <Info className="h-4 w-4" />
                    Quality Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3.5 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    <strong>Time Limits:</strong> For computer literacy certifications like CCC, standard exam times range from 30 to 60 minutes with 40-50 MCQ models.
                  </p>
                  <p>
                    <strong>Passing Marks:</strong> The government passing criteria for certification is typically set at 50%, but you can adjust this specifically for practice drills.
                  </p>
                  <p>
                    <strong>Interactive Randomized Delivery:</strong> Forces students to attempt adjacent queries independently to avoid collaboration during on-site lab sessions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* STEP 2: QUESTION SELECTION */}
        {currentStep === 2 && (
          <div className="space-y-5 max-w-6xl mx-auto">
            <div className="grid gap-5 lg:grid-cols-4">
              
              {/* Left Column: Filter panel */}
              <div className="lg:col-span-1 space-y-4">
                <Card className="sticky top-20 bg-card">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xs font-black uppercase tracking-widest font-mono text-muted-foreground flex items-center gap-2">
                      <Compass className="h-4.5 w-4.5 text-primary" />
                      Question Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Filter text */}
                    <div className="space-y-1.5">
                      <Label htmlFor="q-search">Search text</Label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-3 h-3.5 w-3.5 text-muted-foreground/60" />
                        <Input
                          id="q-search"
                          placeholder="Search questions..."
                          className="pl-8 text-xs h-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Filter topic */}
                    <div className="space-y-1.5">
                      <Label htmlFor="q-topic">Filter by Topic</Label>
                      <Select
                        id="q-topic"
                        className="text-xs h-9"
                        value={topicFilter}
                        onChange={(e) => setTopicFilter(e.target.value)}
                      >
                        <option value="All">All Topics ({distinctTopics.length})</option>
                        {distinctTopics.map(topic => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </Select>
                    </div>

                    {/* Filter difficulty */}
                    <div className="space-y-1.5">
                      <Label htmlFor="q-diff">Difficulty Level</Label>
                      <Select
                        id="q-diff"
                        className="text-xs h-9"
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                      >
                        <option value="All">All Difficulties</option>
                        <option value="easy">Easy Basics</option>
                        <option value="medium">Medium Drills</option>
                        <option value="hard">Advanced Level</option>
                      </Select>
                    </div>

                    {/* Quick reset inside cards */}
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setTopicFilter('All');
                        setDifficultyFilter('All');
                      }}
                      className="w-full text-center text-xs text-primary hover:underline font-bold mt-2 cursor-pointer"
                    >
                      Clear Filter Criteria
                    </button>

                  </CardContent>
                </Card>
              </div>

              {/* Right Column: List selection table */}
              <div className="lg:col-span-3 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span>Showing {filteredQuestions.length} matched database MCQs</span>
                  <span>{selectedQuestionIds.length} currently selected</span>
                </div>

                {filteredQuestions.length === 0 ? (
                  <EmptyState
                    icon={BookOpen}
                    title="No questions fill this query"
                    description="Adjust search inputs or load different categories."
                  />
                ) : (
                  <div className="border border-border/80 rounded-2xl overflow-hidden bg-card shadow-xs">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/10">
                          <TableHead className="w-[48px] text-center">
                            <Checkbox
                              checked={filteredQuestions.length > 0 && filteredQuestions.every(q => selectedQuestionIds.includes(q.id))}
                              onChange={handleSelectAllQuestions}
                              className="cursor-pointer"
                              title="Toggle selection for all items in view"
                            />
                          </TableHead>
                          <TableHead className="text-xs py-3.5 pl-2">Question Content</TableHead>
                          <TableHead className="text-xs py-3.5">Topic tags</TableHead>
                          <TableHead className="text-xs py-3.5 text-center">Difficulty</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredQuestions.map((q) => {
                          const isChecked = selectedQuestionIds.includes(q.id);
                          
                          let difficultyColor = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400';
                          if (q.difficulty === 'medium') {
                            difficultyColor = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400';
                          } else if (q.difficulty === 'hard') {
                            difficultyColor = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400';
                          }

                          return (
                            <TableRow 
                              key={q.id}
                              onClick={() => handleToggleQuestionSelect(q.id)}
                              className={`cursor-pointer transition-colors ${isChecked ? 'bg-primary/[0.03] hover:bg-primary/[0.05]' : 'hover:bg-muted/30'}`}
                            >
                              <TableCell className="text-center p-3" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                  checked={isChecked}
                                  onChange={() => handleToggleQuestionSelect(q.id)}
                                  className="cursor-pointer"
                                />
                              </TableCell>
                              <TableCell className="p-3 pl-2 max-w-md">
                                <div className="space-y-1">
                                  <span className="font-bold text-xs text-foreground block leading-relaxed">
                                    {q.text}
                                  </span>
                                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                    {q.options.map((option, idx) => (
                                      <span key={idx} className={`text-[10px] px-1.5 py-0.5 rounded border border-border/55 ${idx === q.correctOptionIdx ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold' : 'bg-muted/30'}`}>
                                        {String.fromCharCode(65 + idx)}: {option}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="p-3">
                                <span className="flex flex-wrap gap-1">
                                  {q.tags.map((tag, tIdx) => (
                                    <Badge key={tIdx} variant="outline" className="text-[10px] font-semibold py-0">
                                      {tag}
                                    </Badge>
                                  ))}
                                </span>
                              </TableCell>
                              <TableCell className="p-3 text-center">
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full border text-[9px] uppercase tracking-wide font-extrabold ${difficultyColor}`}>
                                  {q.difficulty}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2 Sticky bottom summary element */}
            <div className="bg-card border-s-4 border-primary p-4 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-md border border-border/70">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                  <ListPlus className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-muted-foreground block">Blueprint Stats</span>
                  <div className="flex items-center gap-3 mt-1.5 text-xs">
                    <span className="text-foreground">Selected Query MCQs: <strong className="text-sm text-primary font-black">{selectedQuestionIds.length} Questions</strong></span>
                    <span className="text-muted-foreground font-semibold">|</span>
                    <span className="text-foreground">Estimated Difficulty Index: <strong className="text-muted-foreground">{estimatedDifficultyStr}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono font-bold">Total Weight: {selectedQuestionIds.length * 20} Marks</span>
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: ASSIGNMENT COHORT */}
        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-black flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-primary" />
                  Target Cohort Allocation
                </CardTitle>
                <CardDescription>
                  Allocate this mock series to specific study batches or pinpoint individual learners.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Batch selection dropdown */}
                <div className="space-y-1.5">
                  <Label htmlFor="batch-target">Assign to Student Batch Stream *</Label>
                  <Select
                    id="batch-target"
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                  >
                    {initialBatches.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.studentCount} active students)</option>
                    ))}
                  </Select>
                  <p className="text-[10px] text-muted-foreground mt-1">Swapping the batch automatically maps learners for simple checklists.</p>
                </div>

                {/* Specific Students list checklist matching responsive tables */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="flex justify-between items-center text-xs font-bold text-foreground">
                    <span>Choose Target Students ({selectedStudentIds.length} / {currentBatchStudents.length} selected)</span>
                    <button
                      type="button"
                      onClick={handleToggleAllStudentsOfBatch}
                      className="text-xs text-primary hover:underline font-extrabold cursor-pointer"
                    >
                      {selectedStudentIds.length === currentBatchStudents.length ? 'Deselect All' : 'Select All Class'}
                    </button>
                  </div>

                  <div className="border border-border rounded-xl divide-y divide-border/60 max-h-[250px] overflow-y-auto bg-card">
                    {currentBatchStudents.map((st) => {
                      const isStChecked = selectedStudentIds.includes(st.id);
                      return (
                        <div 
                          key={st.id} 
                          onClick={() => handleToggleStudentSelect(st.id)}
                          className="flex items-center justify-between p-3.5 hover:bg-muted/20 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={isStChecked}
                              onChange={() => handleToggleStudentSelect(st.id)}
                              className="cursor-pointer"
                            />
                            <div>
                              <span className="text-xs font-bold text-foreground block">{st.name}</span>
                              <span className="text-[10px] text-muted-foreground block">{st.email}</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <Badge variant="outline" className="text-[9px] uppercase font-mono py-0 font-bold">
                              Avg: {st.averageScore}%
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Only selected students will find this test visible in their personal student workspace panel pages.</p>
                </div>

              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 4: AVAILABILITY SCHEDULER */}
        {currentStep === 4 && (
          <div className="max-w-xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-black flex items-center gap-2">
                  <Calendar className="h-4.5 w-4.5 text-primary" />
                  Availability & Session Timing Window
                </CardTitle>
                <CardDescription>
                  Determine active submission slots so learners conform to precise scheduling targets.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                
                {/* Start input */}
                <div className="space-y-2">
                  <Label htmlFor="start-date">Session Activation Datetime *</Label>
                  <Input
                    id="start-date"
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">The test will transition from "Draft" status into "Active" automatically at this hour.</p>
                </div>

                {/* Ending input */}
                <div className="space-y-2">
                  <Label htmlFor="end-date">Submission Freeze Datetime *</Label>
                  <Input
                    id="end-date"
                    type="datetime-local"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground">Interactive attempts auto-freeze at this moment, rendering the status "Closed".</p>
                </div>

                <div className="p-3 border border-amber-500/20 bg-amber-500/[0.02] text-amber-700 dark:text-amber-400 rounded-xl flex items-start gap-2.5 text-xs">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-500 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Online Autopilot Module:</strong> System automatically executes countdown timelines. Ensure on-site lab computers conform to the standard Indian Standard Time (IST) zones.
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        )}

        {/* STEP 5: PREVIEW SCREEN */}
        {currentStep === 5 && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-4 bg-primary/[0.03] border border-primary/20 rounded-2xl flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary shrink-0" />
              <div>
                <span className="text-xs font-black text-foreground block">Publish Audit Preview Draft Ready</span>
                <span className="text-[11px] text-muted-foreground leading-normal block">Verify metrics, review randomized MCQs, and choose compile strategies below.</span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Detailed scorecard parameters */}
              <div className="md:col-span-2 space-y-6">
                
                {/* 1. Core Config details */}
                <Card>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider font-mono text-muted-foreground">Configuration Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Paper Title</span>
                        <strong className="text-foreground font-extrabold text-sm block mt-0.5">{testName}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Category</span>
                        <Badge variant="secondary" className="mt-1 font-extrabold">{testType}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-1">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Duration</span>
                        <span className="text-foreground font-bold font-mono block mt-0.5">{timeLimit} Minutes</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Pass Barrier</span>
                        <span className="text-foreground font-bold font-mono block mt-0.5">{passMarks}% Score</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">Randomize MCQs</span>
                        <span className="text-foreground font-bold block mt-0.5">{randomize ? 'ENABLED' : 'DISABLED'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 2. List of selected questions */}
                <Card>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider font-mono text-muted-foreground flex justify-between items-center">
                      <span>Selected Items ({selectedQuestionIds.length})</span>
                      <span className="text-xs font-semibold normal-case font-sans">Index matches database</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3.5">
                    {initialQuestions
                      .filter(q => selectedQuestionIds.includes(q.id))
                      .map((q, idx) => (
                        <div key={q.id} className="p-3.5 bg-muted/20 border border-border/40 rounded-xl text-xs space-y-1">
                          <div className="flex justify-between items-start gap-3">
                            <span className="font-extrabold text-foreground leading-relaxed">
                              {idx + 1}. {q.text}
                            </span>
                            <Badge variant="outline" className="shrink-0 text-[9px] uppercase font-black uppercase tracking-wide">
                              {q.difficulty}
                            </Badge>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono block">Topic: {q.tags.join(', ')}</span>
                        </div>
                      ))}
                  </CardContent>
                </Card>

              </div>

              {/* Sidebar Assignment & availability timing parameters */}
              <div className="space-y-6">
                
                {/* Targets */}
                <Card>
                  <CardHeader className="pb-2 border-b border-border/60">
                    <CardTitle className="text-xs font-black uppercase tracking-widest font-mono text-muted-foreground">Allocation Targets</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold">Cohorts Mapped</span>
                      <strong className="text-foreground font-bold text-xs mt-1 block">
                        {initialBatches.find(b => b.id === selectedBatchId)?.name || 'Default Batch'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold">Student Volume</span>
                      <strong className="text-foreground font-bold text-xs mt-1 block">
                        {selectedStudentIds.length} Targeted Learners Assigned
                      </strong>
                    </div>
                  </CardContent>
                </Card>

                {/* Timing */}
                <Card>
                  <CardHeader className="pb-2 border-b border-border/60">
                    <CardTitle className="text-xs font-black uppercase tracking-widest font-mono text-muted-foreground">Availability Window</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4 text-xs">
                    <div>
                      <span className="text-emerald-600 block text-[10px] uppercase font-bold">Start Activation</span>
                      <span className="text-foreground font-medium font-mono block mt-1">
                        {new Date(startDateTime).toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-rose-600 block text-[10px] uppercase font-bold">Closing Deadline</span>
                      <span className="text-foreground font-medium font-mono block mt-1">
                        {new Date(endDateTime).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER WIZARD ACTIONS ROW */}
      <div className="border-t border-border/70 pt-5 flex items-center justify-between">
        
        {/* Back control */}
        <button
          onClick={handleBackStep}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded-lg text-xs font-bold border border-border bg-card text-foreground hover:bg-muted transition-all cursor-pointer flex items-center gap-1 min-w-[85px] justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Wizard forward controls or submit strategies */}
        <div className="flex items-center gap-2">
          
          {currentStep < 5 ? (
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-lg text-xs font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              Next Step
              <ArrowRight className="h-4 w-4 stroke-[3]" />
            </button>
          ) : (
            <>
              {/* Save draft capability */}
              <button
                type="button"
                onClick={() => executeSubmissionAndNavigate('draft')}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold border border-border bg-background hover:bg-muted text-foreground transition-all cursor-pointer"
              >
                Save as Draft
              </button>

              {/* Publish directly to learners */}
              <button
                type="button"
                onClick={() => executeSubmissionAndNavigate('active')}
                className="px-5 py-2.5 rounded-lg text-xs font-black bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <CheckCircle className="h-4 w-4 stroke-[3]" />
                Publish Assessment
              </button>
            </>
          )}

        </div>

      </div>

    </PageContainer>
  );
}
