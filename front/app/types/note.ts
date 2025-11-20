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