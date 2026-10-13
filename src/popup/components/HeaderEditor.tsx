import { useState, type DragEvent } from 'react';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

import { EmptyState } from '@/popup/components/EmptyState';
import { SectionCard } from '@/popup/components/SectionCard';
import { setRowDragPreview } from '@/popup/dragPreview';
import type { DropPosition } from '@/popup/reorder';
import type { HeaderItem } from '@/shared/types';

type HeaderEditorProps = {
  headers: HeaderItem[];
  onAdd: () => void;
  onChange: (headerId: string, field: 'key' | 'value', value: string) => void;
  onToggle: (headerId: string) => void;
  onDelete: (headerId: string) => void;
  onReorder: (
    sourceHeaderId: string,
    targetHeaderId: string,
    position: DropPosition,
  ) => void;
};

export function HeaderEditor({
  headers,
  onAdd,
  onChange,
  onToggle,
  onDelete,
  onReorder,
}: HeaderEditorProps) {
  const [draggedHeaderId, setDraggedHeaderId] = useState<string | null>(null);
  const [dragOverHeader, setDragOverHeader] = useState<{
    id: string;
    position: DropPosition;
  } | null>(null);

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    headerId: string,
  ) => {
    const target = event.target;

    if (
      target instanceof HTMLElement &&
      target.closest('input, textarea, select, button:not(.drag-handle)')
    ) {
      event.preventDefault();
      return;
    }

    setDraggedHeaderId(headerId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', headerId);
    setRowDragPreview(
      event.currentTarget,
      event.dataTransfer,
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY,
    );
  };

  const handleDragOver = (
    event: DragEvent<HTMLDivElement>,
    headerId: string,
  ) => {
    const sourceId = draggedHeaderId ?? event.dataTransfer.getData('text/plain');

    if (!sourceId || sourceId === headerId) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    const { top, height } = event.currentTarget.getBoundingClientRect();
    const position: DropPosition =
      event.clientY - top < height / 2 ? 'before' : 'after';
    setDragOverHeader({ id: headerId, position });
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
    targetHeaderId: string,
  ) => {
    event.preventDefault();

    const sourceId = draggedHeaderId ?? event.dataTransfer.getData('text/plain');
    const position = dragOverHeader?.position ?? 'before';

    if (sourceId && sourceId !== targetHeaderId) {
      onReorder(sourceId, targetHeaderId, position);
    }

    setDraggedHeaderId(null);
    setDragOverHeader(null);
  };

  const handleDragEnd = () => {
    setDraggedHeaderId(null);
    setDragOverHeader(null);
  };

  return (
    <SectionCard
      title="请求头"
      actions={
        <button type="button" onClick={onAdd} className="add-button">
          <Plus className="h-3 w-3" />
          新增
        </button>
      }
    >
      {headers.length ? (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto bg-white">
            {headers.map((header) => (
              <div
                key={header.id}
                draggable
                onDragStart={(event) => handleDragStart(event, header.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(event) => handleDragOver(event, header.id)}
                onDrop={(event) => handleDrop(event, header.id)}
                className={`editor-grid header-grid editor-row is-sortable px-2 ${
                  draggedHeaderId === header.id ? 'is-dragging' : ''
                } ${header.enabled ? '' : 'is-disabled'} ${
                  dragOverHeader?.id === header.id
                    ? `drag-over-${dragOverHeader.position}`
                    : ''
                }`}
              >
                <button
                  type="button"
                  aria-label={`拖拽排序请求头 ${header.key || '未命名'}`}
                  title="拖拽排序"
                  className="drag-handle"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </button>
                <label
                  className="checkbox-wrap"
                  title={header.enabled ? '停用此请求头' : '启用此请求头'}
                >
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={() => onToggle(header.id)}
                    aria-label={`切换请求头 ${header.key || '未命名'} 的启用状态`}
                    className="row-checkbox"
                  />
                </label>
                <label className="min-w-0">
                  <input
                    aria-label="请求头名称"
                    value={header.key}
                    onChange={(event) =>
                      onChange(header.id, 'key', event.target.value)
                    }
                    placeholder="请输入请求头名称"
                    className="editor-input"
                  />
                </label>
                <label className="min-w-0">
                  <input
                    aria-label="请求头值"
                    value={header.value}
                    onChange={(event) =>
                      onChange(header.id, 'value', event.target.value)
                    }
                    placeholder="请输入请求头值"
                    className="editor-input"
                  />
                </label>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => onDelete(header.id)}
                    aria-label="删除请求头"
                    className="icon-button danger h-7 w-7"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          title="还没有请求头"
          description="添加后，命中 URL 规则的请求会带上这些头信息。"
          actionLabel="新增请求头"
          onAction={onAdd}
        />
      )}
    </SectionCard>
  );
}
