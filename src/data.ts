import { Student, Batch, Question, Test, TestAttempt, WeakAreaDetail, OwnerDashboardStats } from './types';

export const initialOwnerStats: OwnerDashboardStats = {
  totalActiveStudents: 1420,
  totalBatches: 18,
  totalTestsCreated: 145,
  averageScore: 78.4,
  studentsGrowth: 12.3,
  batchesGrowth: 5.6,
  testsGrowth: 18.2,
  averageScoreGrowth: 3.4,
};

export const initialBatches: Batch[] = [
  { id: 'batch-1', name: 'CCC Morning Batch A', studentCount: 120, schedule: 'Mon, Wed, Fri 8AM - 10AM', avgPerformance: 81.2, activeTestsCount: 3 },
  { id: 'batch-2', name: 'DCA Regular Batch B', studentCount: 95, schedule: 'Tue, Thu, Sat 11AM - 1PM', avgPerformance: 76.5, activeTestsCount: 2 },
  { id: 'batch-3', name: 'ADCA Evening Advanced', studentCount: 150, schedule: 'Mon-Fri 4PM - 6PM', avgPerformance: 85.0, activeTestsCount: 4 },
  { id: 'batch-4', name: 'O Level Programming Cohort', studentCount: 45, schedule: 'Sat, Sun 9AM - 1PM', avgPerformance: 89.4, activeTestsCount: 5 },
];

export const initialStudents: Student[] = [
  { id: 'st-1', name: 'Aarav Sharma', email: 'aarav@resultbooster.com', batchId: 'batch-1', batchName: 'CCC Morning Batch A', testsAttempted: 12, averageScore: 82.5, joinedDate: '2026-03-12', status: 'active', weakSubjects: ['MS Excel - Formulas', 'Operating System - Linux Commands'] },
  { id: 'st-2', name: 'Ananya Goel', email: 'ananya@resultbooster.com', batchId: 'batch-1', batchName: 'CCC Morning Batch A', testsAttempted: 11, averageScore: 54.2, joinedDate: '2026-03-15', status: 'active', weakSubjects: ['MS Excel - Filters & Sorting', 'Operating System - Windows Services'] },
  { id: 'st-3', name: 'Devansh Verma', email: 'devansh@resultbooster.com', batchId: 'batch-2', batchName: 'DCA Regular Batch B', testsAttempted: 8, averageScore: 91.0, joinedDate: '2026-04-01', status: 'active', weakSubjects: ['Internet - Web Security Protocol'] },
  { id: 'st-4', name: 'Ishita Patel', email: 'ishita@resultbooster.com', batchId: 'batch-2', batchName: 'DCA Regular Batch B', testsAttempted: 9, averageScore: 48.6, joinedDate: '2026-04-03', status: 'active', weakSubjects: ['MS Word - Formatting Tools', 'Computer Fundamentals - Hardware Hardware'] },
  { id: 'st-5', name: 'Kabir Bose', email: 'kabir@resultbooster.com', batchId: 'batch-3', batchName: 'ADCA Evening Advanced', testsAttempted: 15, averageScore: 88.3, joinedDate: '2026-01-20', status: 'active', weakSubjects: ['Programming - C Loop Structure'] },
  { id: 'st-6', name: 'Riya Sen', email: 'bk6500416@gmail.com', batchId: 'batch-1', batchName: 'CCC Morning Batch A', testsAttempted: 14, averageScore: 79.8, joinedDate: '2026-02-10', status: 'active', weakSubjects: ['Networking - IP Subnetting Basics', 'MS PowerPoint - Slide Animation'] },
];

export const initialQuestions: Question[] = [
  {
    id: 'q-1',
    text: 'What is the shortcut key for copy in Windows?',
    options: [
      'Ctrl + X',
      'Ctrl + C',
      'Ctrl + V',
      'Ctrl + A'
    ],
    correctOptionIdx: 1,
    tags: ['Computer Fundamentals', 'Windows Shortcuts'],
    difficulty: 'easy',
  },
  {
    id: 'q-2',
    text: 'Which function is used to calculate average in Excel?',
    options: [
      'SUM()',
      'AVG()',
      'AVERAGE()',
      'TOTAL()'
    ],
    correctOptionIdx: 2,
    tags: ['MS Excel', 'Formulas'],
    difficulty: 'easy',
  },
  {
    id: 'q-3',
    text: 'What does URL stand for?',
    options: [
      'Uniform Resource Locator',
      'Universal Routing Link',
      'User Reference Link',
      'Uniform Redirect Language'
    ],
    correctOptionIdx: 0,
    tags: ['Internet Concepts', 'Digital Literacy'],
    difficulty: 'medium',
  },
  {
    id: 'q-4',
    text: 'In LibreOffice Writer, which shortcut key is used for Page Break?',
    options: [
      'Ctrl + Enter',
      'Shift + Enter',
      'Ctrl + Shift + Enter',
      'Alt + Enter'
    ],
    correctOptionIdx: 0,
    tags: ['CCC', 'LibreOffice'],
    difficulty: 'medium',
  },
  {
    id: 'q-5',
    text: 'What was the first commercial web browser developed?',
    options: [
      'Internet Explorer',
      'Mosaic',
      'Netscape Navigator',
      'Opera'
    ],
    correctOptionIdx: 2,
    tags: ['Internet Concepts', 'Evolution'],
    difficulty: 'hard',
  }
];

