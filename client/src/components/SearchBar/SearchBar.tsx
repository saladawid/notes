import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search notes…' }: SearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} aria-hidden="true">&#128269;</span>
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search notes"
      />
    </div>
  );
}
