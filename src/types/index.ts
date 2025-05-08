
export type User = {
  id: string;
  email: string;
  name?: string;
};

export type HabitTarget = 'daily' | 'weekdays' | 'weekends' | 'custom';

export type Habit = {
  id: string;
  name: string;
  target: HabitTarget;
  targetDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  startDate: string; // ISO string
  createdAt: string; // ISO string
  userId: string;
};

export type HabitStatus = 'completed' | 'missed' | 'skipped' | null;

export type HabitLog = {
  [date: string]: HabitStatus;
};

export type HabitWithStats = Habit & {
  logs: HabitLog;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
};

export type UserPreferences = {
  darkMode: boolean;
  timeRange: 'week' | 'month' | 'year';
  showMotivationalQuote: boolean;
};

export type MotivationalQuote = {
  text: string;
  author: string;
};
