
export enum AppMode {
  COMFORT = 'Comfort',
  CHEER = 'Cheer',
  CALM = 'Calm',
  STUDY_BUDDY = 'Study Buddy',
  CAREER_COACH = 'Career Coach',
  SPIRIT = 'Spirit',
  AI_MENTOR = 'AI Mentor'
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface UserStats {
  stars: number;
  level: number;
  focusMinutes: number;
  tasksCompleted: number;
  quizzesSolved: number;
}

export interface Song {
  id: string;
  name: string;
  artist: string;
  time: string;
  url: string;
  type: 'local' | 'youtube';
}

export interface Attachment {
  type: 'image' | 'link' | 'doc';
  data: string; // Base64 for images, URL for links, filename for docs
  mimeType?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  mode?: AppMode;
  timestamp: number;
  attachment?: Attachment;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}
