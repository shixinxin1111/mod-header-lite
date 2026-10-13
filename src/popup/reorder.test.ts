import { describe, expect, it } from 'vitest';

import { reorderByDrop } from '@/popup/reorder';

const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

describe('reorderByDrop', () => {
  it('moves an item before the target item', () => {
    expect(reorderByDrop(items, 'c', 'a', 'before')).toEqual([
      { id: 'c' },
      { id: 'a' },
      { id: 'b' },
    ]);
  });

  it('moves an item after the target item', () => {
    expect(reorderByDrop(items, 'a', 'c', 'after')).toEqual([
      { id: 'b' },
      { id: 'c' },
      { id: 'a' },
    ]);
  });

  it('keeps order when the source or target cannot be found', () => {
    expect(reorderByDrop(items, 'x', 'a', 'before')).toBe(items);
    expect(reorderByDrop(items, 'a', 'x', 'after')).toBe(items);
  });

  it('keeps order when dropping onto itself', () => {
    expect(reorderByDrop(items, 'a', 'a', 'after')).toBe(items);
  });
});
