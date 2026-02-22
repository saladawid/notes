import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

export function Spinner({ size = 'md', centered = false }: SpinnerProps) {
  const spinner = (
    <span
      className={[styles.spinner, size !== 'md' ? styles[size] : ''].join(' ')}
      aria-label="Loading"
      role="status"
    />
  );

  if (centered) {
    return <div className={styles.centered}>{spinner}</div>;
  }

  return spinner;
}
