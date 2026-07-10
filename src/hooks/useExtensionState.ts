import { useCallback, useEffect, useState } from 'react';

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
