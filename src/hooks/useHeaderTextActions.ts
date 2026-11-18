import { useEffect, useState } from 'react';

import { createHeaderItem } from '@/shared/defaults';
import { createProfileHeaderText, parseHeaderText } from '@/shared/headerText';
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

export function useHeaderTextActions(
  activeProfile: Profile | null,
  updateState: ExtensionStateUpdater,
) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pasteDraft, setPasteDraft] = useState('');
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [pasteDialogOpen, setPasteDialogOpen] = useState(false);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer: number = window.setTimeout(() => {
      setFeedback(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [feedback]);

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

  const handleOpenPasteDialog = () => {
    setPasteDraft('');
    setPasteError(null);
    setPasteDialogOpen(true);
  };

  const handleCancelPaste = () => {
    setPasteDialogOpen(false);
    setPasteDraft('');
    setPasteError(null);
  };

  const handleChangePasteDraft = (value: string) => {
    setPasteDraft(value);
    setPasteError(null);
  };

  const handleConfirmPaste = () => {
    if (!activeProfile) {
      return;
    }

    const result = parseHeaderText(pasteDraft);

    if (!result.ok) {
      setPasteError(result.error);
      return;
    }

    const addedHeaders = result.headers.map((header) => ({
      ...createHeaderItem(),
      key: header.key,
      value: header.value,
    }));

    updateState((currentState) => ({
      ...currentState,
      profiles: currentState.profiles.map((profile) =>
        profile.id === activeProfile.id
          ? {
              ...profile,
              headers: [...profile.headers, ...addedHeaders],
            }
          : profile,
      ),
    }));
    handleCancelPaste();
    setFeedback(`已添加 ${addedHeaders.length} 个请求头`);
  };

  return {
    feedback,
    pasteDraft,
    pasteError,
    pasteDialogOpen,
    handleCopyHeaderText,
    handleOpenPasteDialog,
    handleCancelPaste,
    handleChangePasteDraft,
    handleConfirmPaste,
  };
}
