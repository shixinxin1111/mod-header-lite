import { useEffect, useState } from 'react';

import {
  createImportedHeaderItems,
  createImportedUrlFilterItems,
  createProfileExportConfig,
  createProfileHeaderText,
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

function createExportFileName(profileName: string) {
  const safeName = profileName
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, '-')
    .slice(0, 48);

  return `mod-header-lite-${safeName || 'profile'}.json`;
}

function downloadTextFile(fileName: string, content: string) {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
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

  const handleExportConfig = () => {
    if (!activeProfile) {
      return;
    }

    const profileConfig = createProfileExportConfig(activeProfile);

    try {
      downloadTextFile(
        createExportFileName(activeProfile.name),
        JSON.stringify(profileConfig, null, 2),
      );
      setFeedback('当前面板已导出');
    } catch {
      setFeedback('导出失败，请重试');
    }
  };

  const handleCopyHeaderText = () => {
    if (!activeProfile) {
      return;
    }

    void copyToClipboard(createProfileHeaderText(activeProfile))
      .then(() => {
        setFeedback('请求头文本已复制');
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
    handleExportConfig,
    handleCopyHeaderText,
    handleOpenImportDialog,
    handleCancelImport,
    handleConfirmImport,
    handleRestoreImport,
    handleChangeImportDraft,
  };
}
