import { Plus } from 'lucide-react';

import type { Profile } from '@/shared/types';

import { ProfileItem } from './ProfileItem';

function getProfileBadge(name: string) {
  const normalized = name.replace(/\s+/g, '').trim();

  if (!normalized) {
    return '配';
  }

  const defaultNameMatch = normalized.match(/^配置(\d+)$/);

  if (defaultNameMatch?.[1]) {
    return defaultNameMatch[1];
  }

  return normalized.slice(0, 2);
}

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
    <aside className="flex min-h-0 w-14 shrink-0 flex-col bg-[#f1f5f9]">
      <div className="min-h-0 flex-1 overflow-y-auto px-1.5 py-1.5">
        <div className="flex flex-col items-center gap-1.5">
          {profiles.map((profile) => (
            <ProfileItem
              key={profile.id}
              name={profile.name}
              badge={getProfileBadge(profile.name)}
              active={profile.id === activeProfileId}
              onSelect={() => onSelectProfile(profile.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center border-t border-[#e2e8f0] p-1.5">
        <button
          type="button"
          onClick={onAddProfile}
          disabled={!canAddProfile}
          aria-label="新增配置"
          title={canAddProfile ? '新增配置' : '最多只能创建 20 个配置'}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb] text-white shadow-[0_3px_8px_rgba(37,99,235,0.2)] transition hover:bg-[#1d4ed8] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#cbd5e1] disabled:text-[#64748b] disabled:shadow-none"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
