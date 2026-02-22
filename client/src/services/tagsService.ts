import { http } from './http';
import type { Tag } from '../types';

export const tagsService = {
  getTags: () => http.get<Tag[]>('/api/tags'),

  createTag: (name: string) => http.post<Tag>('/api/tags', { name }),

  deleteTag: (id: string) => http.delete<void>(`/api/tags/${id}`),
};
