import styles from './SortControls.module.css';
import type { SortField, SortOrder } from '../../types';

interface SortControlsProps {
  sort: SortField;
  order: SortOrder;
  onSortChange: (sort: SortField) => void;
  onOrderChange: (order: SortOrder) => void;
}

export function SortControls({ sort, order, onSortChange, onOrderChange }: SortControlsProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Sort by:</span>
      <select
        className={styles.select}
        value={sort}
        onChange={e => onSortChange(e.target.value as SortField)}
        aria-label="Sort field"
      >
        <option value="updatedAt">Modified</option>
        <option value="createdAt">Created</option>
        <option value="title">Title</option>
      </select>
      <button
        className={styles.orderBtn}
        onClick={() => onOrderChange(order === 'asc' ? 'desc' : 'asc')}
        aria-label={`Order: ${order}`}
        type="button"
      >
        {order === 'asc' ? '↑ Asc' : '↓ Desc'}
      </button>
    </div>
  );
}
