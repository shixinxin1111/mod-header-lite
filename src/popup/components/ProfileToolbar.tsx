import { Copy, FileUp, Trash2 } from 'lucide-react';

import { ProfileNameEditor } from '@/popup/components/ProfileNameEditor';
import type { Profile } from '@/shared/types';

type ProfileToolbarProps = {
  profile: Profile;
  enabledHeaderCount: number;
  enabledFilterCount: number;
  onRename: (name: string) => void;
  onDelete: () => void;
  onCopyConfig: () => void;
  onOpenImportDialog: () => void;
};

export function ProfileToolbar({
  profile,
  enabledHeaderCount,
  enabledFilterCount,
  onRename,
  onDelete,
  onCopyConfig,
  onOpenImportDialog,
}: ProfileToolbarProps) {
  return (
    <div className="flex min-w-0 items-center border-b border-[#e2e8f0] bg-[#f8fafc] pl-0 pr-2">
      <ProfileNameEditor
        key={profile.id}
        value={profile.name}
        onCommit={onRename}
      />
      <div className="ml-1.5 shrink-0 rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#64748b] ring-1 ring-inset ring-[#e2e8f0]">
        {enabledHeaderCount} 请求头 · {enabledFilterCount} 规则
      </div>
      <div className="ml-1 flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          onClick={onCopyConfig}
          aria-label="复制当前配置"
          title="复制当前配置"
          className="icon-button neutral h-7 w-7"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onOpenImportDialog}
          aria-label="导入配置"
          title="导入配置"
          className="icon-button neutral h-7 w-7"
        >
          <FileUp className="h-3.5 w-3.5" />
        </button>
      </div>
      <button
        type="button"
        onClick={onDelete}
        aria-label="删除当前配置"
        title="删除当前配置"
        className="icon-button danger ml-auto h-7 w-7"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
