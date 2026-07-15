import { updateActionIcon } from '@/background/icon';
import { syncDynamicRules } from '@/shared/dnr';
import { isSyncRulesMessage } from '@/shared/messages';
import {
  ensureStoredState,
  getStoredState,
  normalizeExtensionState,
  STORAGE_KEY,
} from '@/shared/storage';
import type { ExtensionState } from '@/shared/types';

async function syncRulesAndIcon(state: ExtensionState) {
  const [rulesResult, iconResult] = await Promise.allSettled([
    syncDynamicRules(state),
    updateActionIcon(state.extensionEnabled),
  ]);

  if (rulesResult.status === 'rejected') {
    throw rulesResult.reason;
  }

  if (iconResult.status === 'rejected') {
    throw iconResult.reason;
  }
}

async function syncRulesFromStorage() {
  const state = await getStoredState();

  await syncRulesAndIcon(state);
}

async function initializeExtension() {
  const state = await ensureStoredState();

  await syncRulesAndIcon(state);
}

async function restoreActionIcon() {
  const state = await getStoredState();

  await updateActionIcon(state.extensionEnabled);
}

let iconRestoration: Promise<void> | null = null;

function runIconRestoration() {
  if (iconRestoration) {
    return;
  }

  iconRestoration = restoreActionIcon()
    .catch((error: unknown) => {
      console.error('工具栏图标恢复失败：', error);
    })
    .finally(() => {
      iconRestoration = null;
    });
}

function runInitialization() {
  void initializeExtension().catch((error: unknown) => {
    console.error('扩展初始化失败：', error);
  });
}

chrome.runtime.onInstalled.addListener(() => {
  runInitialization();
});

chrome.runtime.onStartup.addListener(() => {
  runInitialization();
});

// macOS 上关闭最后一个 Chrome 窗口时，浏览器进程可能仍在运行，因此再次打开
// 窗口不会触发 runtime.onStartup。监听新窗口可以确保这种“重新打开浏览器”的
// 场景也会唤醒 Service Worker，并按持久化状态恢复工具栏图标。
chrome.windows.onCreated.addListener(() => {
  runIconRestoration();
});

// 浏览器恢复会话时会重新创建或激活标签页。它们为不同平台、不同退出方式提供
// 额外的唤醒入口；恢复逻辑始终读取 storage，不对启停状态做静态假设。
chrome.tabs.onCreated.addListener(() => {
  runIconRestoration();
});

chrome.tabs.onActivated.addListener(() => {
  runIconRestoration();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  const nextValue = changes[STORAGE_KEY]?.newValue;

  if (areaName !== 'local' || typeof nextValue === 'undefined') {
    return;
  }

  const nextState = normalizeExtensionState(nextValue);

  void updateActionIcon(nextState.extensionEnabled).catch((error: unknown) => {
    console.error('工具栏图标同步失败：', error);
  });
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

// 浏览器启动会触发 onStartup，但在开发者模式中重新加载扩展时，不能只依赖
// onInstalled / onStartup 来恢复运行时图标。Service Worker 每次加载时都从持久化
// 状态主动恢复一次，避免工具栏停留在 manifest 的静态 default_icon。
runIconRestoration();
