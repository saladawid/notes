import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './NotesListPage.module.css';
import { useAuth } from '../../context/AuthContext';
import { useNotes } from '../../hooks/useNotes';
import { useTags } from '../../hooks/useTags';
import { useDebounce } from '../../hooks/useDebounce';
import { NoteCard } from '../../components/NoteCard/NoteCard';
import { SearchBar } from '../../components/SearchBar/SearchBar';
import { SortControls } from '../../components/SortControls/SortControls';
import { TagBadge } from '../../components/TagBadge/TagBadge';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { Spinner } from '../../components/Spinner/Spinner';
import type { SortField, SortOrder } from '../../types';

export function NotesListPage() {
  const { user, logout } = useAuth();

  const [searchInput, setSearchInput] = useState('');
  const [sort, setSort] = useState<SortField>('updatedAt');
  const [order, setOrder] = useState<SortOrder>('desc');
  const [activeTagIds, setActiveTagIds] = useState<string[]>([]);

  const debouncedSearch = useDebounce(searchInput, 400);

  const { notes, isLoading, error, deleteNote } = useNotes({
    search: debouncedSearch || undefined,
    sort,
    order,
    tags: activeTagIds.length > 0 ? activeTagIds.join(',') : undefined,
  });

  const { tags } = useTags();

  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteNote(deleteTarget);
    setDeleteTarget(null);
    setIsDeleting(false);
  };

  const toggleTag = (id: string) => {
    setActiveTagIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.logo}>Notes</span>
        <div className={styles.headerRight}>
          {user && <span className={styles.userName}>{user.name}</span>}
          <Button variant="ghost" size="sm" onClick={logout}>
            Sign Out
          </Button>
          <Link to="/notes/new">
            <Button size="sm">+ New Note</Button>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.toolbar}>
          <SearchBar value={searchInput} onChange={setSearchInput} />
          <SortControls
            sort={sort}
            order={order}
            onSortChange={setSort}
            onOrderChange={setOrder}
          />
        </div>

        {tags.length > 0 && (
          <div className={styles.activeTagFilter}>
            <span className={styles.filterLabel}>Filter by tag:</span>
            {tags.map(tag => (
              <span
                key={tag._id}
                onClick={() => toggleTag(tag._id)}
                style={{ cursor: 'pointer', opacity: activeTagIds.includes(tag._id) ? 1 : 0.5 }}
              >
                <TagBadge tag={tag} />
              </span>
            ))}
          </div>
        )}

        {isLoading && <Spinner centered />}
        {error && <p className={styles.errorMsg}>{error}</p>}

        {!isLoading && !error && notes.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No notes yet</p>
            <p>Create your first note to get started.</p>
          </div>
        )}

        {!isLoading && !error && notes.length > 0 && (
          <div className={styles.grid}>
            {notes.map(note => (
              <NoteCard key={note._id} note={note} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Note"
      >
        <p>Are you sure you want to delete this note? This action cannot be undone.</p>
        <Modal.Actions>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting}>
            Delete
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
}
