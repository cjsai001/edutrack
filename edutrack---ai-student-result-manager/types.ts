export interface SubjectMarks {
  math: number;
  science: number;
  english: number;
  history: number;
  programming: number;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  marks: SubjectMarks;
  aiAnalysis?: string; // Cache for AI feedback
}

export type ViewState = 'DASHBOARD' | 'STUDENTS' | 'ANALYTICS';

export interface AIAnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}
