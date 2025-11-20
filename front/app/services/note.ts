import { Note } from '../types/note';
import { api } from './api';

interface NoteDTO {
  id: number;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  isPinned?: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipo para o payload de envio (sem campos de sistema)
type NoteRequest = Partial<Omit<NoteDTO, 'id' | 'createdAt' | 'updatedAt'>>;

// --- ADAPTERS ---
/**
 * Adapter: Converte o JSON do Backend Java para a Interface Note do Frontend
 */
function toFrontend(data: NoteDTO): Note {
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    category: data.category,
    tags: data.tags || [], // Garante array vazio se vier null
    isPinned: data.isPinned ?? false, 
    color: data.color,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

/**
 * Adapter: Prepara o objeto para enviar ao Backend
 */
function toBackend(note: Partial<Note>): NoteRequest {
  return {
    title: note.title,
    content: note.content,
    category: note.category,
    tags: note.tags,
    isPinned: note.isPinned, 
    color: note.color,
    // userId vai na URL
  };
}

// --- SERVICE METHODS ---
/**
 * Busca todas as notas do usuário
 * Endpoint: GET /api/notes?userId={userId}
 */
export async function getNotes(userId: string): Promise<Note[]> {
  try {
    // Tipando o retorno do Axios como array de NoteDTO
    const { data } = await api.get<NoteDTO[]>('/notes', {
      params: { userId }
    });

    return data.map(toFrontend);
  } catch (error) {
    console.error('Erro ao buscar notas:', error);
    throw error;
  }
}

/**
 * Cria uma nova nota
 * Endpoint: POST /api/notes?userId={userId}
 */
export async function createNote(userId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
  try {
    const payload = toBackend(note);

    const { data } = await api.post<NoteDTO>('/notes', payload, {
      params: { userId }
    });

    return toFrontend(data);
  } catch (error) {
    console.error('Erro ao criar nota:', error);
    throw error;
  }
}

/**
 * Atualiza uma nota
 * Endpoint: PATCH /api/notes/{id}?userId={userId}
 */
export async function updateNote(userId: string, noteId: number, updates: Partial<Note>): Promise<Note> {
  try {
    const payload = toBackend(updates);

    const { data } = await api.patch<NoteDTO>(`/notes/${noteId}`, payload, {
      params: { userId }
    });

    return toFrontend(data);
  } catch (error) {
    console.error('Erro ao atualizar nota:', error);
    throw error;
  }
}

/**
 * Deleta uma nota
 * Endpoint: DELETE /api/notes/{id}?userId={userId}
 */
export async function deleteNote(userId: string, noteId: number): Promise<void> {
  try {
    await api.delete(`/notes/${noteId}`, {
      params: { userId }
    });
  } catch (error) {
    console.error('Erro ao deletar nota:', error);
    throw error;
  }
}