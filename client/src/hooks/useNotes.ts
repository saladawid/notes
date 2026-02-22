import { useCallback, useEffect, useState } from 'react';
import { notesService } from '../services/notesService';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/http';
import type { Note, NotesFilter } from '../types';

export function useNotes(filter: NotesFilter = {}) {
  const { logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await notesService.getNotes(filter);
      setNotes(data);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout, filter.search, filter.sort, filter.order, filter.tags]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const deleteNote = useCallback(async (id: string) => {
    try {
      await notesService.deleteNote(id);
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to delete note');
    }
  }, [logout]);

  return { notes, isLoading, error, deleteNote, refetch: fetchNotes };
}
