type ActionIconState = 'enabled' | 'disabled';

const ICON_PATHS: Record<ActionIconState, Record<string, string>> = {
  enabled: {
    '16': 'icons/icon16.png',
    '32': 'icons/icon32.png',
    '48': 'icons/icon48.png',
    '128': 'icons/icon128.png',
  },
  disabled: {
    '16': 'icons/icon16-disabled.png',
    '32': 'icons/icon32-disabled.png',
    '48': 'icons/icon48-disabled.png',
    '128': 'icons/icon128-disabled.png',
  },
};

export async function updateActionIcon(enabled: boolean) {
  if (typeof chrome === 'undefined' || !chrome.action?.setIcon) {
    return;
  }

  const state: ActionIconState = enabled ? 'enabled' : 'disabled';
  const resolvedPaths = Object.fromEntries(
    Object.entries(ICON_PATHS[state]).map(([size, path]) => [
      size,
      chrome.runtime.getURL(path),
    ]),
  );

  await chrome.action.setIcon({
    path: resolvedPaths,
  });

  await chrome.action.setTitle({
    title: enabled ? 'Mod Header Lite · 已启用' : 'Mod Header Lite · 已停用',
  });
}
