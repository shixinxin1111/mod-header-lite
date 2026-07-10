import { AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

import { updateActionIcon } from '@/background/icon';
import { useExtensionState } from '@/hooks/useExtensionState';
import { HeaderEditor } from '@/popup/components/HeaderEditor';
import { ProfileNameEditor } from '@/popup/components/ProfileNameEditor';
import { ProfileSidebar } from '@/popup/components/ProfileSidebar';
import { Switch } from '@/popup/components/Switch';
import { UrlFilterEditor } from '@/popup/components/UrlFilterEditor';
import {
  createHeaderItem,
  createProfile,
  createUrlFilterItem,
} from '@/shared/defaults';
import { getActiveProfile } from '@/shared/dnr';
import { urlToOriginRegexPattern } from '@/shared/urlPattern';

function LoadingSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#f8fafc]">
      <div className="h-10 animate-pulse bg-white" />
      <div className="grid min-h-0 flex-1 grid-cols-[56px_minmax(0,1fr)]">
        <div className="bg-[#f1f5f9]" />
        <div className="grid min-h-0 grid-rows-[34px_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="animate-pulse bg-[#f8fafc]" />
          <div className="animate-pulse bg-white" />
          <div className="animate-pulse bg-white" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { state, loading, saveError, updateState } = useExtensionState();
  const activeProfile = useMemo(
    () => (state ? getActiveProfile(state) : null),
    [state],
  );

  if (loading || !state) {
    return <LoadingSkeleton />;
  }

  const enabledHeaderCount =
    activeProfile?.headers.filter((item) => item.enabled).length ?? 0;
  const enabledFilterCount =
    activeProfile?.urlFilters.filter((item) => item.enabled).length ?? 0;
  const canAddProfile = state.profiles.length < 20;

  const handleDeleteProfile = (profileId: string) => {
    const targetProfile = state.profiles.find(
      (profile) => profile.id === profileId,
    );

    if (
      !targetProfile ||
      !window.confirm(`确认删除 ${targetProfile.name} 吗？`)
    ) {
      return;
    }

    updateState((currentState) => {
      const remainingProfiles = currentState.profiles.filter(
        (profile) => profile.id !== profileId,
      );

      return {
        ...currentState,
        profiles: remainingProfiles,
        activeProfileId: remainingProfiles.some(
          (profile) => profile.id === currentState.activeProfileId,
        )
          ? currentState.activeProfileId
          : (remainingProfiles[0]?.id ?? null),
      };
    });
  };

  const updateActiveProfile = (
    updater: (
      profile: NonNullable<typeof activeProfile>,
    ) => NonNullable<typeof activeProfile>,
  ) => {
    if (!activeProfile) {
      return;
    }

    updateState((currentState) => ({
      ...currentState,
      profiles: currentState.profiles.map((profile) =>
        profile.id === activeProfile.id ? updater(profile) : profile,
      ),
    }));
  };

  const handleAddUrlFilter = async () => {
    const profileId = activeProfile?.id;

    if (!profileId) {
      return;
    }

    let pattern = '';

    if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
      try {
        const [currentTab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        pattern = urlToOriginRegexPattern(currentTab?.url);
      } catch {
        // 浏览器内部页面或权限受限时，仍然允许创建空白规则。
      }
    }

    updateState((currentState) => ({
      ...currentState,
      profiles: currentState.profiles.map((profile) =>
        profile.id === profileId
          ? {
              ...profile,
              urlFilters: [
                ...profile.urlFilters,
                { ...createUrlFilterItem(), pattern },
              ],
            }
          : profile,
      ),
    }));
  };

  const handleToggleExtension = () => {
    const nextEnabled = !state.extensionEnabled;

    updateState((currentState) => ({
      ...currentState,
      extensionEnabled: nextEnabled,
    }));

    // 弹窗直接更新图标，避免等待后台 Service Worker 唤醒。
    void updateActionIcon(nextEnabled).catch(() => {
      // 后台仍会通过 storage.onChanged 再次同步图标状态。
    });
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-[#f8fafc] text-[#172033]">
      <header className="flex h-10 items-center justify-between gap-2 border-b border-[#e2e8f0] bg-white px-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#2563eb] text-white shadow-[0_2px_5px_rgba(37,99,235,0.22)]">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.2} />
          </div>
          <div className="truncate text-[13px] font-bold tracking-[-0.01em] text-[#172033]">
            Mod Header Lite
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {saveError ? (
            <div className="flex items-center gap-1 rounded-md bg-[#fff1f2] px-2 py-1 text-[10px] text-[#be123c] ring-1 ring-inset ring-[#fecdd3]">
              <AlertTriangle className="h-3 w-3 shrink-0" />
              <span className="max-w-36 truncate">{saveError}</span>
            </div>
          ) : null}
          <span className="text-[12px] font-medium text-[#475569]">
            全局启用
          </span>
          <Switch
            checked={state.extensionEnabled}
            label="切换插件全局启用状态"
            onChange={handleToggleExtension}
          />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[56px_minmax(0,1fr)]">
        <ProfileSidebar
          profiles={state.profiles}
          activeProfileId={state.activeProfileId}
          canAddProfile={canAddProfile}
          onAddProfile={() =>
            updateState((currentState) => {
              if (currentState.profiles.length >= 20) {
                return currentState;
              }

              const nextProfile = createProfile(
                currentState.profiles.length + 1,
              );

              return {
                ...currentState,
                profiles: [...currentState.profiles, nextProfile],
                activeProfileId: nextProfile.id,
              };
            })
          }
          onSelectProfile={(profileId) =>
            updateState((currentState) => ({
              ...currentState,
              activeProfileId: profileId,
            }))
          }
        />

        <div className="grid min-h-0 grid-rows-[34px_minmax(0,1fr)_minmax(0,1fr)] bg-white shadow-[inset_1px_0_0_#e2e8f0]">
          {activeProfile ? (
            <>
              <div className="flex min-w-0 items-center gap-1.5 border-b border-[#e2e8f0] bg-[#f8fafc] pl-0 pr-2">
                <ProfileNameEditor
                  key={activeProfile.id}
                  value={activeProfile.name}
                  onCommit={(name) =>
                    updateActiveProfile((profile) => ({
                      ...profile,
                      name,
                    }))
                  }
                />
                <div className="shrink-0 rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-[#64748b] ring-1 ring-inset ring-[#e2e8f0]">
                  {enabledHeaderCount} 请求头 · {enabledFilterCount} 规则
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteProfile(activeProfile.id)}
                  aria-label="删除当前配置"
                  className="icon-button danger h-7 w-7"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <HeaderEditor
                headers={activeProfile.headers}
                onAdd={() =>
                  updateActiveProfile((profile) => ({
                    ...profile,
                    headers: [...profile.headers, createHeaderItem()],
                  }))
                }
                onChange={(headerId, field, value) =>
                  updateActiveProfile((profile) => ({
                    ...profile,
                    headers: profile.headers.map((item) =>
                      item.id === headerId ? { ...item, [field]: value } : item,
                    ),
                  }))
                }
                onToggle={(headerId) =>
                  updateActiveProfile((profile) => ({
                    ...profile,
                    headers: profile.headers.map((item) =>
                      item.id === headerId
                        ? { ...item, enabled: !item.enabled }
                        : item,
                    ),
                  }))
                }
                onDelete={(headerId) =>
                  updateActiveProfile((profile) => ({
                    ...profile,
                    headers: profile.headers.filter(
                      (item) => item.id !== headerId,
                    ),
                  }))
                }
              />

              <UrlFilterEditor
                filters={activeProfile.urlFilters}
                onAdd={() => void handleAddUrlFilter()}
                onChange={(filterId, value) =>
                  updateActiveProfile((profile) => ({
                    ...profile,
                    urlFilters: profile.urlFilters.map((item) =>
                      item.id === filterId ? { ...item, pattern: value } : item,
                    ),
                  }))
                }
                onToggle={(filterId) =>
                  updateActiveProfile((profile) => ({
                    ...profile,
                    urlFilters: profile.urlFilters.map((item) =>
                      item.id === filterId
                        ? { ...item, enabled: !item.enabled }
                        : item,
                    ),
                  }))
                }
                onDelete={(filterId) =>
                  updateActiveProfile((profile) => ({
                    ...profile,
                    urlFilters: profile.urlFilters.filter(
                      (item) => item.id !== filterId,
                    ),
                  }))
                }
              />
            </>
          ) : (
            <>
              <div className="border-b border-[#e2e8f0] bg-[#f8fafc]" />
              <div className="row-span-2 flex items-center justify-center px-6 text-center text-[12px] text-[#64748b]">
                当前没有可编辑的配置，请先在左侧添加一个配置。
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
