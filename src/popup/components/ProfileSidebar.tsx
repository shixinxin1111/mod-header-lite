import { Plus } from 'lucide-react';

import type { Profile } from '@/shared/types';

import { ProfileItem } from './ProfileItem';

type ProfileSidebarProps = {
  profiles: Profile[];
  activeProfileId: string | null;
  canAddProfile: boolean;
  onAddProfile: () => void;
  onSelectProfile: (profileId: string) => void;
};

export function ProfileSidebar({
  profiles,
  activeProfileId,
  canAddProfile,
  onAddProfile,
  onSelectProfile,
}: ProfileSidebarProps) {
  return (
    <aside className="flex min-h-0 w-fit min-w-[52px] max-w-[90px] shrink-0 flex-col bg-[#f1f5f9]">
      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-1.5">
        <div className="grid w-fit min-w-9 max-w-[74px] grid-cols-[minmax(36px,min(74px,max-content))] gap-1.5">
          {profiles.map((profile) => (
            <ProfileItem
              key={profile.id}
              name={profile.name}
              active={profile.id === activeProfileId}
              onSelect={() => onSelectProfile(profile.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center border-t border-[#e2e8f0] px-2 py-1.5">
        <button
          type="button"
          onClick={onAddProfile}
          disabled={!canAddProfile}
          aria-label="新增配置"
          title={canAddProfile ? '新增配置' : '最多只能创建 20 个配置'}
          className="inline-flex h-9 w-full min-w-9 items-center justify-center rounded-lg bg-[#2563eb] px-3 text-white shadow-[0_3px_8px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#cbd5e1] disabled:text-[#64748b] disabled:shadow-none"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
