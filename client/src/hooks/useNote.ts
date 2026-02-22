import { useCallback, useEffect, useRef, useState } from 'react';
import { notesService } from '../services/notesService';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from './useDebounce';
import { ApiError } from '../services/http';
import type { Note, NoteHistory } from '../types';

interface UseNoteReturn {
  note: Note | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  title: string;
  content: string;
  setTitle: (v: string) => void;
  setContent: (v: string) => void;
  saveNow: () => Promise<void>;
  history: NoteHistory[];
  historyLoading: boolean;
  loadHistory: () => Promise<void>;
}

export function useNote(id: string | undefined): UseNoteReturn {
  const { logout } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [history, setHistory] = useState<NoteHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    notesService.getNoteById(id)
      .then(data => {
        setNote(data);
        setTitle(data.title);
        setContent(data.content);
        setError(null);
      })
      .catch(err => {
        if (err instanceof ApiError && err.status === 401) {
          logout();
          return;
        }
        setError(err instanceof Error ? err.message : 'Failed to load note');
      })
      .finally(() => setIsLoading(false));
  }, [id, logout]);

  const debouncedTitle = useDebounce(title, 3000);
  const debouncedContent = useDebounce(content, 3000);

  const doSave = useCallback(async (t: string, c: string) => {
    if (!id || !note) return;
    try {
      setIsSaving(true);
      const updated = await notesService.updateNote(id, { title: t, content: c });
      setNote(updated);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setIsSaving(false);
    }
  }, [id, note, logout]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!id) return;
    doSave(debouncedTitle, debouncedContent);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle, debouncedContent]);

  const saveNow = useCallback(async () => {
    await doSave(title, content);
  }, [doSave, title, content]);

  const loadHistory = useCallback(async () => {
    if (!id) return;
    try {
      setHistoryLoading(true);
      const data = await notesService.getNoteHistory(id);
      setHistory(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  }, [id, logout]);

  return {
    note,
    isLoading,
    isSaving,
    error,
    title,
    content,
    setTitle,
    setContent,
    saveNow,
    history,
    historyLoading,
    loadHistory,
  };
}
