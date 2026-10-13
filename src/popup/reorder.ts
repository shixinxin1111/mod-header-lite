export type DropPosition = 'before' | 'after';

type SortableItem = {
  id: string;
};

export function reorderByDrop<T extends SortableItem>(
  items: T[],
  sourceId: string,
  targetId: string,
  position: DropPosition,
) {
  if (sourceId === targetId) {
    return items;
  }

  const sourceItem = items.find((item) => item.id === sourceId);

  if (!sourceItem) {
    return items;
  }

  const nextItems = items.filter((item) => item.id !== sourceId);
  const targetIndex = nextItems.findIndex((item) => item.id === targetId);

  if (targetIndex === -1) {
    return items;
  }

  const insertIndex = position === 'after' ? targetIndex + 1 : targetIndex;
  nextItems.splice(insertIndex, 0, sourceItem);

  return nextItems;
}
