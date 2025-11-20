export interface Habit {
  id: number;
  name: string;
  description?: string;
  color?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetDays?: number; // Para frequência custom (ex: 3x por semana)
  createdAt: string;
}

export interface HabitEntry {
  id: number;
  habitId: number;
  date: string;
  completed: boolean;
  notes?: string;
}