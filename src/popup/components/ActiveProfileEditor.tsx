import { HeaderEditor } from '@/popup/components/HeaderEditor';
import { ProfileToolbar } from '@/popup/components/ProfileToolbar';
import { UrlFilterEditor } from '@/popup/components/UrlFilterEditor';
import { reorderByDrop } from '@/popup/reorder';
import { createHeaderItem } from '@/shared/defaults';
import type { Profile } from '@/shared/types';

type ActiveProfileEditorProps = {
  profile: Profile;
  enabledHeaderCount: number;
  enabledFilterCount: number;
  onUpdateProfile: (updater: (profile: Profile) => Profile) => void;
  onDeleteProfile: () => void;
  onAddUrlFilter: () => void;
  onCopyConfig: () => void;
  onOpenImportDialog: () => void;
};

export function ActiveProfileEditor({
  profile,
  enabledHeaderCount,
  enabledFilterCount,
  onUpdateProfile,
  onDeleteProfile,
  onAddUrlFilter,
  onCopyConfig,
  onOpenImportDialog,
}: ActiveProfileEditorProps) {
  return (
    <>
      <ProfileToolbar
        profile={profile}
        enabledHeaderCount={enabledHeaderCount}
        enabledFilterCount={enabledFilterCount}
        onRename={(name) =>
          onUpdateProfile((currentProfile) => ({
            ...currentProfile,
            name,
          }))
        }
        onDelete={onDeleteProfile}
        onCopyConfig={onCopyConfig}
        onOpenImportDialog={onOpenImportDialog}
      />

      <HeaderEditor
        headers={profile.headers}
        onAdd={() =>
          onUpdateProfile((currentProfile) => ({
            ...currentProfile,
            headers: [...currentProfile.headers, createHeaderItem()],
          }))
        }
        onChange={(headerId, field, value) =>
          onUpdateProfile((currentProfile) => ({
            ...currentProfile,
            headers: currentProfile.headers.map((item) =>
              item.id === headerId ? { ...item, [field]: value } : item,
            ),
          }))
        }
        onToggle={(headerId) =>
          onUpdateProfile((currentProfile) => ({
            ...currentProfile,
            headers: currentProfile.headers.map((item) =>
              item.id === headerId ? { ...item, enabled: !item.enabled } : item,
            ),
          }))
        }
        onDelete={(headerId) =>
          onUpdateProfile((currentProfile) => ({
            ...currentProfile,
            headers: currentProfile.headers.filter(
              (item) => item.id !== headerId,
            ),
          }))
        }
        onReorder={(sourceHeaderId, targetHeaderId, position) =>
          onUpdateProfile((currentProfile) => ({
            ...currentProfile,
            headers: reorderByDrop(
              currentProfile.headers,
              sourceHeaderId,
              targetHeaderId,
              position,
            ),
          }))
        }
      />

      <UrlFilterEditor
        filters={profile.urlFilters}
        onAdd={onAddUrlFilter}
        onChange={(filterId, value) =>
          onUpdateProfile((currentProfile) => ({
            ...currentProfile,
            urlFilters: currentProfile.urlFilters.map((item) =>
              item.id === filterId ? { ...item, pattern: value } : item,
            ),
          }))
        }
        onToggle={(filterId) =>
          onUpdateProfile((currentProfile) => ({
            ...currentProfile,
            urlFilters: currentProfile.urlFilters.map((item) =>
              item.id === filterId ? { ...item, enabled: !item.enabled } : item,
            ),
          }))
        }
        onDelete={(filterId) =>
          onUpdateProfile((currentProfile) => ({
            ...currentProfile,
            urlFilters: currentProfile.urlFilters.filter(
              (item) => item.id !== filterId,
            ),
          }))
        }
        onReorder={(sourceFilterId, targetFilterId, position) =>
          onUpdateProfile((currentProfile) => ({
            ...currentProfile,
            urlFilters: reorderByDrop(
              currentProfile.urlFilters,
              sourceFilterId,
              targetFilterId,
              position,
            ),
          }))
        }
      />
    </>
  );
}
