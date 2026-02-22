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
  const [newContent, setNewContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsCreating(true);
    setCreateError('');
    try {
      const note = await notesService.createNote(newTitle.trim(), newContent);
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

        <div className={styles.newMain}>
          <form className={styles.newCard} onSubmit={handleCreate}>
            {createError && (
              <div style={{ padding: 'var(--space-3) var(--space-6)' }}>
                <div className={styles.errorAlert}>{createError}</div>
              </div>
            )}

            <input
              className={styles.newTitleInput}
              placeholder="Note title…"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              autoFocus
              required
            />

            <textarea
              className={styles.newContentArea}
              placeholder="Start writing…"
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />

            <div className={styles.newFooter}>
              <Link to="/notes" className={styles.backLink}>Cancel</Link>
              <Button type="submit" isLoading={isCreating} disabled={!newTitle.trim()}>
                Create Note
              </Button>
            </div>
          </form>
        </div>
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
