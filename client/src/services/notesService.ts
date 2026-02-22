import { http } from './http';
import type { Note, NoteHistory, NotesFilter } from '../types';

function buildQuery(filter: NotesFilter): string {
  const params = new URLSearchParams();
  if (filter.search) params.set('search', filter.search);
  if (filter.sort) params.set('sort', filter.sort);
  if (filter.order) params.set('order', filter.order);
  if (filter.tags) params.set('tags', filter.tags);
  const q = params.toString();
  return q ? `?${q}` : '';
}

export const notesService = {
  getNotes: (filter: NotesFilter = {}) =>
    http.get<Note[]>(`/api/notes${buildQuery(filter)}`),

  getNoteById: (id: string) =>
    http.get<Note>(`/api/notes/${id}`),

  createNote: (title: string, content = '', tags: string[] = []) =>
    http.post<Note>('/api/notes', { title, content, tags }),

  updateNote: (id: string, data: { title?: string; content?: string; tags?: string[] }) =>
    http.put<Note>(`/api/notes/${id}`, data),

  deleteNote: (id: string) =>
    http.delete<void>(`/api/notes/${id}`),

  getNoteHistory: (id: string) =>
    http.get<NoteHistory[]>(`/api/notes/${id}/history`),
};
