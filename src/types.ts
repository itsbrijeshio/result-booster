export interface Student {
  id: string;
  name: string;
  email: string;
  batchId: string;
  batchName: string;
  testsAttempted: number;
  averageScore: number; // e.g., 78%
  joinedDate: string;
  status: 'active' | 'inactive';
  weakSubjects: string[];
}

export interface Batch {
  id: string;
  name: string;
  studentCount: number;
  schedule: string;
  avgPerformance: number; // e.g., 82%
  activeTestsCount: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIdx: number;
  tags: string[]; // e.g., ["MS Excel", "CCC Essentials", "Internet Concepts"]
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Test {
  id: string;
  title: string;
  durationMinutes: number;
  batchId: string;
  batchName: string;
  questionCount: number;
  totalMarks: number;
  status: 'active' | 'draft' | 'archived';
  description: string;
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  studentId: string;
  score: number; // e.g., 74
  maxScore: number; // e.g., 100
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  submittedAt: string;
  durationSeconds: number;
  answers: Record<number, number>; // questionIdx -> chosenOptionIdx
}

export interface WeakAreaDetail {
  subject: string;
  topic: string;
  accuracy: number; // e.g., 45
  questionsAttempted: number;
  recommendedResource: string;
}

export interface OwnerDashboardStats {
  totalActiveStudents: number;
  totalBatches: number;
  totalTestsCreated: number;
  averageScore: number;
  studentsGrowth: number;
  batchesGrowth: number;
  testsGrowth: number;
  averageScoreGrowth: number;
}
