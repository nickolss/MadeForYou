import { isAxiosError } from 'axios';
import { api } from './api';

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// --- DTOs (Data Transfer Objects) ---
// Define exatamente o que o Java manda (CamelCase)
interface UserProfileDTO {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipo para envio de atualizações (Partial do DTO, sem campos de sistema)
type UserProfileRequest = Partial<Omit<UserProfileDTO, 'id' | 'createdAt' | 'updatedAt'>>;

// --- ADAPTERS ---
/**
 * Converte JSON do Java (CamelCase) -> Interface do Front (SnakeCase)
 */
function toFrontend(data: UserProfileDTO): UserProfile {
  return {
    id: data.id,
    email: data.email,
    display_name: data.displayName,
    first_name: data.firstName,
    last_name: data.lastName,
    avatar_url: data.avatarUrl,
    created_at: data.createdAt,
    updated_at: data.updatedAt,
  };
}

/**
 * Converte Interface do Front (SnakeCase) -> JSON para o Java (CamelCase)
 */
function toBackend(updates: Partial<UserProfile>): UserProfileRequest {
  const dto: UserProfileRequest = {};
  
  if (updates.display_name !== undefined) dto.displayName = updates.display_name;
  if (updates.first_name !== undefined) dto.firstName = updates.first_name;
  if (updates.last_name !== undefined) dto.lastName = updates.last_name;
  if (updates.avatar_url !== undefined) dto.avatarUrl = updates.avatar_url;
  if (updates.email !== undefined) dto.email = updates.email;
  
  return dto;
}

// --- SERVICES ---
/**
 * Cria ou atualiza o perfil do usuário no Backend Java
 * Endpoint: POST /api/users/sync
 */
export async function syncUserProfile(firebaseUid: string, email: string, displayName?: string) {
  try {
    const payload = {
      id: firebaseUid,
      email: email,
      displayName: displayName || email.split('@')[0],
    };

    const { data } = await api.post<UserProfileDTO>('/users/sync', payload);
    return toFrontend(data);
  } catch (error) {
    console.error('Erro ao sincronizar perfil:', error);
    throw error;
  }
}

/**
 * Busca o perfil do usuário
 * Endpoint: GET /api/users/{id}
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data } = await api.get<UserProfileDTO>(`/users/${userId}`);
    return toFrontend(data);
  } catch (error) {
    // Tratamento seguro de erro do Axios sem usar 'any'
    if (isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
}

/**
 * Atualiza o perfil do usuário
 * Endpoint: PATCH /api/users/{id}
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
) {
  try {
    const backendPayload = toBackend(updates);

    const { data } = await api.patch<UserProfileDTO>(`/users/${userId}`, backendPayload);
    return toFrontend(data);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
}