export const initialTests: Test[] = [
  {
    id: 'test-1',
    title: 'CCC Computer Fundamentals & Windows Mock Test',
    durationMinutes: 45,
    batchId: 'batch-1',
    batchName: 'CCC Morning Batch A',
    questionCount: 5,
    totalMarks: 100,
    status: 'active',
    description: 'A benchmark computer literacy exam evaluating Windows operations, files, folders management, and elementary shortcuts.'
  },
  {
    id: 'test-2',
    title: 'DCA Word Formatting & Excel Formula Drill',
    durationMinutes: 30,
    batchId: 'batch-2',
    batchName: 'DCA Regular Batch B',
    questionCount: 4,
    totalMarks: 80,
    status: 'active',
    description: 'Practical simulation check for daily computer tasks: creating summaries, editing columns, sorting rows, and employing formulas.'
  },
  {
    id: 'test-3',
    title: 'ADCA Advanced Excel Formulas & Database Basics',
    durationMinutes: 90,
    batchId: 'batch-3',
    batchName: 'ADCA Evening Advanced',
    questionCount: 5,
    totalMarks: 100,
    status: 'draft',
    description: 'Comprehensive assessment detailing nested spreadsheet queries, structured indexes, database keys, and relational fields.'
  }
];

export const initialTestAttempts: TestAttempt[] = [
  {
    id: 'att-1',
    testId: 'test-1',
    testTitle: 'CCC Computer Fundamentals & Windows Mock Test',
    studentId: 'st-6', // Riya Sen (logged-in default email match)
    score: 80,
    maxScore: 100,
    correctCount: 4,
    wrongCount: 1,
    skippedCount: 0,
    submittedAt: '2026-05-20',
    durationSeconds: 1240,
    answers: { 0: 1, 1: 2, 2: 0, 3: 0, 4: 1 } // Answered matching correct options
  },
  {
    id: 'att-2',
    testId: 'test-2',
    testTitle: 'DCA Word Formatting & Excel Formula Drill',
    studentId: 'st-1',
    score: 60,
    maxScore: 80,
    correctCount: 3,
    wrongCount: 1,
    skippedCount: 0,
    submittedAt: '2026-05-18',
    durationSeconds: 980,
    answers: { 0: 1, 1: 2, 2: 0, 3: 1 }
  }
];

export const initialWeakAreas: WeakAreaDetail[] = [
  { subject: 'MS Excel', topic: 'Spreadsheet Formulas', accuracy: 40, questionsAttempted: 15, recommendedResource: 'Practice AVERAGE(), VLOOKUP(), and IF() exercises in Lab Sheet 3' },
  { subject: 'Computer Fundamentals', topic: 'Windows Operations & Shortcuts', accuracy: 33, questionsAttempted: 12, recommendedResource: 'Review Chapter 2 Operating System Commands' },
  { subject: 'Internet Concepts', topic: 'Network Security & Ports', accuracy: 48, questionsAttempted: 25, recommendedResource: 'Attempt CCNA Intro Mock Drill and SSL Protocols Quiz' },
  { subject: 'O Level', topic: 'C Program Operators', accuracy: 50, questionsAttempted: 10, recommendedResource: 'Review loops, logical operations, and memory storage' }
];

export const initialPerformanceRecords = [
  { date: 'May 1', controlAverage: 65, boosterAverage: 71 },
  { date: 'May 5', controlAverage: 67, boosterAverage: 73 },
  { date: 'May 9', controlAverage: 70, boosterAverage: 76 },
  { date: 'May 13', controlAverage: 69, boosterAverage: 78 },
  { date: 'May 17', controlAverage: 71, boosterAverage: 80 },
  { date: 'May 21', controlAverage: 72, boosterAverage: 82 },
  { date: 'May 25', controlAverage: 73, boosterAverage: 85 }
];
