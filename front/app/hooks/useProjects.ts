"use client";

import * as React from 'react';
import { Project } from '@/app/types/project'; 
import { useAuth } from '../contexts/AuthContext';
import * as projectsService from '../services/project';

export function useProjects() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadProjects = React.useCallback(async () => {
    if (!currentUser) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await projectsService.getProjects(currentUser.uid);
      setProjects(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao carregar projetos');
      setError(error);
      console.error('Erro ao carregar projetos:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  React.useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const createProject = React.useCallback(async (project: Omit<Project, 'id' | 'createdAt'>) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      const newProject = await projectsService.createProject(currentUser.uid, project);
      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao criar projeto');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  const updateProject = React.useCallback(async (projectId: number, updates: Partial<Project>) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      const updatedProject = await projectsService.updateProject(currentUser.uid, projectId, updates);
      setProjects((prev) => prev.map((p) => (p.id === projectId ? updatedProject : p)));
      return updatedProject;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao atualizar projeto');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  const deleteProject = React.useCallback(async (projectId: number) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      await projectsService.deleteProject(currentUser.uid, projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao deletar projeto');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects: loadProjects,
  };
}