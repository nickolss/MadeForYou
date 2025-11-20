"use client";

import * as React from 'react';
import { Task } from '../types/task'; 
import { useAuth } from '../contexts/AuthContext';
import * as tasksService from '../services/task';

export function useTasks() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadTasks = React.useCallback(async () => {
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await tasksService.getTasks(currentUser.uid);
      setTasks(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao carregar tarefas');
      setError(error);
      console.error('Erro ao carregar tarefas:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  React.useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = React.useCallback(async (task: Omit<Task, 'id' | 'createdAt'>) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      const newTask = await tasksService.createTask(currentUser.uid, task);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao criar tarefa');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  const updateTask = React.useCallback(async (taskId: number, updates: Partial<Task>) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      const updatedTask = await tasksService.updateTask(currentUser.uid, taskId, updates);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
      return updatedTask;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao atualizar tarefa');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  const deleteTask = React.useCallback(async (taskId: number) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      await tasksService.deleteTask(currentUser.uid, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao deletar tarefa');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: loadTasks,
  };
}