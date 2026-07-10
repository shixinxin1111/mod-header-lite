import { describe, expect, it } from 'vitest';

import { compileDynamicRules } from '@/shared/dnr';
import type { ExtensionState } from '@/shared/types';

function createState(overrides?: Partial<ExtensionState>): ExtensionState {
  return {
    extensionEnabled: true,
    activeProfileId: 'profile-1',
    profiles: [
      {
        id: 'profile-1',
        name: '配置 1',
        headers: [
          {
            id: 'header-1',
            key: 'x-debug',
            value: '1',
            enabled: true,
          },
        ],
        urlFilters: [
          {
            id: 'filter-1',
            pattern: '^https://example\\.com/.*$',
            enabled: true,
          },
        ],
      },
    ],
    ...overrides,
  };
}

describe('compileDynamicRules', () => {
  it('在插件全局关闭时返回空规则', () => {
    expect(
      compileDynamicRules(
        createState({
          extensionEnabled: false,
        }),
      ),
    ).toEqual([]);
  });

  it('会忽略非法正则规则', () => {
    expect(
      compileDynamicRules(
        createState({
          profiles: [
            {
              id: 'profile-1',
              name: '配置 1',
              headers: [
                {
                  id: 'header-1',
                  key: 'x-debug',
                  value: '1',
                  enabled: true,
                },
              ],
              urlFilters: [
                {
                  id: 'filter-1',
                  pattern: '[',
                  enabled: true,
                },
              ],
            },
          ],
        }),
      ),
    ).toEqual([]);
  });

  it('同名请求头仅保留最后一条启用项', () => {
    const rules = compileDynamicRules(
      createState({
        profiles: [
          {
            id: 'profile-1',
            name: '配置 1',
            headers: [
              {
                id: 'header-1',
                key: 'x-debug',
                value: 'old',
                enabled: true,
              },
              {
                id: 'header-2',
                key: 'X-Debug',
                value: 'new',
                enabled: true,
              },
            ],
            urlFilters: [
              {
                id: 'filter-1',
                pattern: '^https://example\\.com/.*$',
                enabled: true,
              },
            ],
          },
        ],
      }),
    );

    expect(rules).toHaveLength(1);
    expect(rules[0]?.action.requestHeaders).toEqual([
      {
        header: 'X-Debug',
        operation: 'set',
        value: 'new',
      },
    ]);
  });

  it('每条有效 URL 规则会生成一条动态规则', () => {
    const rules = compileDynamicRules(
      createState({
        profiles: [
          {
            id: 'profile-1',
            name: '配置 1',
            headers: [
              {
                id: 'header-1',
                key: 'x-debug',
                value: '1',
                enabled: true,
              },
            ],
            urlFilters: [
              {
                id: 'filter-1',
                pattern: '^https://a\\.example\\.com/.*$',
                enabled: true,
              },
              {
                id: 'filter-2',
                pattern: '^https://b\\.example\\.com/.*$',
                enabled: true,
              },
            ],
          },
        ],
      }),
    );

    expect(rules).toHaveLength(2);
    expect(rules.map((rule) => rule.condition.regexFilter)).toEqual([
      '^https://a\\.example\\.com/.*$',
      '^https://b\\.example\\.com/.*$',
    ]);
  });
});
