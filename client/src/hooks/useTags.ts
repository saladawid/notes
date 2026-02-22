import { useCallback, useEffect, useState } from 'react';
import { tagsService } from '../services/tagsService';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../services/http';
import type { Tag } from '../types';

export function useTags() {
  const { logout } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await tagsService.getTags();
      setTags(data);
      setError(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load tags');
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const createTag = useCallback(async (name: string): Promise<Tag | null> => {
    try {
      const tag = await tagsService.createTag(name);
      setTags(prev => [...prev, tag]);
      return tag;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return null;
      }
      setError(err instanceof Error ? err.message : 'Failed to create tag');
      return null;
    }
  }, [logout]);

  const deleteTag = useCallback(async (id: string) => {
    try {
      await tagsService.deleteTag(id);
      setTags(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to delete tag');
    }
  }, [logout]);

  return { tags, isLoading, error, createTag, deleteTag, refetch: fetchTags };
}
