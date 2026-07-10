import { Plus, Trash2 } from 'lucide-react';

import { EmptyState } from '@/popup/components/EmptyState';
import { SectionCard } from '@/popup/components/SectionCard';
import type { UrlFilterItem } from '@/shared/types';
import { validateRegexPattern } from '@/shared/validation';

type UrlFilterEditorProps = {
  filters: UrlFilterItem[];
  onAdd: () => void;
  onChange: (filterId: string, value: string) => void;
  onToggle: (filterId: string) => void;
  onDelete: (filterId: string) => void;
};

export function UrlFilterEditor({
  filters,
  onAdd,
  onChange,
  onToggle,
  onDelete,
}: UrlFilterEditorProps) {
  return (
    <SectionCard
      title="URL 规则"
      actions={
        <button type="button" onClick={onAdd} className="add-button">
          <Plus className="h-3 w-3" />
          新增
        </button>
      }
    >
      {filters.length ? (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto bg-white">
            {filters.map((filter) => {
              const validationMessage = validateRegexPattern(filter.pattern);

              return (
                <div
                  key={filter.id}
                  className={`editor-grid url-grid editor-row px-2 ${filter.enabled ? '' : 'is-disabled'}`}
                >
                  <label
                    className="checkbox-wrap"
                    title={
                      filter.enabled ? '停用此 URL 规则' : '启用此 URL 规则'
                    }
                  >
                    <input
                      type="checkbox"
                      checked={filter.enabled}
                      onChange={() => onToggle(filter.id)}
                      aria-label={`切换 URL 规则 ${filter.pattern || '未命名'} 的启用状态`}
                      className="row-checkbox"
                    />
                  </label>
                  <label className="min-w-0">
                    <input
                      aria-label="URL 正则表达式"
                      value={filter.pattern}
                      onChange={(event) =>
                        onChange(filter.id, event.target.value)
                      }
                      placeholder="^https://example\\.com/.*$"
                      aria-invalid={Boolean(validationMessage)}
                      title={validationMessage ?? undefined}
                      className={`editor-input ${validationMessage ? 'is-invalid' : ''}`}
                    />
                  </label>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => onDelete(filter.id)}
                      aria-label="删除 URL 规则"
                      className="icon-button danger h-7 w-7"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState
          title="还没有 URL 规则"
          description="至少需要一条有效正则，请求头才会真正生效。"
          actionLabel="新增规则"
          onAction={onAdd}
        />
      )}
    </SectionCard>
  );
}
