import { Plus, Trash2 } from 'lucide-react';

import { EmptyState } from '@/popup/components/EmptyState';
import { SectionCard } from '@/popup/components/SectionCard';
import type { HeaderItem } from '@/shared/types';

type HeaderEditorProps = {
  headers: HeaderItem[];
  onAdd: () => void;
  onChange: (headerId: string, field: 'key' | 'value', value: string) => void;
  onToggle: (headerId: string) => void;
  onDelete: (headerId: string) => void;
};

export function HeaderEditor({
  headers,
  onAdd,
  onChange,
  onToggle,
  onDelete,
}: HeaderEditorProps) {
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
                className={`editor-grid header-grid editor-row px-2 ${header.enabled ? '' : 'is-disabled'}`}
              >
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
