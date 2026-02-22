import { useEffect, useRef, useState } from 'react';
import styles from './TagSelector.module.css';
import { TagBadge } from '../TagBadge/TagBadge';
import { Button } from '../Button/Button';
import type { Tag } from '../../types';

interface TagSelectorProps {
  allTags: Tag[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onCreateTag?: (name: string) => Promise<Tag | null>;
}

export function TagSelector({ allTags, selectedIds, onChange, onCreateTag }: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [creating, setCreating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const selectedTags = allTags.filter(t => selectedIds.includes(t._id));
  const availableTags = allTags.filter(t => !selectedIds.includes(t._id));

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(x => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleCreate = async () => {
    if (!onCreateTag || !newTagName.trim()) return;
    setCreating(true);
    const tag = await onCreateTag(newTagName.trim());
    if (tag) {
      onChange([...selectedIds, tag._id]);
      setNewTagName('');
    }
    setCreating(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.selected}>
        {selectedTags.map(tag => (
          <TagBadge
            key={tag._id}
            tag={tag}
            onRemove={id => onChange(selectedIds.filter(x => x !== id))}
          />
        ))}
      </div>

      <div className={styles.dropdown} ref={wrapperRef}>
        <div className={styles.addRow}>
          <input
            className={styles.addInput}
            placeholder="Add or create tag…"
            value={newTagName}
            onChange={e => { setNewTagName(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); handleCreate(); }
              if (e.key === 'Escape') setOpen(false);
            }}
          />
          {onCreateTag && (
            <Button size="sm" onClick={handleCreate} isLoading={creating} type="button">
              Create
            </Button>
          )}
        </div>

        {open && (
          <div className={styles.list}>
            {allTags
              .filter(t =>
                !newTagName || t.name.toLowerCase().includes(newTagName.toLowerCase())
              )
              .map(tag => (
                <div
                  key={tag._id}
                  className={[styles.listItem, selectedIds.includes(tag._id) ? styles.active : ''].join(' ')}
                  onClick={() => toggle(tag._id)}
                >
                  <span className={styles.check}>{selectedIds.includes(tag._id) ? '✓' : ''}</span>
                  {tag.name}
                </div>
              ))}
            {availableTags.length === 0 && !newTagName && (
              <div className={styles.empty}>No more tags available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
