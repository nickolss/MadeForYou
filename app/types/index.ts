export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: string;
  createdAt?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  progress: number;
  status?: 'planning' | 'in-progress' | 'on-hold' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  startDate?: string;
  dueDate?: string;
  createdAt?: string;
  color?: string;
}

export interface Account {
  id: number;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'other';
  balance: number;
  bank?: string;
}

export interface Transaction {
  id: number;
  accountId: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

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

export interface Note {
  id: number;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
  color?: string;
}