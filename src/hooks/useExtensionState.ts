import { useCallback, useEffect, useState } from 'react';

import { updateActionIcon } from '@/background/icon';
import { requestRulesSync } from '@/shared/messages';
import { createDefaultState } from '@/shared/defaults';
import {
  normalizeExtensionState,
  getStoredState,
  saveStoredState,
} from '@/shared/storage';
import type { ExtensionState } from '@/shared/types';

type ExtensionStateUpdater = (state: ExtensionState) => ExtensionState;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : '状态保存失败，请稍后重试。';
}

export function useExtensionState() {
  const [state, setState] = useState<ExtensionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  const persistState = useCallback(async (nextState: ExtensionState) => {
    if (
      import.meta.env.DEV &&
      (typeof chrome === 'undefined' || !chrome.storage?.local)
    ) {
      setSaveError(null);
      return;
    }

    try {
      await saveStoredState(nextState);
      await requestRulesSync('popup-save');
      setSaveError(null);
    } catch (error) {
      setSaveError(getErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const storedState = await getStoredState();

        if (!cancelled) {
          setState(storedState);
          setSaveError(null);
        }

        // popup 打开时兜底同步一次工具栏图标：MV3 service worker 是事件驱动的
        // 懒加载，浏览器重启 / 扩展重载后可能未被唤醒，导致图标停留在 manifest
        // 里的 default_icon 上。这里显式对齐当前存储中的启停状态。
        void updateActionIcon(storedState.extensionEnabled).catch(() => {
          // 图标同步失败不影响主流程，storage.onChanged 仍会兜底。
        });
      } catch (error) {
        if (!cancelled) {
          if (import.meta.env.DEV) {
            setState(createDefaultState());
            setSaveError(null);
          } else {
            setSaveError(getErrorMessage(error));
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateState = useCallback(
    (updater: ExtensionStateUpdater) => {
      setState((currentState) => {
        if (!currentState) {
          return currentState;
        }

        const nextState = normalizeExtensionState(updater(currentState));

        void persistState(nextState);

        return nextState;
      });
    },
    [persistState],
  );

  return {
    state,
    loading,
    saveError,
    updateState,
  };
}
