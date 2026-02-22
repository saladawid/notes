import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './NoteEditorPage.module.css';
import { useNote } from '../../hooks/useNote';
import { useTags } from '../../hooks/useTags';
import { notesService } from '../../services/notesService';
import { TagSelector } from '../../components/TagSelector/TagSelector';
import { NoteHistory } from '../../components/NoteHistory/NoteHistory';
import { Button } from '../../components/Button/Button';
import { Spinner } from '../../components/Spinner/Spinner';

export function NoteEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id;

  const {
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
  } = useNote(id);

  const { tags: allTags, createTag } = useTags();

  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsCreating(true);
    setCreateError('');
    try {
      const note = await notesService.createNote(newTitle.trim());
      navigate(`/notes/${note._id}`, { replace: true });
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create note');
      setIsCreating(false);
    }
  };

  const handleTagChange = async (ids: string[]) => {
    if (!id || !note) return;
    await notesService.updateNote(id, { tags: ids });
  };

  const handleHistoryToggle = async () => {
    if (!showHistory && history.length === 0) {
      await loadHistory();
    }
    setShowHistory(v => !v);
  };

  if (isNew) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <Link to="/notes" className={styles.backLink}>← Back</Link>
          <span className={styles.headerTitle}>New Note</span>
        </header>
        <main style={{ padding: '2rem', maxWidth: '32rem', margin: '0 auto' }}>
          {createError && <div className={styles.errorAlert}>{createError}</div>}
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              className={styles.titleInput}
              style={{ flex: 1, fontSize: '1rem', fontWeight: 500, padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--color-border)' }}
              placeholder="Note title…"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              autoFocus
            />
            <Button type="submit" isLoading={isCreating}>Create</Button>
          </form>
        </main>
      </div>
    );
  }

  if (isLoading) return <Spinner centered />;

  if (!note && !isLoading) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <Link to="/notes" className={styles.backLink}>← Back</Link>
        </header>
        <main style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-danger)' }}>
          {error ?? 'Note not found'}
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/notes" className={styles.backLink}>← Back</Link>
        <span className={styles.headerTitle}>{title || 'Untitled'}</span>
        {isSaving && (
          <div className={styles.savingBadge}>
            <Spinner size="sm" />
            Saving…
          </div>
        )}
        <Button size="sm" onClick={saveNow} isLoading={isSaving}>
          Save
        </Button>
      </header>

      <div className={styles.main}>
        <div className={styles.editor}>
          {error && <div className={styles.errorAlert}>{error}</div>}
          <textarea
            className={styles.titleInput}
            rows={1}
            placeholder="Untitled"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className={styles.contentArea}
            placeholder="Start writing…"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <span className={styles.sidebarLabel}>Tags</span>
            <TagSelector
              allTags={allTags}
              selectedIds={note?.tags.map(t => t._id) ?? []}
              onChange={handleTagChange}
              onCreateTag={createTag}
            />
          </div>

          {note && (
            <div className={styles.sidebarSection}>
              <span className={styles.sidebarLabel}>History</span>
              <Button
                variant="ghost"
                size="sm"
                className={styles.historyToggle}
                onClick={handleHistoryToggle}
              >
                {showHistory ? 'Hide history' : 'Show history'}
              </Button>
              {showHistory && (
                <NoteHistory history={history} isLoading={historyLoading} />
              )}
            </div>
          )}

          {note && (
            <div className={styles.sidebarSection}>
              <span className={styles.sidebarLabel}>Info</span>
              <div className={styles.metaInfo}>
                <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
                <span>Modified: {new Date(note.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
