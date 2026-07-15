import { afterEach, describe, expect, it, vi } from 'vitest';

import { updateActionIcon } from '@/background/icon';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('updateActionIcon', () => {
  it('停用时会切换为灰色工具栏图标', async () => {
    const setIcon = vi.fn().mockResolvedValue(undefined);
    const setTitle = vi.fn().mockResolvedValue(undefined);

    vi.stubGlobal('chrome', {
      action: { setIcon, setTitle },
      runtime: {
        getURL: (path: string) => `chrome-extension://test/${path}`,
      },
    });

    await updateActionIcon(false);

    expect(setIcon).toHaveBeenCalledWith({
      path: {
        '16': 'chrome-extension://test/icons/icon16-disabled.png',
        '32': 'chrome-extension://test/icons/icon32-disabled.png',
        '48': 'chrome-extension://test/icons/icon48-disabled.png',
        '128': 'chrome-extension://test/icons/icon128-disabled.png',
      },
    });
    expect(setTitle).toHaveBeenCalledWith({
      title: 'Mod Header Lite · 已停用',
    });
  });

  it('启用时会恢复彩色工具栏图标', async () => {
    const setIcon = vi.fn().mockResolvedValue(undefined);
    const setTitle = vi.fn().mockResolvedValue(undefined);

    vi.stubGlobal('chrome', {
      action: { setIcon, setTitle },
      runtime: {
        getURL: (path: string) => `chrome-extension://test/${path}`,
      },
    });

    await updateActionIcon(true);

    expect(setIcon).toHaveBeenCalledWith({
      path: {
        '16': 'chrome-extension://test/icons/icon16.png',
        '32': 'chrome-extension://test/icons/icon32.png',
        '48': 'chrome-extension://test/icons/icon48.png',
        '128': 'chrome-extension://test/icons/icon128.png',
      },
    });
    expect(setTitle).toHaveBeenCalledWith({
      title: 'Mod Header Lite · 已启用',
    });
  });
});
