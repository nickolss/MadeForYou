"use client";

import * as React from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as habitsService from '../services/habit';
import { Habit, HabitEntry } from '../types/habit';

export function useHabits() {
  const { currentUser } = useAuth();
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [entries, setEntries] = React.useState<HabitEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadHabits = React.useCallback(async () => {
    if (!currentUser) {
      setHabits([]);
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [habitsData, entriesData] = await Promise.all([
        habitsService.getHabits(currentUser.uid),
        habitsService.getHabitEntries(currentUser.uid),
      ]);
      setHabits(habitsData);
      setEntries(entriesData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao carregar hábitos');
      setError(error);
      console.error('Erro ao carregar hábitos:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  React.useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  const createHabit = React.useCallback(async (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      const newHabit = await habitsService.createHabit(currentUser.uid, habit);
      setHabits((prev) => [newHabit, ...prev]);
      return newHabit;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao criar hábito');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  const updateHabit = React.useCallback(async (habitId: number, updates: Partial<Habit>) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      const updatedHabit = await habitsService.updateHabit(currentUser.uid, habitId, updates);
      setHabits((prev) => prev.map((h) => (h.id === habitId ? updatedHabit : h)));
      return updatedHabit;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao atualizar hábito');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  const deleteHabit = React.useCallback(async (habitId: number) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      await habitsService.deleteHabit(currentUser.uid, habitId);
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      // Remove visualmente as entradas associadas
      setEntries((prev) => prev.filter((e) => e.habitId !== habitId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao deletar hábito');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  const toggleHabitEntry = React.useCallback(async (habitId: number, date: string) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      // Verifica se já existe uma entrada visualmente no estado local
      const existingEntry = entries.find(e => e.habitId === habitId && e.date === date);
      
      if (existingEntry) {
        if (existingEntry.completed) {
          await habitsService.deleteHabitEntry(currentUser.uid, existingEntry.id);
          setEntries((prev) => prev.filter((e) => e.id !== existingEntry.id));
        } else {
          const updated = await habitsService.upsertHabitEntry(currentUser.uid, {
            habitId,
            date,
            completed: true,
            notes: existingEntry.notes
          });
          setEntries((prev) => prev.map((e) => (e.id === existingEntry.id ? updated : e)));
        }
      } else {
        const newEntry = await habitsService.upsertHabitEntry(currentUser.uid, {
          habitId,
          date,
          completed: true,
        });
        setEntries((prev) => [...prev, newEntry]);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao atualizar entrada de hábito');
      setError(error);
      throw error;
    }
  }, [currentUser, entries]);

  return {
    habits,
    entries,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabitEntry,
    refreshHabits: loadHabits,
  };
}