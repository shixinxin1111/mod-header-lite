import { afterEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEY } from '@/shared/storage';

type Listener = (...args: never[]) => void;

function createChromeMock(options?: {
  dynamicRulesError?: Error;
  extensionEnabled?: boolean;
}) {
  const listeners: {
    installed?: Listener;
    startup?: Listener;
    windowCreated?: Listener;
    tabCreated?: Listener;
    tabActivated?: Listener;
  } = {};
  const addInstalledListener = vi.fn((listener: Listener) => {
    listeners.installed = listener;
  });
  const addStartupListener = vi.fn((listener: Listener) => {
    listeners.startup = listener;
  });
  const addWindowCreatedListener = vi.fn((listener: Listener) => {
    listeners.windowCreated = listener;
  });
  const addTabCreatedListener = vi.fn((listener: Listener) => {
    listeners.tabCreated = listener;
  });
  const addTabActivatedListener = vi.fn((listener: Listener) => {
    listeners.tabActivated = listener;
  });
  const setIcon = vi.fn().mockResolvedValue(undefined);
  const setTitle = vi.fn().mockResolvedValue(undefined);
  const getDynamicRules = options?.dynamicRulesError
    ? vi.fn().mockRejectedValue(options.dynamicRulesError)
    : vi.fn().mockResolvedValue([]);

  return {
    chromeMock: {
      action: { setIcon, setTitle },
      declarativeNetRequest: {
        getDynamicRules,
        updateDynamicRules: vi.fn().mockResolvedValue(undefined),
      },
      runtime: {
        getURL: (path: string) => `chrome-extension://test/${path}`,
        onInstalled: { addListener: addInstalledListener },
        onStartup: { addListener: addStartupListener },
        onMessage: { addListener: vi.fn() },
      },
      windows: {
        onCreated: { addListener: addWindowCreatedListener },
      },
      tabs: {
        onCreated: { addListener: addTabCreatedListener },
        onActivated: { addListener: addTabActivatedListener },
      },
      storage: {
        local: {
          get: vi.fn().mockResolvedValue({
            [STORAGE_KEY]: {
              extensionEnabled: options?.extensionEnabled ?? true,
              profiles: [],
              activeProfileId: null,
            },
          }),
          set: vi.fn().mockResolvedValue(undefined),
        },
        onChanged: { addListener: vi.fn() },
      },
    },
    listeners,
    setIcon,
  };
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('background service worker', () => {
  it('加载时会立即从存储恢复启用图标', async () => {
    const { chromeMock, setIcon } = createChromeMock();

    vi.stubGlobal('chrome', chromeMock);

    await import('@/background/service-worker');

    await vi.waitFor(() => {
      expect(setIcon).toHaveBeenCalledWith({
        path: {
          '16': 'chrome-extension://test/icons/icon16.png',
          '32': 'chrome-extension://test/icons/icon32.png',
          '48': 'chrome-extension://test/icons/icon48.png',
          '128': 'chrome-extension://test/icons/icon128.png',
        },
      });
    });
  });

  it('规则恢复失败时仍会恢复启用图标', async () => {
    const { chromeMock, listeners, setIcon } = createChromeMock({
      dynamicRulesError: new Error('DNR unavailable'),
    });
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    vi.stubGlobal('chrome', chromeMock);

    await import('@/background/service-worker');
    await vi.waitFor(() => expect(setIcon).toHaveBeenCalledTimes(1));

    setIcon.mockClear();
    listeners.startup?.();

    await vi.waitFor(() => {
      expect(setIcon).toHaveBeenCalled();
      expect(consoleError).toHaveBeenCalledWith(
        '扩展初始化失败：',
        expect.any(Error),
      );
    });
  });

  it('浏览器进程未退出但重新创建窗口时会再次恢复图标', async () => {
    const { chromeMock, listeners, setIcon } = createChromeMock();

    vi.stubGlobal('chrome', chromeMock);

    await import('@/background/service-worker');
    await vi.waitFor(() => expect(setIcon).toHaveBeenCalledTimes(1));

    setIcon.mockClear();
    listeners.windowCreated?.();

    await vi.waitFor(() => expect(setIcon).toHaveBeenCalledTimes(1));
  });

  it('持久化状态为停用时，重新创建窗口仍恢复灰色图标', async () => {
    const { chromeMock, listeners, setIcon } = createChromeMock({
      extensionEnabled: false,
    });

    vi.stubGlobal('chrome', chromeMock);

    await import('@/background/service-worker');
    await vi.waitFor(() => expect(setIcon).toHaveBeenCalledTimes(1));

    setIcon.mockClear();
    listeners.windowCreated?.();

    await vi.waitFor(() => {
      expect(setIcon).toHaveBeenCalledWith({
        path: {
          '16': 'chrome-extension://test/icons/icon16-disabled.png',
          '32': 'chrome-extension://test/icons/icon32-disabled.png',
          '48': 'chrome-extension://test/icons/icon48-disabled.png',
          '128': 'chrome-extension://test/icons/icon128-disabled.png',
        },
      });
    });
  });

  it('恢复会话创建标签页时会再次从存储恢复图标', async () => {
    const { chromeMock, listeners, setIcon } = createChromeMock();

    vi.stubGlobal('chrome', chromeMock);

    await import('@/background/service-worker');
    await vi.waitFor(() => expect(setIcon).toHaveBeenCalledTimes(1));

    setIcon.mockClear();
    listeners.tabCreated?.();

    await vi.waitFor(() => expect(setIcon).toHaveBeenCalledTimes(1));
  });

});
