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