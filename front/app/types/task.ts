export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: string;
  createdAt?: string;
}