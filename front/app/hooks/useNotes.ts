"use client";

import * as React from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as notesService from '../services/note';
import { Note } from '../types/note';

export function useNotes() {
  const { currentUser } = useAuth();
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadNotes = React.useCallback(async () => {
    if (!currentUser) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await notesService.getNotes(currentUser.uid);
      setNotes(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao carregar notas');
      setError(error);
      console.error('Erro ao carregar notas:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  React.useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const createNote = React.useCallback(async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      const newNote = await notesService.createNote(currentUser.uid, note);
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao criar nota');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  const updateNote = React.useCallback(async (noteId: number, updates: Partial<Note>) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      const updatedNote = await notesService.updateNote(currentUser.uid, noteId, updates);
      setNotes((prev) => prev.map((n) => (n.id === noteId ? updatedNote : n)));
      return updatedNote;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao atualizar nota');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  const deleteNote = React.useCallback(async (noteId: number) => {
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      await notesService.deleteNote(currentUser.uid, noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao deletar nota');
      setError(error);
      throw error;
    }
  }, [currentUser]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refreshNotes: loadNotes,
  };
}