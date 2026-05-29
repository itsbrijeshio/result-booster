import * as React from 'react';
import { 
  AlertTriangle, 
  Search, 
  Phone, 
  BookOpen, 
  MessageSquare, 
  Check, 
  Eye, 
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle,
  FileText
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  Badge, 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell, 
  Modal
} from '../../components/ui/CustomComponents';

// Clean WeakStudent Interface
interface WeakStudent {
  id: string;
  name: string;
  batch: string;
  weakIn: string;
  lastScore: number;
  avgScore: number;
  attemptedTests: number;
  missedTests: number;
  phone: string;
  notes: string;
  weakTopics: string[];
}

const initialWeakStudents: WeakStudent[] = [
  {
    id: 'st-1',
    name: 'Rahul',
    batch: 'CCC Morning',
    weakIn: 'Excel formulas',
    lastScore: 34,
    avgScore: 38,
    attemptedTests: 8,
    missedTests: 2,
    phone: '+91 98123 45601',
    notes: 'Struggles with basic formulas, specifically absolute references (F4) and nested IF syntax.',
    weakTopics: ['Excel formulas', 'Shortcut keys', 'Windows OS File Directory']
  },
  {
    id: 'st-2',
    name: 'Aman',
    batch: 'DCA Batch',
    weakIn: 'Internet concepts',
    lastScore: 42,
    avgScore: 45,
    attemptedTests: 6,
    missedTests: 3,
    phone: '+91 98123 45602',
    notes: 'Often absent during critical cybersecurity protocol lectures. Concepts around HTTP vs HTTPS are weak.',
    weakTopics: ['Internet concepts', 'Email setup', 'Virus/Malware protection']
  },
  {
    id: 'st-3',
    name: 'Priya',
    batch: 'CCC Evening',
    weakIn: 'Excel formulas',
    lastScore: 39,
    avgScore: 41,
    attemptedTests: 9,
    missedTests: 1,
    phone: '+91 98123 45603',
    notes: 'Basic formulas arithmetic is fine, but struggles when selecting correct lookup structures matching targets.',
    weakTopics: ['Excel formulas', 'Word formatting', 'LibreOffice Calc']
  },
  {
    id: 'st-4',
    name: 'Ananya Goel',
    batch: 'CCC Morning',
    weakIn: 'Excel formulas',
    lastScore: 54,
    avgScore: 56,
    attemptedTests: 10,
    missedTests: 2,
    phone: '+91 98123 45604',
    notes: 'Slow but displays progress on standard formulas. Requires continuous minor feedback sets.',
    weakTopics: ['Excel formulas', 'Operating Systems', 'Word Document Alignment']
  },
  {
    id: 'st-5',
    name: 'Ishita Patel',
    batch: 'DCA Batch',
    weakIn: 'Word formatting',
    lastScore: 48,
    avgScore: 50,
    attemptedTests: 7,
    missedTests: 3,
    phone: '+91 98123 45605',
    notes: 'Tab stops, alignment indentations, and table margins require manual step-by-step revision drills.',
    weakTopics: ['Word formatting', 'Keyboard Shortcuts', 'File Management']
  },
  {
    id: 'st-6',
    name: 'Ranbir Kapoor',
    batch: 'ADCA Evening',
    weakIn: 'Python Syntax',
    lastScore: 39,
    avgScore: 35,
    attemptedTests: 4,
    missedTests: 5,
    phone: '+91 98123 45612',
    notes: 'Absenteeism is high. Blocked at fundamental loops variables and array indices. Urgent intervention needed.',
    weakTopics: ['Python Syntax', 'Database Relations', 'HTML/CSS Basics']
  }
];

