import { useState } from 'react';
import styles from './NoteHistory.module.css';
import { Spinner } from '../Spinner/Spinner';
import type { NoteHistory as NoteHistoryType } from '../../types';

interface NoteHistoryProps {
  history: NoteHistoryType[];
  isLoading: boolean;
}

function HistoryEntry({ entry }: { entry: NoteHistoryType }) {
  const [open, setOpen] = useState(false);
  const date = new Date(entry.savedAt).toLocaleString();

  return (
    <div className={styles.entry}>
      <div className={styles.header} onClick={() => setOpen(v => !v)}>
        <div>
          <span className={styles.date}>{date}</span>
          {entry.title && (
            <span className={styles.title}> — {entry.title}</span>
          )}
        </div>
        <span className={[styles.chevron, open ? styles.open : ''].join(' ')}>▼</span>
      </div>
      {open && (
        <pre className={styles.body}>{entry.content || <em>Empty</em>}</pre>
      )}
    </div>
  );
}

export function NoteHistory({ history, isLoading }: NoteHistoryProps) {
  if (isLoading) return <Spinner centered />;

  return (
    <div className={styles.wrapper}>
      {history.length === 0 ? (
        <p className={styles.empty}>No history yet.</p>
      ) : (
        history.map((entry, i) => <HistoryEntry key={i} entry={entry} />)
      )}
    </div>
  );
}
