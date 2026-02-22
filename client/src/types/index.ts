export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Tag {
  _id: string;
  name: string;
}

export interface NoteHistory {
  title: string;
  content: string;
  savedAt: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type SortField = 'createdAt' | 'updatedAt' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface NotesFilter {
  search?: string;
  sort?: SortField;
  order?: SortOrder;
  tags?: string;
}
