import { useEffect, useState } from 'react';

import {
  createImportedHeaderItems,
  createImportedUrlFilterItems,
  createProfileExportConfig,
  parseImportedProfileConfig,
} from '@/shared/importExport';
import type { ExtensionState, Profile } from '@/shared/types';

type ExtensionStateUpdater = (
  updater: (state: ExtensionState) => ExtensionState,
) => void;

async function copyToClipboard(value: string) {
  if (!navigator.clipboard?.writeText) {
    throw new Error('当前环境不支持剪贴板写入。');
  }

  await navigator.clipboard.writeText(value);
}

export function useConfigImportExport(
  state: ExtensionState | null,
  activeProfile: Profile | null,
  updateState: ExtensionStateUpdater,
) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [importDraft, setImportDraft] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [restoreState, setRestoreState] = useState<ExtensionState | null>(null);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer: number = window.setTimeout(() => {
      setFeedback(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleCopyConfig = () => {
    if (!activeProfile) {
      return;
    }

    const profileConfig = createProfileExportConfig(activeProfile);

    void copyToClipboard(JSON.stringify(profileConfig, null, 2))
      .then(() => {
        setFeedback('当前面板已复制');
      })
      .catch(() => {
        setFeedback('复制失败，请重试');
      });
  };

  const handleOpenImportDialog = () => {
    setImportDraft('');
    setImportError(null);
    setImportDialogOpen(true);
  };

  const handleCancelImport = () => {
    setImportDialogOpen(false);
    setImportDraft('');
    setImportError(null);
  };

  const handleConfirmImport = () => {
    if (!state || !activeProfile) {
      return;
    }

    const result = parseImportedProfileConfig(importDraft);

    if (!result.ok) {
      setImportError(result.error);
      return;
    }

    // 导入前保留完整旧配置，允许用户在误操作后立即恢复。
    setRestoreState(state);
    updateState((currentState) => ({
      ...currentState,
      profiles: currentState.profiles.map((profile) =>
        profile.id === activeProfile.id
          ? {
              ...profile,
              headers: createImportedHeaderItems(result.profileConfig.headers),
              urlFilters: createImportedUrlFilterItems(
                result.profileConfig.urlFilters,
              ),
            }
          : profile,
      ),
    }));
    handleCancelImport();
    setFeedback('当前面板已导入，可撤销');
  };

  const handleRestoreImport = () => {
    if (!restoreState) {
      return;
    }

    updateState(() => restoreState);
    setRestoreState(null);
    setFeedback('已恢复导入前配置');
  };

  const handleChangeImportDraft = (value: string) => {
    setImportDraft(value);
    setImportError(null);
  };

  return {
    feedback,
    importDraft,
    importError,
    importDialogOpen,
    canRestoreImport: !!restoreState && feedback === '当前面板已导入，可撤销',
    handleCopyConfig,
    handleOpenImportDialog,
    handleCancelImport,
    handleConfirmImport,
    handleRestoreImport,
    handleChangeImportDraft,
  };
}
