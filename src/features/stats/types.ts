export interface DailyStats {
  date: string;
  sessionsCompleted: number;
  sessionsInterrupted: number;
  totalFocusMinutes: number;
}

export interface WeeklyStats {
  days: DailyStats[];
  totalHours: number;
  totalSessions: number;
}
