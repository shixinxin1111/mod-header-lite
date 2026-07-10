import { updateActionIcon } from '@/background/icon';
import { syncDynamicRules } from '@/shared/dnr';
import { isSyncRulesMessage } from '@/shared/messages';
import {
  ensureStoredState,
  getStoredState,
  normalizeExtensionState,
  STORAGE_KEY,
} from '@/shared/storage';

async function syncRulesFromStorage() {
  const state = await getStoredState();

  await syncDynamicRules(state);
  await updateActionIcon(state.extensionEnabled);
}

async function initializeExtension() {
  const state = await ensureStoredState();

  await syncDynamicRules(state);
  await updateActionIcon(state.extensionEnabled);
}

chrome.runtime.onInstalled.addListener(() => {
  void initializeExtension();
});

chrome.runtime.onStartup.addListener(() => {
  void initializeExtension();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  const nextValue = changes[STORAGE_KEY]?.newValue;

  if (areaName !== 'local' || typeof nextValue === 'undefined') {
    return;
  }

  const nextState = normalizeExtensionState(nextValue);

  void updateActionIcon(nextState.extensionEnabled);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!isSyncRulesMessage(message)) {
    return false;
  }

  void syncRulesFromStorage()
    .then(() => {
      sendResponse({ ok: true });
    })
    .catch((error: unknown) => {
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : '规则同步失败',
      });
    });

  return true;
});