export default function OwnerWeakStudents() {
  const [students, setStudents] = React.useState<WeakStudent[]>(initialWeakStudents);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedBatch, setSelectedBatch] = React.useState<string>('all');
  
  // Selected Student for Detail Modal / Drawer
  const [selectedStudent, setSelectedStudent] = React.useState<WeakStudent | null>(null);
  
  // Action Feedback States
  const [whatsappSent, setWhatsappSent] = React.useState<Record<string, boolean>>({});
  const [assignedTests, setAssignedTests] = React.useState<Record<string, string>>({});
  const [toast, setToast] = React.useState<string | null>(null);

  // Note edit state
  const [activeNoteText, setActiveNoteText] = React.useState<string>('');
  
  // Test Selection state for assignment
  const [testToAssign, setTestToAssign] = React.useState<string>('Excel basic formulas drill (15 min)');

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Open candidate details modal
  const handleOpenDetail = (student: WeakStudent) => {
    setSelectedStudent(student);
    setActiveNoteText(student.notes);
  };

  // Save customized notes
  const handleSaveNotes = () => {
    if (!selectedStudent) return;
    setStudents(prev => prev.map(s => {
      if (s.id === selectedStudent.id) {
        return { ...s, notes: activeNoteText };
      }
      return s;
    }));
    setSelectedStudent(prev => prev ? { ...prev, notes: activeNoteText } : null);
    triggerToast(`Notes updated successfully for ${selectedStudent.name}!`);
  };

  // Dispatch mock remedial
  const handleAssignTest = () => {
    if (!selectedStudent) return;
    setAssignedTests(prev => ({ ...prev, [selectedStudent.id]: testToAssign }));
    triggerToast(`Remedial test "${testToAssign}" assigned successfully to ${selectedStudent.name}!`);
    setSelectedStudent(null);
  };

  // Parental WhatsApp broadcast trigger code simulation
  const handleSendWhatsApp = () => {
    if (!selectedStudent) return;
    setWhatsappSent(prev => ({ ...prev, [selectedStudent.id]: true }));
    triggerToast(`Parent alert successfully scheduled & sent on WhatsApp to ${selectedStudent.phone}!`);
    setSelectedStudent(null);
  };

  // Filters candidates list inline
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.weakIn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = selectedBatch === 'all' || student.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  // Dynamic unique list of batches for the filtering system
  const uniqueBatches = Array.from(new Set(students.map(s => s.batch)));

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans w-full max-w-7xl mx-auto px-4 md:px-0">
      
      {/* Visual Toast Notification Banner */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 p-4 max-w-sm rounded-xl border border-primary/20 bg-card text-foreground shadow-lg flex items-start gap-3 animate-slide-in">
          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
            <Sparkles className="h-3 w-3" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold block">Booster Action Completed</span>
            <p className="text-[11px] text-muted-foreground leading-normal">{toast}</p>
          </div>
        </div>
      )}

      {/* Humble Title Header */}
      <div className="border-b border-border/60 pb-5 pt-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-destructive shrink-0" />
          <span>At-Risk Students Spotlight</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1 text-slate-500 italic">
          Fast-action diagnostics and student performance overview • Click any row or action to update notes, dispatch parent messages, or assign specific practice.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-muted/20 p-3.5 rounded-xl border border-border/60">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search student or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-hidden focus:border-primary/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="text-xs bg-background border border-border rounded-lg px-2.5 py-1.5 focus:border-primary/50 outline-hidden"
          >
            <option value="all">Every classroom stream</option>
            {uniqueBatches.map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE FIRST VIEW */}
      <Card className="border border-border/80 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="py-3 font-extrabold text-xs text-foreground pl-4">Student</TableHead>
                  <TableHead className="py-3 font-extrabold text-xs text-foreground">Batch</TableHead>
                  <TableHead className="py-3 font-extrabold text-xs text-foreground">Weak In</TableHead>
                  <TableHead className="py-3 font-extrabold text-xs text-foreground text-center">Last Score</TableHead>
                  <TableHead className="py-3 font-extrabold text-xs text-foreground text-center">Missed Tests</TableHead>
                  <TableHead className="py-3 font-extrabold text-xs text-foreground text-right pr-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((st) => (
                    <TableRow 
                      key={st.id} 
                      className="hover:bg-muted/40 transition-colors cursor-pointer group"
                      onClick={() => handleOpenDetail(st)}
                    >
                      {/* Name */}
                      <TableCell className="align-middle py-3.5 pl-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-7 w-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                            st.lastScore < 40 
                              ? 'bg-rose-500/10 text-rose-600' 
                              : 'bg-amber-500/10 text-amber-600'
                          }`}>
                            {st.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-foreground text-xs block leading-none">{st.name}</span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 block">{st.phone}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Class Batch */}
                      <TableCell className="align-middle py-3.5 text-xs font-semibold text-foreground">
                        {st.batch}
                      </TableCell>

                      {/* Weak In */}
                      <TableCell className="align-middle py-3.5">
                        <Badge variant="outline" className="text-[10px] font-mono py-0 px-2 bg-muted/40 font-bold border-border/80">
                          {st.weakIn}
                        </Badge>
                      </TableCell>

                      {/* Last Score */}
                      <TableCell className="align-middle py-3.5 text-center font-bold text-xs font-mono">
                        <span className={st.lastScore < 40 ? 'text-rose-500 font-extrabold' : 'text-amber-500 font-extrabold'}>
                          {st.lastScore}%
                        </span>
                      </TableCell>

                      {/* Missed Tests */}
                      <TableCell className="align-middle py-3.5 text-center font-mono text-xs">
                        {st.missedTests > 0 ? (
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            st.missedTests >= 3 
                              ? 'bg-rose-500/10 text-rose-600' 
                              : 'bg-amber-500/10 text-amber-600'
                          }`}>
                            {st.missedTests}
                          </span>
                        ) : (
                          <span className="text-emerald-500 text-[10px]">None</span>
                        )}
                      </TableCell>

                      {/* Action trigger code buttons */}
                      <TableCell className="align-middle py-3.5 text-right pr-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(st)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground text-[11px] font-bold rounded-lg transition-all cursor-pointer active:scale-95"
                          >
                            <Eye className="h-3 w-3 text-muted-foreground" />
                            <span>View</span>
                          </button>

                          {assignedTests[st.id] ? (
                            <Badge className="text-[9px] font-mono max-w-[100px] truncate" title={`Assigned: ${assignedTests[st.id]}`}>
                              ✓ Sent
                            </Badge>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                handleOpenDetail(st);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-primary text-primary-foreground hover:bg-primary/95 text-[11px] font-bold rounded-lg transition-all cursor-pointer active:scale-95"
                            >
                              <BookOpen className="h-3 w-3" />
                              <span>Assign Test</span>
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground select-none">
                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                        <span className="text-xs font-bold font-sans">No matching student found.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ================= STUDENT DIAGNOSTIC DETAIL MODAL ================= */}
      <Modal
        isOpen={selectedStudent !== null}
        onClose={() => setSelectedStudent(null)}
        title="Student Diagnostic Brief & Action"
        description="Comprehensive diagnostic metrics and coordinator interventions tools"
      >
        {selectedStudent && (
          <div className="space-y-4 pt-1 text-sm font-sans">
            
            {/* 1. Header Student Meta */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-base font-black text-foreground">{selectedStudent.name}</span>
                <p className="text-xs text-muted-foreground">{selectedStudent.batch} • Regular Registrant</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Parent Phone: {selectedStudent.phone}</p>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-black font-mono block ${
                  selectedStudent.lastScore < 40 ? 'text-rose-500' : 'text-amber-500'
                }`}>
                  {selectedStudent.lastScore}%
                </span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Last Test Score
                </span>
              </div>
            </div>

            {/* 2. Performance Summary Container */}
            <div className="grid grid-cols-3 gap-2 bg-muted/30 p-2.5 rounded-xl border border-border/40 text-center">
              <div>
                <span className="text-xs text-muted-foreground block text-[10px] uppercase font-bold">Avg score</span>
                <strong className={`text-xs font-mono font-black ${
                  selectedStudent.avgScore < 40 ? 'text-rose-500' : 'text-amber-500'
                }`}>
                  {selectedStudent.avgScore}%
                </strong>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block text-[10px] uppercase font-bold">Last score</span>
                <strong className={`text-xs font-mono font-black ${
                  selectedStudent.lastScore < 40 ? 'text-rose-500' : 'text-amber-500'
                }`}>
                  {selectedStudent.lastScore}%
                </strong>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block text-[10px] uppercase font-bold">Attempted</span>
                <strong className="text-xs text-foreground font-mono font-black">
                  {selectedStudent.attemptedTests} tests
                </strong>
              </div>
            </div>

            {/* 3. Weak Topics tags list */}
            <div className="space-y-1.5">
              <span className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1 select-none">
                <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                Weak Topics
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent.weakTopics.map((topic, i) => (
                  <Badge key={i} variant="destructive" className="text-[10px] bg-rose-500/10 text-rose-700 font-mono hover:bg-rose-500/20 px-2 py-0 border-transparent">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 4. Notes input / editor section */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center gap-1">
                <FileText className="h-3 w-3 text-primary shrink-0" />
                Coordinator Remarks
              </label>
              <textarea
                rows={2}
                value={activeNoteText}
                onChange={(e) => setActiveNoteText(e.target.value)}
                placeholder="Type dynamic action plan notes regarding missed classes or feedback loops..."
                className="w-full text-xs p-2.5 border border-border rounded-xl focus:border-primary/50 outline-hidden resize-none bg-background block"
              />
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wide cursor-pointer"
                >
                  Save Active Note Update
                </button>
              </div>
            </div>

            {/* 5. Quick Actions buttons */}
            <div className="space-y-2 pt-3 border-t border-border">
              <span className="text-xs font-extrabold text-foreground uppercase tracking-wider block mb-1">
                Quick Actions
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Assign remedial homework mock */}
                <div className="p-3 border border-border rounded-xl space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">1. Remedial Assignment</span>
                    <select
                      value={testToAssign}
                      onChange={(e) => setTestToAssign(e.target.value)}
                      className="w-full text-[11px] bg-background border border-border rounded p-1 mt-1 outline-hidden"
                    >
                      <option value="Excel basic formulas drill (15 min)">Excel formulas drill (15 min)</option>
                      <option value="Internet fundamentals mock (20 min)">Internet fundamentals (20 min)</option>
                      <option value="Word formatting tools revision (25 min)">Word formatting revision (25 min)</option>
                      <option value="Variables syntax starter logic (10 min)">Variables logic (10 min)</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAssignTest}
                    className="w-full mt-2 inline-flex items-center justify-center gap-1 py-1.5 bg-primary text-primary-foreground font-bold text-xs rounded-md transition-all cursor-pointer active:scale-95"
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>Assign Test</span>
                  </button>
                </div>

                {/* Send WhatsApp Message */}
                <div className="p-3 border border-border rounded-xl space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">2. Parent alert</span>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-normal italic">
                      "Dear Parent, {selectedStudent.name} scored only {selectedStudent.lastScore}% on their last mock..."
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="w-full inline-flex items-center justify-center gap-1 py-1.5 bg-emerald-500 text-white font-bold text-xs rounded-md transition-all cursor-pointer hover:bg-emerald-600 active:scale-95"
                  >
                    <Phone className="h-3 w-3" />
                    <span>Send WhatsApp</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Footer Modal exit */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-3 py-1.5 border border-border hover:bg-accent rounded-lg text-xs font-semibold text-muted-foreground cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}
