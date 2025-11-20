import { api } from './api';
import { Project } from '@/app/types/project';

interface ProjectDTO {
  id: number;
  name: string;
  description?: string;
  progress?: number;
  status?: 'planning' | 'in-progress' | 'on-hold' | 'completed' | string;
  priority?: 'low' | 'medium' | 'high' | string;
  startDate?: string;
  dueDate?: string;
  color?: string;
  createdAt: string;
}

type ProjectRequest = Partial<Omit<ProjectDTO, 'id' | 'createdAt'>>;


// --- ADAPTERS ---
/**
 * Converte o DTO do Backend Java para a Interface Project do Frontend
 */
function toFrontend(data: ProjectDTO): Project {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    progress: data.progress ?? 0,
    status: data.status as Project['status'], // Cast seguro se os valores baterem
    priority: data.priority as Project['priority'],
    startDate: data.startDate,
    dueDate: data.dueDate,
    color: data.color,
    createdAt: data.createdAt,
  };
}

/**
 * Prepara o objeto para enviar ao Backend
 */
function toBackend(project: Partial<Project>): ProjectRequest {
  return {
    name: project.name,
    description: project.description,
    progress: project.progress,
    status: project.status,
    priority: project.priority,
    startDate: project.startDate,
    dueDate: project.dueDate,
    color: project.color,
  };
}

// --- SERVICES ---

/**
 * Busca todos os projetos do usuário
 * Endpoint: GET /api/projects?userId={userId}
 */
export async function getProjects(userId: string): Promise<Project[]> {
  try {
    // Informamos ao axios que a resposta é um array de ProjectDTO
    const { data } = await api.get<ProjectDTO[]>('/projects', {
      params: { userId }
    });

    return data.map(toFrontend);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    throw error;
  }
}

/**
 * Cria um novo projeto
 * Endpoint: POST /api/projects?userId={userId}
 */
export async function createProject(userId: string, project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
  try {
    const payload = toBackend(project);

    const { data } = await api.post<ProjectDTO>('/projects', payload, {
      params: { userId }
    });

    return toFrontend(data);
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    throw error;
  }
}

/**
 * Atualiza um projeto
 * Endpoint: PATCH /api/projects/{id}?userId={userId}
 */
export async function updateProject(userId: string, projectId: number, updates: Partial<Project>): Promise<Project> {
  try {
    const payload = toBackend(updates);

    const { data } = await api.patch<ProjectDTO>(`/projects/${projectId}`, payload, {
      params: { userId }
    });

    return toFrontend(data);
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    throw error;
  }
}

/**
 * Deleta um projeto
 * Endpoint: DELETE /api/projects/{id}?userId={userId}
 */
export async function deleteProject(userId: string, projectId: number): Promise<void> {
  try {
    await api.delete(`/projects/${projectId}`, {
      params: { userId }
    });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    throw error;
  }
}