import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  UserCheck, 
  ChevronRight, 
  Mail, 
  Calendar, 
  Sparkles, 
  BookOpen, 
  Plus, 
  Upload, 
  ChevronLeft, 
  MoreVertical, 
  Edit, 
  UserMinus, 
  UserPlus, 
  Eye, 
  Check, 
  Phone, 
  Clock, 
  Sparkle,
  Filter,
  Users,
  Building,
  AlertTriangle,
  FileSpreadsheet,
  ArrowLeft,
  Send,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Award,
  PenSquare,
  MessageSquare,
  Trophy,
  Activity
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from 'recharts';
import { 
  TableWrapper, 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell, 
  Badge, 
  Input,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  EmptyState,
  Button,
  Modal,
  Separator
} from '../../components/ui/CustomComponents';
import { initialStudents, initialTestAttempts, initialBatches, initialTests } from '../../data';
import { Student } from '../../types';

// Declare extended student representation for visual fidelity
interface ExtendedStudent extends Student {
  mobile: string;
  course: string;
  examDate: string;
}

interface OwnerStudentsProps {
  onNavigate: (path: string) => void;
  selectedStudentId?: string;
  onSelectStudent: (id: string | undefined) => void;
}

export default function OwnerStudents({ onNavigate, selectedStudentId, onSelectStudent }: OwnerStudentsProps) {
  // ---------------------------------------------------------
  // CORE STATES
  // ---------------------------------------------------------
  const [search, setSearch] = React.useState('');
  const [batchFilter, setBatchFilter] = React.useState('all');
  const [courseFilter, setCourseFilter] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  // Real data state
  const [studentsList, setStudentsList] = React.useState<ExtendedStudent[]>(() => {
    const initialExtended = initialStudents.map((s, index) => {
      // Determine course stream
      let course = 'ADCA Diploma';
      if (s.batchId === 'batch-1') course = 'CCC Certification';
      else if (s.batchId === 'batch-2') course = 'DCA Diploma';
      else if (s.batchId === 'batch-4') course = 'O Level IT';

      // Mobile numbers mapping
      const mobileNumbers = [
        '+91 98123 45601',
        '+91 98123 45602',
        '+91 98123 45603',
        '+91 98123 45604',
        '+91 90512 78391',
        '+91 98765 43210'
      ];
      const mobile = mobileNumbers[index % mobileNumbers.length];

      // Target exam dates
      const examDates = [
        '2026-06-15',
        '2026-06-18',
        '2026-06-22',
        '2026-06-25'
      ];
      const examDate = examDates[index % examDates.length];

      return {
        ...s,
        mobile,
        course,
        examDate
      };
    });

    // Populate with 6 additional mock students to demonstrate beautiful pagination
    const extraExtended: ExtendedStudent[] = [
      { 
        id: 'st-7', 
        name: 'Sanya Malhotra', 
        email: 'sanya@resultbooster.com', 
        batchId: 'batch-3', 
        batchName: 'ADCA Evening Advanced', 
        testsAttempted: 14, 
        averageScore: 71.0, 
        joinedDate: '2026-02-14', 
        status: 'active', 
        weakSubjects: ['MS Excel - Sorting & Filtering', 'Internet - Web Protocols'], 
        mobile: '+91 98123 45607', 
        course: 'ADCA Diploma', 
        examDate: '2026-06-15' 
      },
      { 
        id: 'st-8', 
        name: 'Rohan Mehra', 
        email: 'rohan@resultbooster.com', 
        batchId: 'batch-4', 
        batchName: 'O Level Programming Cohort', 
        testsAttempted: 10, 
        averageScore: 87.5, 
        joinedDate: '2026-03-22', 
        status: 'active', 
        weakSubjects: ['Programming - Python Syntax & Lists'], 
        mobile: '+91 98123 45608', 
        course: 'O Level IT', 
        examDate: '2026-06-18' 
      },
      { 
        id: 'st-9', 
        name: 'Neha Kakkar', 
        email: 'neha@resultbooster.com', 
        batchId: 'batch-2', 
        batchName: 'DCA Regular Batch B', 
        testsAttempted: 3, 
        averageScore: 58.2, 
        joinedDate: '2026-04-10', 
        status: 'active', 
        weakSubjects: ['MS Access - Database Queries'], 
        mobile: '+91 98123 45609', 
        course: 'DCA Diploma', 
        examDate: '2026-06-22' 
      },
      { 
        id: 'st-10', 
        name: 'Aditya Roy', 
        email: 'aditya@resultbooster.com', 
        batchId: 'batch-1', 
        batchName: 'CCC Morning Batch A', 
        testsAttempted: 5, 
        averageScore: 62.1, 
        joinedDate: '2026-04-12', 
        status: 'active', 
        weakSubjects: ['MS Word - Page Design & Headers'], 
        mobile: '+91 98123 45610', 
        course: 'CCC Certification', 
        examDate: '2026-06-25' 
      },
      { 
        id: 'st-11', 
        name: 'Priyanka Chopra', 
        email: 'priyanka@resultbooster.com', 
        batchId: 'batch-4', 
        batchName: 'O Level Programming Cohort', 
        testsAttempted: 12, 
        averageScore: 94.2, 
        joinedDate: '2026-02-28', 
        status: 'inactive', 
        weakSubjects: ['O Level - Binary & Logic Operations'], 
        mobile: '+91 98123 45611', 
        course: 'O Level IT', 
        examDate: '2026-06-15' 
      },
      { 
        id: 'st-12', 
        name: 'Ranbir Kapoor', 
        email: 'ranbir@resultbooster.com', 
        batchId: 'batch-3', 
        batchName: 'ADCA Evening Advanced', 
        testsAttempted: 2, 
        averageScore: 39.0, 
        joinedDate: '2026-05-01', 
        status: 'active', 
        weakSubjects: ['Computer Fundamentals - Device Storage'], 
        mobile: '+91 98123 45612', 
        course: 'ADCA Diploma', 
        examDate: '2026-06-18' 
      }
    ];

    return [...initialExtended, ...extraExtended];
  });

  // ---------------------------------------------------------
  // INTERRUPT MODAL STATES
  // ---------------------------------------------------------
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState<ExtendedStudent | null>(null);
  
  // New student form states
  const [newName, setNewName] = React.useState('');
  const [newEmail, setNewEmail] = React.useState('');
  const [newMobile, setNewMobile] = React.useState('');
  const [newBatchId, setNewBatchId] = React.useState('batch-1');
  const [newCourse, setNewCourse] = React.useState('CCC Certification');
  
  // Inline feedback notification
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // High-fidelity student profile details state controllers
  const [isAssignTestOpen, setIsAssignTestOpen] = React.useState(false);
  const [selectedTestToAssign, setSelectedTestToAssign] = React.useState('test-1');
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = React.useState(false);
  const [activeProfileTab, setActiveProfileTab] = React.useState('performance'); // 'performance' | 'curriculum'
  const [newNoteText, setNewNoteText] = React.useState('');
  const [newNoteCategory, setNewNoteCategory] = React.useState('academic'); // academic, behavior, critical, encouraging
  const [studentNotes, setStudentNotes] = React.useState<Record<string, { id: string, text: string, category: string, date: string, author: string }[]>>(() => {
    try {
      const saved = localStorage.getItem('owner_student_notes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      'st-1': [
        { id: 'n-1', text: 'Struggled on Excel Charts and Pivot Tables. Advised to attend the weekend lab practical sessions.', category: 'academic', date: '2026-05-24', author: 'Principal Administrator' },
        { id: 'n-2', text: 'Excellent participation in CCC Windows keyboard shortcut drills. High speed on operations.', category: 'behavior', date: '2026-05-18', author: 'Senior Office Faculty' }
      ],
      'st-2': [
        { id: 'n-3', text: 'Critical gaps identified in O Level Python condition loops. Requires focused lab coding hours.', category: 'critical', date: '2026-05-25', author: 'Programming Faculty' }
      ],
      'st-3': [
        { id: 'n-4', text: 'Near flawless test scores in CCC computer fundamentals. Highly motivated, recommended for advanced DCA certification.', category: 'encouraging', date: '2026-05-26', author: 'CCC Batch Head' }
      ],
      'st-4': [
        { id: 'n-5', text: 'High risk: Student has missed 3 consecutive MS Excel advanced formulas labs. Automatic alarm alert triggered.', category: 'critical', date: '2026-05-22', author: 'Institute Counselor' }
      ],
      'st-5': [
        { id: 'n-6', text: 'Superb Excel chart drawing speed. Keep sustaining fast mock evaluations.', category: 'encouraging', date: '2026-05-20', author: 'Office Tools Head' }
      ],
      'st-6': [
        { id: 'n-7', text: 'Showing steady progress in net subnetting basics but needs LibreOffice Writer formatting reinforcement.', category: 'academic', date: '2026-05-25', author: 'DCA Faculty' }
      ]
    };
  });

  const handleAddNote = (stId: string) => {
    if (!newNoteText.trim()) return;
    const noteObj = {
      id: `n-${Date.now()}`,
      text: newNoteText,
      category: newNoteCategory,
      date: new Date().toISOString().split('T')[0],
      author: 'Principal Administrator'
    };
    const updated = {
      ...studentNotes,
      [stId]: [noteObj, ...(studentNotes[stId] || [])]
    };
    setStudentNotes(updated);
    try {
      localStorage.setItem('owner_student_notes', JSON.stringify(updated));
    } catch (e) {}
    setNewNoteText('');
    triggerToast('Teacher note added successfully!');
  };

  const handleAssignTest = (stId: string, testId: string) => {
    const matchedTest = initialTests.find(t => t.id === testId);
    triggerToast(`Practice Test "${matchedTest?.title || 'Advanced Drill'}" assigned successfully to student.`);
    setIsAssignTestOpen(false);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Reset page when inputs adjust
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, batchFilter, courseFilter]);

  // Handle outside dropdown interactions
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // ---------------------------------------------------------
  // FILTER STRATEGY
  // ---------------------------------------------------------
  const filteredStudents = studentsList.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(search.toLowerCase()) || 
      student.email.toLowerCase().includes(search.toLowerCase()) ||
      student.mobile.includes(search);

    const matchesBatch = batchFilter === 'all' || student.batchId === batchFilter;
    const matchesCourse = courseFilter === 'all' || student.course === courseFilter;

    return matchesSearch && matchesBatch && matchesCourse;
  });

  // Pagination bounds
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Dynamic values helper list
  const uniqueCourses = ['CCC Certification', 'DCA Diploma', 'ADCA Diploma', 'O Level IT'];

  // ---------------------------------------------------------
  // CRUD OPERATIONS
  // ---------------------------------------------------------
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      triggerToast('Err: Name and Email coordinates are mandatory');
      return;
    }

    const selectedBatch = initialBatches.find(b => b.id === newBatchId) || initialBatches[0];

    const newStudent: ExtendedStudent = {
      id: `st-${Date.now()}`,
      name: newName,
      email: newEmail,
      batchId: newBatchId,
      batchName: selectedBatch.name,
      testsAttempted: 0,
      averageScore: 100, // starting clean status
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      weakSubjects: ['Pending Assessment Logs'],
      mobile: newMobile || '+91 90000 00000',
      course: newCourse,
      examDate: '2026-06-30'
    };

    setStudentsList(prev => [newStudent, ...prev]);
    setIsAddOpen(false);
    
    // Clear state inputs
    setNewName('');
    setNewEmail('');
    setNewMobile('');
    
    triggerToast(`Added ${newStudent.name} successfully to ${newStudent.batchName}!`);
  };

  const handleEditStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const selectedBatch = initialBatches.find(b => b.id === editingStudent.batchId) || initialBatches[0];
    
    // Auto sync course based on selected batch for cohesive diagnostics
    let derivedCourse = 'ADCA Diploma';
    if (editingStudent.batchId === 'batch-1') derivedCourse = 'CCC Certification';
    else if (editingStudent.batchId === 'batch-2') derivedCourse = 'DCA Diploma';
    else if (editingStudent.batchId === 'batch-4') derivedCourse = 'O Level IT';

    const updated = {
      ...editingStudent,
      batchName: selectedBatch.name,
      course: derivedCourse
    };

    setStudentsList(prev => prev.map(s => s.id === updated.id ? updated : s));
    setEditingStudent(null);
    triggerToast(`Profile coordinates updated for ${updated.name}!`);
  };

  const handleToggleDeactivate = (studentId: string) => {
    setStudentsList(prev => prev.map(s => {
      if (s.id === studentId) {
        const nextStatus = s.status === 'active' ? 'inactive' : 'active';
        triggerToast(`Status changed: ${s.name} is now ${nextStatus.toUpperCase()}`);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
    setActiveDropdownId(null);
  };

  // Drag and drop CSV simulated trigger
  const [isCsvDragging, setIsCsvDragging] = React.useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCsvDragging(true);
  };
  const handleDragLeave = () => {
    setIsCsvDragging(false);
  };
  const handleDropCsvSimulated = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCsvDragging(false);
    handleLoadSampleCSV();
  };

  const handleLoadSampleCSV = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      const importedStudents: ExtendedStudent[] = [
        {
          id: 'st-imp-1',
          name: 'Vikram Sethi',
          email: 'vikram.sethi@gmail.com',
          batchId: 'batch-1',
          batchName: 'CCC Morning Batch A',
          testsAttempted: 4,
          averageScore: 59.5,
          joinedDate: '2026-05-20',
          status: 'active',
          weakSubjects: ['Computer Fundamentals & OS'],
          mobile: '+91 97654 32111',
          course: 'CCC Certification',
          examDate: '2026-06-25'
        },
        {
          id: 'st-imp-2',
          name: 'Meera Nair',
          email: 'meera.nair@hotmail.com',
          batchId: 'batch-2',
          batchName: 'DCA Regular Batch B',
          testsAttempted: 8,
          averageScore: 84.0,
          joinedDate: '2026-05-18',
          status: 'active',
          weakSubjects: ['MS Excel Advanced Formulas'],
          mobile: '+91 91234 50987',
          course: 'DCA Diploma',
          examDate: '2026-06-22'
        }
      ];

      setStudentsList(prev => [...importedStudents, ...prev]);
      setIsImportOpen(false);
      triggerToast('Parsed and merged 2 student rows from CSV successfully!');
    }, 900);
  };

  // ---------------------------------------------------------
  // COMPONENT RENDERING ROUTER
  // ---------------------------------------------------------
  const activeStudent = studentsList.find(s => s.id === selectedStudentId);
  const studentAttempts = activeStudent ? initialTestAttempts.filter(att => att.studentId === activeStudent.id) : [];

  return (
    <div className="space-y-6 lg:space-y-8 animate-fade-in pb-12 font-sans" ref={dropdownRef}>
      
      {/* Toast alert display */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl border border-primary/20 bg-card text-foreground shadow-lg flex items-center gap-2.5 animate-slide-in">
          <Sparkle className="h-4.5 w-4.5 text-primary animate-pulse shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* RENDER MODE A: LIST VIEW */}
      {!selectedStudentId ? (
        <div className="space-y-6">
          
          {/* TOP SECTION: Page Title & Actions */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-5">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                <Users className="h-7 w-7 text-primary shrink-0" />
                Students Roster
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
                Coordinate candidate profile logs, examine contact credentials, edit stream batches, and manage active diagnostic subscriptions.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsImportOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-border bg-card hover:bg-accent text-foreground text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5 text-muted-foreground" />
                Import CSV
              </button>

              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-extrabold rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Student
              </button>
            </div>
          </div>

          {/* TOOLBAR FOR CONTROLS & QUERY FILTERING */}
          <Card className="border border-border/80 p-4 bg-muted/20">
            <div className="grid gap-3 md:grid-cols-12 items-center">
              
              {/* Search text input */}
              <div className="relative md:col-span-6">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
                <Input
                  placeholder="Query students by name, email or mobile number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs focus-visible:ring-primary placeholder:text-muted-foreground bg-background"
                />
              </div>

              {/* Filter Batch Dropdown select */}
              <div className="md:col-span-3">
                <div className="relative">
                  <Select
                    value={batchFilter}
                    onChange={(e) => setBatchFilter(e.target.value)}
                    className="h-9 text-xs bg-background"
                  >
                    <option value="all">📁 Filter by Classroom Batch (All)</option>
                    {initialBatches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Filter Course stream select */}
              <div className="md:col-span-3">
                <div className="relative">
                  <Select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="h-9 text-xs bg-background"
                  >
                    <option value="all">🔥 Filter by Course Stream (All)</option>
                    {uniqueCourses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </Select>
                </div>
              </div>

            </div>
          </Card>

          {/* STUDENT DATA TABLE PANEL */}
          {paginatedStudents.length > 0 ? (
            <div className="space-y-4">
              <TableWrapper
                title="SaaS Student Cohort Entries"
                description={`Showing ${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, filteredStudents.length)} of ${filteredStudents.length} candidates parsed`}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[220px]">Candidate Details</TableHead>
                      <TableHead>Mobile Phone</TableHead>
                      <TableHead>Assigned Batch</TableHead>
                      <TableHead>Stream Course</TableHead>
                      <TableHead className="text-center">Mean Score</TableHead>
                      <TableHead>Risk Status</TableHead>
                      <TableHead>Target Exam</TableHead>
                      <TableHead className="text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStudents.map((student) => {
                      const isAtCriticalRisk = student.averageScore < 60;
                      const isAtModerateRisk = student.averageScore >= 60 && student.averageScore < 75;
                      const isAtLowRisk = student.averageScore >= 75;

                      return (
                        <TableRow key={student.id} className="hover:bg-muted/20">
                          
                          {/* Columns: Name & Details */}
                          <TableCell className="align-middle">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs uppercase border border-primary/25">
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-foreground text-xs block leading-none">{student.name}</span>
                                <span className="text-[10px] text-muted-foreground font-mono mt-0.5 block">{student.email}</span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Mobile */}
                          <TableCell className="align-middle text-xs font-medium text-foreground">
                            <span className="flex items-center gap-1 font-mono">
                              <Phone className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                              {student.mobile}
                            </span>
                          </TableCell>

                          {/* Batch */}
                          <TableCell className="align-middle text-xs text-muted-foreground font-semibold max-w-[150px] truncate" title={student.batchName}>
                            {student.batchName}
                          </TableCell>

                          {/* Course Stream */}
                          <TableCell className="align-middle">
                            <Badge variant="outline" className="text-[9px] uppercase font-mono font-bold leading-none bg-muted/40">
                              {student.course}
                            </Badge>
                          </TableCell>

                          {/* Latest / Average Score */}
                          <TableCell className="align-middle text-center font-mono text-xs font-black">
                            <span className={isAtCriticalRisk ? 'text-destructive' : 'text-foreground'}>
                              {student.averageScore}%
                            </span>
                          </TableCell>

                          {/* Risk Status Badging */}
                          <TableCell className="align-middle">
                            {isAtCriticalRisk && (
                              <Badge variant="destructive" className="text-[8px] px-2 py-0 uppercase font-black tracking-wide">
                                CRT Risk
                              </Badge>
                            )}
                            {isAtModerateRisk && (
                              <Badge className="text-[8px] px-2 py-0 uppercase font-black tracking-wide border-transparent text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400">
                                Moderate
                              </Badge>
                            )}
                            {isAtLowRisk && (
                              <Badge variant="success" className="text-[8px] px-2 py-0 uppercase font-black tracking-wide">
                                Low Risk
                              </Badge>
                            )}
                          </TableCell>

                          {/* Target Exam Date */}
                          <TableCell className="align-middle text-xs font-mono text-muted-foreground">
                            {student.examDate}
                          </TableCell>

                          {/* Actions Coordinates Dropdown */}
                          <TableCell className="text-right align-middle relative pr-4">
                            <div className="inline-block text-left">
                              <button
                                type="button"
                                onClick={() => setActiveDropdownId(activeDropdownId === student.id ? null : student.id)}
                                className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer transition-all active:scale-95"
                                title="Open actions menu"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>

                              {activeDropdownId === student.id && (
                                <div className="absolute right-0 z-50 mt-1 w-44 rounded-xl border border-border bg-card p-1 text-card-foreground shadow-md">
                                  {/* View Profile */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onSelectStudent(student.id);
                                      setActiveDropdownId(null);
                                    }}
                                    className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-accent text-foreground text-left cursor-pointer"
                                  >
                                    <Eye className="h-3.5 w-3.5 text-primary" />
                                    View Timeline Profile
                                  </button>

                                  {/* Edit Profile */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingStudent(student);
                                      setActiveDropdownId(null);
                                    }}
                                    className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-accent text-foreground text-left cursor-pointer"
                                  >
                                    <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                                    Edit Coordinate
                                  </button>

                                  {/* Deactivate / Activate Student Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleDeactivate(student.id)}
                                    className="flex w-full items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-accent text-left cursor-pointer"
                                  >
                                    {student.status === 'active' ? (
                                      <>
                                        <UserMinus className="h-3.5 w-3.5 text-destructive" />
                                        <span className="text-destructive font-bold">Deactivate Student</span>
                                      </>
                                    ) : (
                                      <>
                                        <UserPlus className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Activate Student</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </TableCell>

                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableWrapper>

              {/* PAGINATION HUD */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 pb-8 select-none">
                <span className="text-xs text-muted-foreground font-mono">
                  Showing entries <strong>{startIndex + 1}</strong> to <strong>{Math.min(startIndex + itemsPerPage, filteredStudents.length)}</strong> of <strong>{filteredStudents.length}</strong> parameters mapped
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-accent disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 w-8 text-xs font-black rounded-lg transition-all cursor-pointer ${
                          currentPage === pageNum 
                            ? 'bg-primary text-primary-foreground shadow-sm' 
                            : 'border border-border bg-card hover:bg-accent text-foreground'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-accent disabled:opacity-50 transition-all cursor-pointer"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <EmptyState
              icon={UserCheck}
              title="No students matched search constraints"
              description="Your filters found no learners in active memory index. Adjust search queries or append a new candidate profile."
              actionLabel="Reset Active Query Filters"
              onAction={() => {
                setSearch('');
                setBatchFilter('all');
                setCourseFilter('all');
              }}
            />
          )}

        </div>
      ) : activeStudent ? (() => {
        // Local programmatic resolver (IIFE) for deep student metrics
        const getStudentTopics = () => {
          if (activeStudent.course.includes('CCC')) {
            return [
              { name: 'Computer Fundamentals & Windows OS', accuracy: activeStudent.id === 'st-2' ? 45 : 88, subject: 'Fundamentals' },
              { name: 'MS Word & Text Formatting', accuracy: activeStudent.id === 'st-2' ? 41 : 76, subject: 'Word' },
              { name: 'LibreOffice Writer Operations', accuracy: activeStudent.id === 'st-1' ? 62 : 82, subject: 'LibreOffice' },
              { name: 'MS PowerPoint Presentation basics', accuracy: activeStudent.id === 'st-2' ? 38 : 58, subject: 'PPT' },
              { name: 'Basic Keyboard Shortcuts & Controls', accuracy: activeStudent.id === 'st-1' ? 52 : 79, subject: 'Shortcuts' },
            ];
          } else if (activeStudent.course.includes('DCA')) {
            return [
              { name: 'MS Excel Advanced Formulas', accuracy: activeStudent.id === 'st-4' ? 42 : 91, subject: 'Excel' },
              { name: 'Web Browsing & Internet protocols', accuracy: activeStudent.id === 'st-4' ? 45 : 78, subject: 'Internet' },
              { name: 'MS Access Database basics', accuracy: activeStudent.id === 'st-3' ? 88 : 61, subject: 'Database' },
              { name: 'Hardware & Basic Storage Units', accuracy: activeStudent.id === 'st-4' ? 51 : 68, subject: 'Fundamentals' },
            ];
          } else if (activeStudent.course.includes('O Level')) {
            return [
              { name: 'Programming in Python Syntax', accuracy: activeStudent.id === 'st-11' ? 54 : 94, subject: 'Python' },
              { name: 'Internet Technology & Protocols', accuracy: activeStudent.id === 'st-8' ? 45 : 87, subject: 'Networking' },
              { name: 'Digital logic gates & Number System', accuracy: activeStudent.id === 'st-7' ? 48 : 82, subject: 'Fundamentals' },
            ];
          } else {
            return [
              { name: 'MS Excel Advanced Queries', accuracy: activeStudent.id === 'st-12' ? 32 : 82, subject: 'Excel' },
              { name: 'Database Keys & Field indexes', accuracy: activeStudent.id === 'st-12' ? 45 : 79, subject: 'Database' },
              { name: 'C Programming Loop statements', accuracy: activeStudent.id === 'st-5' ? 85 : 54, subject: 'C Language' },
            ];
          }
        };

        const studentTopicsList = getStudentTopics();
        const weakTopics = studentTopicsList.filter(t => t.accuracy < 60);
        const strengthAreas = studentTopicsList.filter(t => t.accuracy >= 75);

        // Score trend historical dates mapping
        const baseScore = activeStudent.averageScore;
        const scoreTrendData = [
          { name: 'Mock 1', score: Math.round(baseScore * 0.88 > 100 ? 100 : baseScore * 0.88) },
          { name: 'Mock 2', score: Math.round(baseScore * 0.95 > 100 ? 100 : baseScore * 0.95) },
          { name: 'Mock 3', score: Math.round(baseScore * 1.04 > 100 ? 100 : baseScore * 1.04) },
          { name: 'Mock 4', score: Math.round(baseScore * 0.92 > 100 ? 100 : baseScore * 0.92) },
          { name: 'Mock 5', score: Math.round(baseScore) },
        ];

        // Custom list of continuous attempts history
        const getAttemptsHistory = () => {
          const realAttempts = studentAttempts;
          const generatedAttempts = [
            {
              id: `att-gen-1-${activeStudent.id}`,
              testTitle: activeStudent.course.includes('CCC') ? 'CCC Fundamentals & Windows Mock Test' : activeStudent.course.includes('DCA') ? 'DCA Excel Formula Mastery Quiz' : 'General Computer Mock Examination',
              submittedAt: '2026-05-22',
              score: Math.round(activeStudent.averageScore),
              maxScore: 100,
              durationMinutes: 45,
              status: activeStudent.averageScore >= 75 ? 'Passed' : activeStudent.averageScore >= 55 ? 'Needs Review' : 'Critical Help'
            },
            {
              id: `att-gen-2-${activeStudent.id}`,
              testTitle: activeStudent.course.includes('CCC') ? 'LibreOffice Writer Shortcuts Drill' : 'Hardware & Networking Standard Assessment',
              submittedAt: '2026-05-15',
              score: Math.round(activeStudent.averageScore * 0.95),
              maxScore: 100,
              durationMinutes: 52,
              status: activeStudent.averageScore * 0.95 >= 75 ? 'Passed' : activeStudent.averageScore * 0.95 >= 55 ? 'Needs Review' : 'Critical Help'
            },
            {
              id: `att-gen-3-${activeStudent.id}`,
              testTitle: 'All-India Mock Computer Certification Quiz V',
              submittedAt: '2026-05-08',
              score: Math.round(activeStudent.averageScore * 1.04 > 100 ? 100 : activeStudent.averageScore * 1.04),
              maxScore: 100,
              durationMinutes: 60,
              status: activeStudent.averageScore * 1.04 >= 75 ? 'Passed' : activeStudent.averageScore * 1.04 >= 55 ? 'Needs Review' : 'Critical Help'
            }
          ];

          return realAttempts.length > 0 
            ? [
                ...realAttempts.map(ra => ({
                  id: ra.id,
                  testTitle: ra.testTitle,
                  submittedAt: ra.submittedAt,
                  score: ra.score,
                  maxScore: ra.maxScore,
                  durationMinutes: Math.round(ra.durationSeconds / 60),
                  status: ra.score >= 75 ? 'Passed' : ra.score >= 55 ? 'Needs Review' : 'Critical Help'
                })),
                ...generatedAttempts.slice(realAttempts.length)
              ]
            : generatedAttempts;
        };

        const attemptsHistoryList = getAttemptsHistory();
        const parentContact = activeStudent.mobile.replace(/\s\d{2}$/, ' 88');
        const notesList = studentNotes[activeStudent.id] || [];
        const readinessRate = Math.max(30, Math.min(98, Math.round(activeStudent.averageScore * 1.08)));
        const consistencyPercent = Math.max(50, Math.min(100, Math.round(activeStudent.testsAttempted / 15 * 100)));

        // Exam countdown calculation
        const examDateObj = new Date(activeStudent.examDate);
        const currentDate = new Date('2026-05-28');
        const diffDays = Math.ceil((examDateObj.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        const countdownText = diffDays > 0 ? `${diffDays} days left` : 'Completed';

        return (
          <div className="space-y-6">
            
            {/* SUB-HEADER & NAVIGATION */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectStudent(undefined)}
                    className="inline-flex items-center justify-center p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer"
                    title="Back to students roster"
                    id="back-to-roster-btn"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">{activeStudent.name}</h1>
                  <Badge variant={activeStudent.status === 'active' ? 'success' : 'outline'} className="ml-1.5 uppercase font-mono tracking-wider text-[9px]">
                    {activeStudent.status === 'active' ? 'Active Learner' : 'Deactivated'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Deep analytical profile and exam readiness vector for Candidate ID: <code className="font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">{activeStudent.id}</code>
                </p>
              </div>

              {/* QUICK ACTIONS ROW */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAssignTestOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
                  id="quick-assign-test"
                >
                  <PlusCircle className="h-3.5 w-3.5 text-primary" />
                  <span>Assign Test</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const el = document.getElementById('new-teacher-note-textarea');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      el.focus();
                    } else {
                      triggerToast("Form editor linked below under details card.");
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
                  id="quick-add-note"
                >
                  <PenSquare className="h-3.5 w-3.5 text-amber-500" />
                  <span>Add Note</span>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsWhatsAppModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white border-transparent inline-flex items-center gap-1.5 text-xs font-extrabold cursor-pointer shrink-0 shadow-sm"
                  id="quick-whatsapp-report"
                >
                  <MessageSquare className="h-3.5 w-3.5 fill-current text-white" />
                  <span>WhatsApp Report</span>
                </Button>
              </div>
            </div>

            {/* TOP CARD: PRIMARY DATA IDENTIFICATION HEADER */}
            <Card className="overflow-hidden border border-border bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  
                  {/* Left Avatar Profile Metadata */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="h-16 w-16 bg-primary/10 text-primary border border-primary/20 rounded-2xl flex items-center justify-center font-black text-2xl uppercase shadow-xs shrink-0 select-none">
                      {activeStudent.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 font-sans font-medium tracking-tight">
                        <h2 className="text-xl font-bold tracking-tight text-foreground leading-none">{activeStudent.name}</h2>
                        
                        {/* Risk level badge */}
                        <Badge 
                          variant={
                            activeStudent.averageScore < 60 
                              ? 'destructive' 
                              : activeStudent.averageScore < 75 
                                ? 'default' 
                                : 'success'
                          }
                          className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5"
                        >
                          {activeStudent.averageScore < 60 
                            ? 'CRT RISK' 
                            : activeStudent.averageScore < 75 
                              ? 'MODERATE RISK' 
                              : 'LOW RISK'
                          }
                        </Badge>
                      </div>
                      
                      {/* Contacts list inline */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground pt-0.5">
                        <div className="flex items-center gap-1 h-5">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground/50" />
                          <span className="font-mono text-foreground font-semibold">{activeStudent.mobile}</span>
                        </div>
                        <div className="flex items-center gap-1 border-l border-border pl-4 h-5">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground/50" />
                          <span className="font-mono">{activeStudent.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Program Identifiers grid alignment */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-4 lg:gap-8 w-full lg:w-auto border-t lg:border-t-0 border-border pt-4 lg:pt-0">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground block uppercase font-black tracking-wider">Cohort Batch</span>
                      <span className="text-xs font-bold text-foreground block">{activeStudent.batchName}</span>
                    </div>
                    
                    <div className="space-y-0.5 border-l border-border pl-4">
                      <span className="text-[10px] text-muted-foreground block uppercase font-black tracking-wider">Course Stream</span>
                      <span className="text-xs font-bold text-foreground block">{activeStudent.course}</span>
                    </div>

                    <div className="space-y-0.5 border-l border-border pl-4">
                      <span className="text-[10px] text-muted-foreground block uppercase font-black tracking-wider">Exam Target</span>
                      <span className="text-xs font-bold text-foreground block font-mono">{activeStudent.examDate}</span>
                    </div>

                    <div className="space-y-0.5 border-l border-border pl-4">
                      <span className="text-[10px] text-muted-foreground block uppercase font-black tracking-wider">Time Window</span>
                      <span className="block mt-0.5">
                        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary font-black text-[9px] font-mono tracking-wide px-2 py-0">
                          {countdownText}
                        </Badge>
                      </span>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* MAIN TWO COLUMN SYSTEM GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT SIDE: PERFORMANCE ANALYTICS */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* PROGRAMMATIC TAB SWITCHER */}
                <div className="flex border-b border-border bg-muted/20 p-1 rounded-xl gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveProfileTab('performance')}
                    className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeProfileTab === 'performance'
                        ? 'bg-card text-foreground shadow-xs border border-border/60'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Performance Diagnostics
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProfileTab('curriculum')}
                    className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeProfileTab === 'curriculum'
                        ? 'bg-card text-foreground shadow-xs border border-border/60'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Curriculum Matrix & Interventions
                  </button>
                </div>

                {/* TAB BUFFER A: PERFORMANCE INSIGHTS */}
                {activeProfileTab === 'performance' && (
                  <div className="space-y-6">
                    
                    {/* SECTION 1: SCORE TREND CHART */}
                    <Card id="score-trend-chart-card">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                          <CardTitle className="text-sm font-bold flex items-center gap-1.5 flex flex-row font-sans text-gray-900">
                            <Activity className="h-4 w-4 text-primary" />
                            Score Acceleration Curvature
                          </CardTitle>
                          <CardDescription className="text-xs">Continuous evaluation trends charted across the last 5 benchmark test intervals</CardDescription>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          ▲ 4.2% acceleration
                        </span>
                      </CardHeader>
                      <CardContent>
                        
                        <div className="h-[220px] w-full pt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={scoreTrendData}
                              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                              <defs>
                                <linearGradient id={`chartColorPrimary-${activeStudent.id}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25}/>
                                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                              <XAxis 
                                dataKey="name" 
                                stroke="hsl(var(--muted-foreground))" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                              />
                              <YAxis 
                                stroke="hsl(var(--muted-foreground))" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                domain={[0, 100]}
                                tickFormatter={(val) => `${val}%`}
                              />
                              <RechartsTooltip 
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--card))', 
                                  borderColor: 'hsl(var(--border))',
                                  borderRadius: '0.75rem',
                                  fontSize: '11px',
                                  color: 'hsl(var(--foreground))'
                                }} 
                              />
                              <Area 
                                type="monotone" 
                                dataKey="score" 
                                stroke="hsl(var(--primary))" 
                                strokeWidth={2.5}
                                fillOpacity={1} 
                                fill={`url(#chartColorPrimary-${activeStudent.id})`} 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Trend analysis descriptors */}
                        <div className="grid grid-cols-3 gap-4 border-t border-border/80 pt-4 mt-2 text-center font-mono">
                          <div>
                            <span className="text-[9px] text-muted-foreground uppercase block">Mean Accuracy</span>
                            <span className="text-sm font-black text-foreground">{activeStudent.averageScore}%</span>
                          </div>
                          <div className="border-l border-border">
                            <span className="text-[9px] text-muted-foreground uppercase block">Peak Score Mapped</span>
                            <span className="text-sm font-black text-foreground">
                              {Math.max(...scoreTrendData.map(d => d.score))}%
                            </span>
                          </div>
                          <div className="border-l border-border font-bold text-center">
                            <span className="text-[9px] text-muted-foreground uppercase block">Deviation Risk</span>
                            <span className="text-sm text-amber-600 block">Minimal</span>
                          </div>
                        </div>

                      </CardContent>
                    </Card>

                    {/* SECTION 2: EXAM READINESS DIAGNOSTIC CARD */}
                    <Card id="exam-readiness-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-1.5 flex flex-row font-sans text-gray-900">
                          <Award className="h-4 w-4 text-emerald-600" />
                          Benchmarked Exam Readiness Diagnostic
                        </CardTitle>
                        <CardDescription className="text-xs">Predictive metrics calculated against competitive percentiles for {activeStudent.course}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        
                        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl border border-border bg-muted/10">
                          
                          {/* Circle Gauge bar */}
                          <div className="relative h-20 w-20 flex-shrink-0 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-muted-foreground/20"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="text-primary"
                                strokeDasharray={`${readinessRate}, 100`}
                                strokeWidth="3"
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center text-center font-mono">
                              <span className="text-lg font-black text-foreground leading-none">{readinessRate}%</span>
                              <span className="text-[8px] text-muted-foreground uppercase font-semibold">index</span>
                            </div>
                          </div>

                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground">Status Descriptor:</span>
                              <Badge 
                                variant={readinessRate >= 75 ? 'success' : readinessRate >= 50 ? 'default' : 'destructive'}
                                className="text-[10px] font-mono px-2 py-0"
                              >
                                {readinessRate >= 75 ? 'Competent Core' : readinessRate >= 50 ? 'Moderate Diagnostic Needs' : 'Priority Attention'}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-normal font-sans">
                              {readinessRate >= 75 
                                ? "Candidate shows mature learning loops and excellent retrieval index. Core target coordinates are secure." 
                                : readinessRate >= 50 
                                  ? "Candidate displays basic stream competence, but moderate gap-risks exist in high-depth assessment parameters." 
                                  : "Critical stream gap alerts are active. Immediate practice reassignments and curriculum intervention needed."
                              }
                            </p>
                          </div>
                        </div>

                        {/* Detail Checklist requirements */}
                        <div className="space-y-2 pt-1 text-xs text-muted-foreground">
                          <span className="font-semibold text-foreground text-xs block">Diagnostic Validation Checklists:</span>
                          
                          <div className="grid gap-2 sm:grid-cols-2">
                            <div className="flex items-start gap-2 p-2.5 rounded-lg border border-border/40 bg-card">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                              <div>
                                <span className="font-semibold text-foreground block text-[11px]">Attempt consistency metric stable</span>
                                <span className="text-[10px] block leading-normal pt-0.5">Completed {activeStudent.testsAttempted} core mocks</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 p-2.5 rounded-lg border border-border/40 bg-card">
                              {consistencyPercent >= 75 ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                              ) : (
                                <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                              )}
                              <div>
                                <span className="font-semibold text-foreground block text-[11px]">Released mock benchmark pacing</span>
                                <span className="text-[10px] block leading-normal pt-0.5">Attempted {consistencyPercent}% of program parameters</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 p-2.5 rounded-lg border border-border/40 bg-card">
                              {activeStudent.averageScore >= 60 ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                              ) : (
                                <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                              )}
                              <div>
                                <span className="font-semibold text-foreground block text-[11px]">Mean accuracy index validated</span>
                                <span className="text-[10px] block leading-normal pt-0.5">Score is {activeStudent.averageScore}% vs stream metric 60%</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2 p-2.5 rounded-lg border border-border/40 bg-card">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                              <div>
                                <span className="font-semibold text-foreground block text-[11px]">Diagnostic coverage indexed</span>
                                <span className="text-[10px] block leading-normal pt-0.5">Learning weakness triggers has resolved</span>
                              </div>
                            </div>
                          </div>
                        </div>

                      </CardContent>
                    </Card>

                    {/* SECTION 3: TOPIC-WISE ACCURACY */}
                    <Card id="topic-wise-accuracy-card">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-1.5 flex flex-row font-sans text-gray-900">
                          <Activity className="h-4 w-4 text-primary" />
                          Core Subject Chapter Accuracy Grid
                        </CardTitle>
                        <CardDescription className="text-xs">Dynamic performance accuracy ratio mapped per core diagnostic curriculum topic</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3.5">
                          {studentTopicsList.map((t, idx) => {
                            const isHigh = t.accuracy >= 75;
                            const isLow = t.accuracy < 60;
                            return (
                              <div key={idx} className="space-y-1.5">
                                <div className="flex justify-between items-center text-xs font-sans">
                                  <span className="font-semibold text-foreground">{t.name}</span>
                                  <div className="flex items-center gap-1.5 font-mono">
                                    <span className="text-muted-foreground text-[10px]">({t.subject})</span>
                                    <span className={`font-bold ${isHigh ? 'text-emerald-600' : isLow ? 'text-destructive font-black' : 'text-amber-600'}`}>
                                      {t.accuracy}%
                                    </span>
                                  </div>
                                </div>
                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all ${
                                      isHigh 
                                        ? 'bg-emerald-500' 
                                        : isLow 
                                          ? 'bg-destructive' 
                                          : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${t.accuracy}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                  </div>
                )}

                {/* TAB BUFFER B: CURRICULUM INTERVENTIONS */}
                {activeProfileTab === 'curriculum' && (
                  <div className="space-y-6">
                    
                    {/* SECTION 4: WEAK TOPICS INTERVENTION SECTION */}
                    <Card id="weak-topics-section-card" className="border-destructive/30 bg-destructive/[0.01]">
                      <CardHeader className="pb-2 border-b border-destructive/10">
                        <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-destructive flex flex-row font-sans">
                          <AlertTriangle className="h-4 w-4" />
                          Active Interventions: Student Weak Spots
                        </CardTitle>
                        <CardDescription className="text-xs text-destructive/80">Diagnostic subjects with accuracy dropping under 60% — urgent corrections advised</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        
                        {weakTopics.length > 0 ? (
                          <div className="space-y-3">
                            {weakTopics.map((topic, index) => (
                              <div key={index} className="p-3.5 rounded-xl border border-destructive/20 bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-destructive/10 text-destructive font-mono">
                                      {topic.subject}
                                    </span>
                                    <h4 className="text-xs font-bold text-foreground leading-none font-sans">{topic.name}</h4>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-normal pt-1 font-sans">
                                    Diagnostic testing recorded a low score accuracy of <strong className="text-destructive font-bold">{topic.accuracy}%</strong>. Recommended workbook review series and quick mock assessment.
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <Badge variant="outline" className="border-destructive/20 text-destructive bg-destructive/5 font-mono text-[9px] font-bold px-2 py-0.5">
                                    Sub-threshold
                                  </Badge>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setIsAssignTestOpen(true);
                                      setSelectedTestToAssign('test-1');
                                    }}
                                    className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white text-[10px] font-extrabold h-8 rounded-lg"
                                  >
                                    Assign Drill
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center rounded-xl border border-dashed border-border bg-card">
                            <Sparkles className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                            <h4 className="text-xs font-bold text-foreground">Perfect Diagnostic Baseline!</h4>
                            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto leading-normal mt-1 font-sans">
                              This student has resolved all critical weakness markers. No chapters currently register below the 60% standard. Excellent pacing!
                            </p>
                          </div>
                        )}

                      </CardContent>
                    </Card>

                    {/* SECTION 5: STRENGTH AREAS SECTION */}
                    <Card id="strength-areas-section-card" className="border-emerald-500/20 bg-emerald-500/[0.01]">
                      <CardHeader className="pb-2 border-b border-border/40">
                        <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 flex flex-row font-sans">
                          <Trophy className="h-4 w-4" />
                          Core Strengths: Mastered Competencies
                        </CardTitle>
                        <CardDescription className="text-xs text-emerald-600/80 dark:text-emerald-400/80 font-sans">Excellent retrieval pacing and accuracy scores over 75% cohort benchmark</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-4">
                        
                        {strengthAreas.length > 0 ? (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {strengthAreas.map((topic, index) => (
                              <div key={index} className="p-3.5 rounded-xl border border-emerald-500/10 bg-background space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-emerald-500/10 text-emerald-600 font-mono">
                                    {topic.subject}
                                  </span>
                                  <span className="font-mono text-xs font-black text-emerald-600">{topic.accuracy}% accuracy</span>
                                </div>
                                <h4 className="text-xs font-bold text-foreground leading-tight font-sans">{topic.name}</h4>
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-sans">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                  <span>Curriculum block completed with high consistency</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-8 text-center rounded-xl border border-dashed border-border bg-card">
                            <span className="text-xs text-muted-foreground font-semibold">No chapter benchmarks currently scored above 75%. Sustain continuous mocks to build competency levels.</span>
                          </div>
                        )}

                      </CardContent>
                    </Card>

                  </div>
                )}

              </div>

              {/* RIGHT SIDE: STUDENT DETAILS & TEACHER NOTES */}
              <div className="space-y-6">
                
                {/* STUDENT DETAILS SPECIFICATIONS CARD */}
                <Card id="student-details-specs-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold font-sans text-gray-900">Diagnostic Dossier Coordinates</CardTitle>
                    <CardDescription className="text-xs">Physical references and parent SMS contact networks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    <div className="space-y-3 pt-1">
                      <div className="p-3 rounded-lg border border-border/60 bg-muted/10 space-y-1 text-xs font-sans">
                        <span className="text-[10px] text-muted-foreground uppercase block font-black font-mono">Parent SMS Contact Phone</span>
                        <div className="flex items-center justify-between">
                          <strong className="text-foreground font-mono font-semibold">{parentContact}</strong>
                          <Badge variant="outline" className="text-[9px] font-bold px-2 py-0.5">Primary Sponsor</Badge>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg border border-border/60 bg-muted/10 space-y-1 text-xs font-sans">
                        <span className="text-[10px] text-muted-foreground uppercase block font-black font-mono font-sans">Total Completed Tests</span>
                        <div className="flex items-center justify-between">
                          <strong className="text-foreground font-semibold">{activeStudent.testsAttempted} attempts</strong>
                          <span className="text-muted-foreground text-[10px]">Academic Term</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg border border-border/60 bg-muted/10 space-y-1 text-xs font-sans">
                        <span className="text-[10px] text-muted-foreground uppercase block font-black font-mono">Mean Accuracy Score</span>
                        <div className="flex items-center justify-between">
                          <strong className="text-foreground text-sm font-mono">{activeStudent.averageScore}%</strong>
                          <Badge variant={activeStudent.averageScore >= 75 ? 'success' : 'outline'} className="text-[9px] font-mono px-2 py-0.5">
                            {activeStudent.averageScore >= 75 ? 'HIGH RANGE' : 'SUPPORT NEEDED'}
                          </Badge>
                        </div>
                      </div>

                      {/* Attendance proxy / mock consistency */}
                      <div className="p-3 rounded-lg border border-border/60 bg-muted/10 space-y-2 text-xs font-sans">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-muted-foreground uppercase block font-black font-mono">Mock Attempt Consistency</span>
                            
                            {/* PURE CSS STABLE TOOLTIP */}
                            <div className="relative group inline-block">
                              <span className="cursor-help text-muted-foreground hover:text-foreground text-[10px] font-extrabold border-b border-dashed border-muted-foreground/50">Details</span>
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50">
                                <div className="bg-foreground text-background text-[10px] rounded-lg py-1.5 px-3 shadow-md max-w-xs leading-normal">
                                  Ratio of mock attempts to released assignments over the last 30-day index cycle.
                                </div>
                                <div className="w-2.5 h-2.5 bg-foreground rotate-45 -mt-1.5" />
                              </div>
                            </div>

                          </div>
                          <span className="font-mono font-bold text-primary">{consistencyPercent}%</span>
                        </div>
                        
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${consistencyPercent}%` }} />
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-normal font-sans">
                          Student attempted {activeStudent.testsAttempted} of 15 released papers, showing strong attendance and preparation.
                        </p>
                      </div>
                    </div>

                  </CardContent>
                </Card>

                {/* TEACHER NOTES CARD - ADD FORM & DYNAMIC HISTORICAL TIMELINE */}
                <Card id="teacher-notes-dynamic-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold flex items-center gap-1.5 flex flex-row font-sans text-gray-900">
                      <PenSquare className="h-4 w-4 text-amber-500" />
                      Academic & Counseling Remarks
                    </CardTitle>
                    <CardDescription className="text-xs">Log diagnostic comments and observation streams chronologically</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Add note inline form */}
                    <div className="space-y-2.5 p-3 rounded-xl border border-amber-500/10 bg-amber-500/[0.01]">
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-black tracking-wider block font-mono">Add Custom Note Remarks</span>
                      
                      <div className="space-y-2">
                        <textarea
                          id="new-teacher-note-textarea"
                          placeholder="Type diagnostic counseling remarks, student feedback or class behavioral notes..."
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          className="flex min-h-[70px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        
                        <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                          <div className="flex-1 min-w-[100px]">
                            <Select
                              value={newNoteCategory}
                              onChange={(e) => setNewNoteCategory(e.target.value)}
                              className="text-xs h-8 py-1"
                            >
                              <option value="academic">Academic Feedback</option>
                              <option value="behavior">Behavior Observation</option>
                              <option value="critical">Critical Warning</option>
                              <option value="encouraging">Encouraging Milestone</option>
                            </Select>
                          </div>
                          
                          <Button
                            type="button"
                            onClick={() => handleAddNote(activeStudent.id)}
                            className="bg-primary hover:bg-primary/90 h-8 font-extrabold text-[11px] shrink-0"
                            id="save-note-btn"
                          >
                            Save Note
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Timeline of previous notes */}
                    <div className="space-y-3 pt-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block font-mono">Historic Remarks Timeline ({notesList.length})</span>
                      
                      {notesList.length > 0 ? (
                        <div className="relative border-l border-border pl-4 space-y-4 ml-1 pt-1">
                          {notesList.map((note) => {
                            const isCrit = note.category === 'critical';
                            const isEnc = note.category === 'encouraging';
                            const isBeh = note.category === 'behavior';
                            return (
                              <div key={note.id} className="relative space-y-1">
                                
                                {/* Timeline circular node */}
                                <div className={`absolute -left-[21px] top-0.5 h-2.5 w-2.5 rounded-full border border-background ring-4 ring-background ${
                                  isCrit 
                                    ? 'bg-destructive' 
                                    : isEnc 
                                      ? 'bg-emerald-500' 
                                      : isBeh 
                                        ? 'bg-amber-500' 
                                        : 'bg-primary'
                                }`} />

                                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <strong className="text-foreground font-semibold">{note.author}</strong>
                                    <Badge variant="outline" className={`text-[8px] tracking-tight font-bold scale-90 px-2 py-0.5 ${
                                      isCrit 
                                        ? 'border-destructive text-destructive bg-destructive/5' 
                                        : isEnc 
                                          ? 'border-emerald-500 text-emerald-600 bg-emerald-500/5' 
                                          : isBeh 
                                            ? 'border-amber-500 text-amber-600 bg-amber-500/5' 
                                            : 'border-primary text-primary bg-primary/5'
                                    }`}>
                                      {note.category.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <span className="font-mono text-muted-foreground/60">{note.date}</span>
                                </div>
                                <p className="text-xs text-foreground p-2 rounded-lg border border-border bg-muted/20 leading-relaxed font-normal whitespace-pre-wrap font-sans">
                                  {note.text}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center p-4 border border-dashed border-border rounded-lg bg-card">
                          <span className="text-[10px] text-muted-foreground leading-normal block font-sans">
                            No counseling remarks currently logged in student timeline. Add remarks in the form above.
                          </span>
                        </div>
                      )}
                    </div>

                  </CardContent>
                </Card>

              </div>

            </div>

            {/* FULL WIDTH BOTTOM CARD: COMPLETIONS & HISTORY LOG */}
            <Card id="test-history-logs-section">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border bg-muted/20 p-5 gap-3">
                <div className="space-y-0.5">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5 flex flex-row font-sans text-gray-900">
                    <FileSpreadsheet className="h-4 w-4 text-primary" />
                    Historic Test Attempt Ledger
                  </CardTitle>
                  <CardDescription className="text-xs">Complete log breakdown of mock papers attempted by {activeStudent.name}</CardDescription>
                </div>
                <Badge variant="outline" className="text-foreground tracking-wide font-mono text-[9px] font-bold px-2.5 py-0.5">
                  {attemptsHistoryList.length} assessment entries indexed
                </Badge>
              </CardHeader>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold text-xs font-sans text-gray-900">Test Benchmark Name</TableHead>
                      <TableHead className="font-bold text-xs font-sans text-gray-900">Submission Date</TableHead>
                      <TableHead className="font-bold text-xs font-sans text-gray-900 text-center">Score Ratio</TableHead>
                      <TableHead className="font-bold text-xs font-sans text-gray-900 text-center">Accuracy Rating</TableHead>
                      <TableHead className="font-bold text-xs font-sans text-gray-900 text-center">Time Completed</TableHead>
                      <TableHead className="font-bold text-xs font-sans text-gray-900 text-right">Status Flag</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attemptsHistoryList.map((attempt) => {
                      const percent = Math.round((attempt.score / attempt.maxScore) * 100);
                      const isHigh = percent >= 75;
                      const isLow = percent < 60;
                      return (
                        <TableRow key={attempt.id} className="font-normal text-xs hover:bg-accent/30 font-sans">
                          <TableCell className="font-bold text-foreground">
                            {attempt.testTitle}
                          </TableCell>
                          
                          <TableCell className="font-mono text-muted-foreground">
                            {attempt.submittedAt}
                          </TableCell>

                          <TableCell className="text-center font-mono font-bold text-foreground">
                            {attempt.score} / {attempt.maxScore}
                          </TableCell>

                          <TableCell className="text-center">
                            <span className="inline-flex items-center gap-1.5 justify-center">
                              <span className={`text-[11px] font-mono font-bold ${isHigh ? 'text-emerald-600' : isLow ? 'text-destructive' : 'text-amber-600'}`}>
                                {percent}%
                              </span>
                              <span className="text-[10px] text-muted-foreground">accuracy</span>
                            </span>
                          </TableCell>

                          <TableCell className="text-center font-mono text-muted-foreground">
                            {attempt.durationMinutes} mins
                          </TableCell>

                          <TableCell className="text-right">
                            <Badge 
                              variant={
                                attempt.status === 'Passed' 
                                  ? 'success' 
                                  : attempt.status === 'Needs Review' 
                                    ? 'default' 
                                    : 'destructive'
                              }
                              className="text-[9px] font-bold font-mono tracking-wider scale-95"
                            >
                              {attempt.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* QUICK ACTIONS MODAL 1: ASSIGN PRACTICE TEST */}
            <Modal
              isOpen={isAssignTestOpen}
              onClose={() => setIsAssignTestOpen(false)}
              title="Assign Practice Benchmark Test"
              description="Deploy a reinforcement focus mock directly to this student's master exam dashboard"
            >
              <div className="space-y-4 pt-4 text-left font-sans">
                <div className="space-y-1.5 text-xs">
                  <span className="font-semibold text-foreground block pb-1">Assign Practice Material to: {activeStudent.name}</span>
                  <Select
                    value={selectedTestToAssign}
                    onChange={(e) => setSelectedTestToAssign(e.target.value)}
                    className="w-full text-xs"
                  >
                    {initialTests.map(test => (
                      <option key={test.id} value={test.id}>
                        {test.title} ({test.questionCount} Questions, {test.totalMarks} Marks)
                      </option>
                    ))}
                    <option value="office-drill">MS Office (Excel, Word) Practical Labs - A</option>
                    <option value="fund-drill">Computer Fundamentals Keyboard Shortcuts Mock - III</option>
                    <option value="net-drill">O Level Web Development Protocols Tutorial</option>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 border-t border-border pt-4">
                  <Button variant="outline" size="sm" onClick={() => setIsAssignTestOpen(false)}>
                    Close
                  </Button>
                  <Button variant="default" size="sm" onClick={() => handleAssignTest(activeStudent.id, selectedTestToAssign)}>
                    Confirm Release Deployment
                  </Button>
                </div>
              </div>
            </Modal>

            {/* QUICK ACTIONS MODAL 2: WHATSAPP SHIELD LOG PREVIEW */}
            <Modal
              isOpen={isWhatsAppModalOpen}
              onClose={() => setIsWhatsAppModalOpen(false)}
              title="WhatsApp Parent Report Dispatcher"
              description="Dispatch performance telemetry and active intervention diagnostics directly to the sponsor SMS network"
            >
              <div className="space-y-4 pt-4 text-left font-sans">
                
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.01] space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-600 fill-emerald-500/10" />
                    <span className="font-extrabold text-foreground uppercase tracking-wider text-[10px]">Encrypted Message Dispatch Coordinates</span>
                  </div>
                  
                  <div className="font-mono text-muted-foreground pt-1 space-y-1 text-[11px]">
                    <div><strong>Recipient Parent SMS:</strong> {parentContact} (Sponsor contact)</div>
                    <div><strong>Encryption status:</strong> Valid Standard Gateway</div>
                  </div>
                </div>

                {/* Preformatted text copy area */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-semibold text-foreground">Draft SMS Telemetry Payload:</span>
                  <div className="p-3 bg-muted rounded-lg font-mono text-[10px] text-foreground leading-normal border border-border select-all pr-4 whitespace-pre-wrap relative">
                    {`Dear Parent,

Here is the weekly Result Booster academic diagnostic update for your ward ${activeStudent.name}:

- Class Batch Cohort: ${activeStudent.batchName}
- Course Stream: ${activeStudent.course}
- Mean Accuracy Index: ${activeStudent.averageScore}%
- Current Readiness Level: ${readinessRate}%

Primary Intervention Areas:
${weakTopics.length > 0 ? weakTopics.map(t => `• ${t.name} (${t.accuracy}% Accuracy)`).join('\n') : '• All standard baseline curriculum blocks passed!'}

Regards,
Principal Academy Admin`}
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-border pt-4">
                  <Button variant="outline" size="sm" onClick={() => setIsWhatsAppModalOpen(false)}>
                    Cancel
                  </Button>
                  
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => {
                      triggerToast('WhatsApp encrypted report stream transmitted!');
                      setIsWhatsAppModalOpen(false);
                    }}
                    className="bg-[#25D366] hover:bg-[#20ba59] text-white border-transparent"
                  >
                    Transmit via WhatsApp Gateway
                  </Button>
                </div>
              </div>
            </Modal>

          </div>
        );
      })() : null}

      {/* ---------------------------------------------------------
          INTERACTIVE SHADCN MODALS
         --------------------------------------------------------- */}
          
      {/* MODAL 1: ADD STUDENT */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Student Candidate"
        description="Append a new benchmarking candidate account with active classroom coordinates."
      >
        <form onSubmit={handleAddStudentSubmit} className="space-y-4 pt-3 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Candidate Highschool Name</label>
            <Input
              required
              placeholder="e.g. Sanya Malhotra"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Registered Academic Email</label>
            <Input
              required
              type="email"
              placeholder="e.g. sanya@gmail.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Parent SMS Contact Phone</label>
            <Input
              placeholder="e.g. +91 98123 45678"
              value={newMobile}
              onChange={(e) => setNewMobile(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Classroom Batch</label>
              <Select
                value={newBatchId}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewBatchId(val);
                  // Auto stream mapping
                  if (val === 'batch-1') setNewCourse('CCC Certification');
                  else if (val === 'batch-2') setNewCourse('DCA Diploma');
                  else if (val === 'batch-4') setNewCourse('O Level IT');
                  else setNewCourse('ADCA Diploma');
                }}
              >
                {initialBatches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Course Stream</label>
              <Input
                readOnly
                disabled
                value={newCourse}
                className="bg-muted text-muted-foreground font-semibold"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="bg-primary hover:bg-primary/95 font-extrabold text-xs"
            >
              Add Candidate Student
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: IMPORT CSV */}
      <Modal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Candidate Roster (CSV)"
        description="Select or drop standard formatted candidate list spreadsheet coordinates to merge candidate data."
      >
        <div className="space-y-4 pt-3">
          
          {/* Drag & Drop Visual Box */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDropCsvSimulated}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isCsvDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border bg-muted/10 hover:border-border/100'
            }`}
          >
            <Upload className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2.5" />
            <span className="text-xs font-bold block text-foreground">
              Drag booster_students_list.csv here
            </span>
            <span className="text-[10px] text-muted-foreground leading-normal mt-1 block">
              Supports CSV with standard columns: Name, Email, Mobile, BatchId
            </span>

            <div className="relative flex py-2 items-center text-[10px] uppercase font-bold text-muted-foreground/60 w-32 mx-auto justify-center">
              <div className="flex-grow border-t border-border" />
              <span className="flex-shrink mx-2">OR</span>
              <div className="flex-grow border-t border-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLoadSampleCSV}
              disabled={isLoading}
            >
              {isLoading ? 'Reading CSV rows...' : 'Load Mock Candidate CSV Data'}
            </Button>
          </div>

          <div className="p-3.5 rounded-lg bg-primary/[0.01] border border-primary/20 text-xs text-muted-foreground leading-normal flex items-start gap-2">
            <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>
              <strong>Note:</strong> Mapping system imports will automatically index scores and flag intervention streams built on historical parameters.
            </span>
          </div>

          <div className="pt-4 flex justify-end border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsImportOpen(false)}
            >
              Close Window
            </Button>
          </div>
        </div>
      </Modal>

      {/* MODAL 3: EDIT STUDENT */}
      <Modal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        title="Edit Candidate Coordinate"
        description="Modify student profile metrics, target cohort or phone connections."
      >
        {editingStudent && (
          <form onSubmit={handleEditStudentSubmit} className="space-y-4 pt-3 text-left">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Candidate Full Name</label>
              <Input
                required
                value={editingStudent.name}
                onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Registered Academic Email</label>
              <Input
                required
                type="email"
                value={editingStudent.email}
                onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Parent SMS Contact Phone</label>
              <Input
                value={editingStudent.mobile}
                onChange={(e) => setEditingStudent({ ...editingStudent, mobile: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Classroom Batch</label>
                <Select
                  value={editingStudent.batchId}
                  onChange={(e) => {
                    const selectedBatchId = e.target.value;
                    setEditingStudent({ ...editingStudent, batchId: selectedBatchId });
                  }}
                >
                  {initialBatches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Mean Accuracy Score (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={editingStudent.averageScore}
                  onChange={(e) => setEditingStudent({ ...editingStudent, averageScore: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingStudent(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                className="bg-primary hover:bg-primary/95 text-xs font-extrabold"
              >
                Save Coordinate Updates
              </Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
