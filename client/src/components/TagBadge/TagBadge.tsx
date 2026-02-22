import styles from './TagBadge.module.css';
import type { Tag } from '../../types';

interface TagBadgeProps {
  tag: Tag;
  onRemove?: (id: string) => void;
}

export function TagBadge({ tag, onRemove }: TagBadgeProps) {
  return (
    <span className={styles.badge}>
      {tag.name}
      {onRemove && (
        <button
          className={styles.removeBtn}
          onClick={() => onRemove(tag._id)}
          aria-label={`Remove tag ${tag.name}`}
          type="button"
        >
          ×
        </button>
      )}
    </span>
  );
}
