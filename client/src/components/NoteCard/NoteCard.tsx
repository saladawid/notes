import { Link } from 'react-router-dom';
import styles from './NoteCard.module.css';
import { TagBadge } from '../TagBadge/TagBadge';
import type { Note } from '../../types';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const updatedAt = new Date(note.updatedAt).toLocaleDateString();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(note._id);
  };

  return (
    <Link to={`/notes/${note._id}`} className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{note.title}</h3>
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          aria-label="Delete note"
          type="button"
        >
          &#x1F5D1;
        </button>
      </div>

      {note.content && (
        <p className={styles.excerpt}>{note.content}</p>
      )}

      {note.tags.length > 0 && (
        <div className={styles.tags}>
          {note.tags.map(tag => (
            <TagBadge key={tag._id} tag={tag} />
          ))}
        </div>
      )}

      <div className={styles.footer}>Modified {updatedAt}</div>
    </Link>
  );
}
