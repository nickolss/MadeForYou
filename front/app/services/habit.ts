import { Habit, HabitEntry } from '../types/habit';
import { api } from './api';

interface HabitDTO {
  id: number;
  name: string;
  description?: string;
  color?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetDays?: number;
  createdAt: string;
}

interface HabitEntryDTO {
  id: number;
  habitId: number;
  date: string;
  completed: boolean;
  notes?: string;
}

// Tipos para envio (Payloads) sem ID ou datas de criação
type HabitRequest = Omit<HabitDTO, 'id' | 'createdAt'>;
type HabitEntryRequest = Omit<HabitEntryDTO, 'id'>;


// --- ADAPTERS (Mapeamento de Dados) ---
/**
 * Converte DTO Java -> Interface Habit (Frontend)
 */
function toFrontendHabit(data: HabitDTO): Habit {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    color: data.color,
    frequency: data.frequency,
    targetDays: data.targetDays,
    createdAt: data.createdAt,
  };
}

/**
 * Converte Habit (Frontend) -> DTO Java
 */
function toBackendHabit(habit: Partial<Habit>): HabitRequest {
  return {
    name: habit.name || '',
    description: habit.description,
    color: habit.color,
    frequency: habit.frequency || 'daily',
    targetDays: habit.targetDays,
  };
}

/**
 * Converte DTO Java -> Interface HabitEntry (Frontend)
 */
function toFrontendEntry(data: HabitEntryDTO): HabitEntry {
  return {
    id: data.id,
    habitId: data.habitId,
    date: data.date,
    completed: data.completed,
    notes: data.notes,
  };
}

/**
 * Converte HabitEntry (Frontend) -> DTO Java
 */
function toBackendEntry(entry: Partial<HabitEntry>): HabitEntryRequest {
  return {
    habitId: entry.habitId!,
    date: entry.date || new Date().toISOString().split('T')[0],
    completed: entry.completed ?? false,
    notes: entry.notes,
  };
}

// --- HABITS SERVICE ---
/**
 * Busca todos os hábitos do usuário
 * Endpoint: GET /api/habits?userId={userId}
 */
export async function getHabits(userId: string): Promise<Habit[]> {
  try {
    // Tipamos o retorno do get como array de HabitDTO
    const { data } = await api.get<HabitDTO[]>('/habits', {
      params: { userId }
    });

    return data.map(toFrontendHabit);
  } catch (error) {
    console.error('Erro ao buscar hábitos:', error);
    throw error;
  }
}

/**
 * Cria um novo hábito
 * Endpoint: POST /api/habits?userId={userId}
 */
export async function createHabit(userId: string, habit: Omit<Habit, 'id' | 'createdAt'>): Promise<Habit> {
  try {
    const payload = toBackendHabit(habit);
    
    const { data } = await api.post<HabitDTO>('/habits', payload, {
      params: { userId }
    });

    return toFrontendHabit(data);
  } catch (error) {
    console.error('Erro ao criar hábito:', error);
    throw error;
  }
}

/**
 * Atualiza um hábito
 * Endpoint: PATCH /api/habits/{id}?userId={userId}
 */
export async function updateHabit(userId: string, habitId: number, updates: Partial<Habit>): Promise<Habit> {
  try {
    const payload = toBackendHabit(updates);

    const { data } = await api.patch<HabitDTO>(`/habits/${habitId}`, payload, {
      params: { userId }
    });

    return toFrontendHabit(data);
  } catch (error) {
    console.error('Erro ao atualizar hábito:', error);
    throw error;
  }
}

/**
 * Deleta um hábito
 * Endpoint: DELETE /api/habits/{id}?userId={userId}
 */
export async function deleteHabit(userId: string, habitId: number): Promise<void> {
  try {
    await api.delete(`/habits/${habitId}`, {
      params: { userId }
    });
  } catch (error) {
    console.error('Erro ao deletar hábito:', error);
    throw error;
  }
}

// --- ENTRIES SERVICE ---
/**
 * Busca entradas de hábitos (Histórico)
 * Endpoint: GET /api/entries?userId={userId}&habitId={...}&startDate={...}
 */
export async function getHabitEntries(
  userId: string, 
  habitId?: number, 
  startDate?: string, 
  endDate?: string
): Promise<HabitEntry[]> {
  try {
    const { data } = await api.get<HabitEntryDTO[]>('/entries', {
      params: {
        userId,
        habitId,
        startDate,
        endDate
      }
    });

    return data.map(toFrontendEntry);
  } catch (error) {
    console.error('Erro ao buscar entradas de hábitos:', error);
    throw error;
  }
}

/**
 * Cria ou atualiza uma entrada de hábito (Upsert)
 * Endpoint: POST /api/entries?userId={userId}
 */
export async function upsertHabitEntry(userId: string, entry: Omit<HabitEntry, 'id'>): Promise<HabitEntry> {
  try {
    const payload = toBackendEntry(entry);

    const { data } = await api.post<HabitEntryDTO>('/entries', payload, {
      params: { userId }
    });

    return toFrontendEntry(data);
  } catch (error) {
    console.error('Erro ao salvar entrada de hábito:', error);
    throw error;
  }
}

/**
 * Deleta uma entrada de hábito
 * Endpoint: DELETE /api/entries/{id}?userId={userId}
 */
export async function deleteHabitEntry(userId: string, entryId: number): Promise<void> {
  try {
    await api.delete(`/entries/${entryId}`, {
      params: { userId }
    });
  } catch (error) {
    console.error('Erro ao deletar entrada de hábito:', error);
    throw error;
  }
}