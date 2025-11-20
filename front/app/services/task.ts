import { Task } from '../types/task';
import { api } from './api';

// --- DEFINIÇÃO DE DTOs ---
// Interface que espelha o objeto JSON retornado pelo Java

interface TaskDTO {
  id: number;
  text: string;
  completed: boolean;
  // Usamos os mesmos literais da interface Task, ou string genérica se preferir
  priority?: 'low' | 'medium' | 'high' | string;
  category?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
}

// Tipo para o payload de envio (sem ID ou timestamps)
type TaskRequest = Partial<Omit<TaskDTO, 'id' | 'createdAt' | 'updatedAt'>>;

// --- ADAPTERS ---

/**
 * Converte o DTO do Backend Java para a Interface Task do Frontend
 */
function toFrontend(data: TaskDTO): Task {
  return {
    id: data.id,
    text: data.text,
    completed: data.completed,
    priority: data.priority as Task['priority'], // Cast seguro
    category: data.category,
    dueDate: data.dueDate, 
    createdAt: data.createdAt,
  };
}

/**
 * Prepara o objeto para enviar ao Backend (Payload)
 */
function toBackend(task: Partial<Task>): TaskRequest {
  return {
    text: task.text,
    completed: task.completed,
    priority: task.priority,
    category: task.category,
    dueDate: task.dueDate,
    // userId vai na URL
  };
}

// --- SERVICES ---

/**
 * Busca todas as tarefas do usuário
 * Endpoint: GET /api/tasks?userId={userId}
 */
export async function getTasks(userId: string): Promise<Task[]> {
  try {
    // Tipamos o retorno do axios como array de TaskDTO
    const { data } = await api.get<TaskDTO[]>('/tasks', {
      params: { userId }
    });

    return data.map(toFrontend);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    throw error;
  }
}

/**
 * Cria uma nova tarefa
 * Endpoint: POST /api/tasks?userId={userId}
 */
export async function createTask(userId: string, task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
  try {
    const payload = toBackend(task);

    const { data } = await api.post<TaskDTO>('/tasks', payload, {
      params: { userId }
    });

    return toFrontend(data);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    throw error;
  }
}

/**
 * Atualiza uma tarefa
 * Endpoint: PATCH /api/tasks/{id}?userId={userId}
 */
export async function updateTask(userId: string, taskId: number, updates: Partial<Task>): Promise<Task> {
  try {
    const payload = toBackend(updates);

    const { data } = await api.patch<TaskDTO>(`/tasks/${taskId}`, payload, {
      params: { userId }
    });

    return toFrontend(data);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    throw error;
  }
}

/**
 * Deleta uma tarefa
 * Endpoint: DELETE /api/tasks/{id}?userId={userId}
 */
export async function deleteTask(userId: string, taskId: number): Promise<void> {
  try {
    await api.delete(`/tasks/${taskId}`, {
      params: { userId }
    });
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    throw error;
  }
}