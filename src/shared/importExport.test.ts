import { describe, expect, it, vi } from 'vitest';

import {
  createImportedHeaderItems,
  createImportedUrlFilterItems,
  createProfileExportConfig,
  parseImportedProfileConfig,
} from '@/shared/importExport';
import type { Profile } from '@/shared/types';

const profile: Profile = {
  id: 'profile-1',
  name: '配置 1',
  headers: [
    {
      id: 'header-1',
      key: 'x-disabled',
      value: '0',
      enabled: false,
    },
    {
      id: 'header-2',
      key: 'x-debug',
      value: '1',
      enabled: true,
    },
  ],
  urlFilters: [
    {
      id: 'filter-1',
      pattern: '^https://disabled\\.example\\.com/.*$',
      enabled: false,
    },
    {
      id: 'filter-2',
      pattern: '^https://example\\.com/.*$',
      enabled: true,
    },
  ],
};

describe('createProfileExportConfig', () => {
  it('只导出当前面板中已启用的请求头和 URL 规则', () => {
    expect(createProfileExportConfig(profile)).toEqual({
      headers: [
        {
          key: 'x-debug',
          value: '1',
        },
      ],
      urlFilters: [
        {
          pattern: '^https://example\\.com/.*$',
        },
      ],
    });
  });
});

describe('parseImportedProfileConfig', () => {
  it('解析面板级配置', () => {
    const result = parseImportedProfileConfig(
      JSON.stringify({
        headers: [{ key: 'x-fe-env', value: 'custom_style' }],
        urlFilters: [{ pattern: '^https://example\\.com/.*$' }],
      }),
    );

    expect(result).toEqual({
      ok: true,
      profileConfig: {
        headers: [{ key: 'x-fe-env', value: 'custom_style' }],
        urlFilters: [{ pattern: '^https://example\\.com/.*$' }],
      },
    });
  });

  it('拒绝非法 JSON', () => {
    const result = parseImportedProfileConfig('{');

    expect(result).toEqual({
      ok: false,
      error: 'JSON格式无效，请检查输入内容。',
    });
  });

  it('拒绝缺少必要字段的面板配置', () => {
    const result = parseImportedProfileConfig(
      JSON.stringify({
        headers: [{ key: 'x-fe-env' }],
        urlFilters: [],
      }),
    );

    expect(result).toEqual({
      ok: false,
      error: '配置内容不完整，请确认包含 headers 和 urlFilters。',
    });
  });
});

describe('createImportedHeaderItems/createImportedUrlFilterItems', () => {
  it('导入时重新生成 ID 并默认启用', () => {
    const randomUUID = vi
      .spyOn(crypto, 'randomUUID')
      .mockReturnValueOnce('00000000-0000-4000-8000-000000000001')
      .mockReturnValueOnce('00000000-0000-4000-8000-000000000002');

    expect(createImportedHeaderItems([{ key: 'x-debug', value: '1' }])).toEqual(
      [
        {
          id: '00000000-0000-4000-8000-000000000001',
          key: 'x-debug',
          value: '1',
          enabled: true,
        },
      ],
    );
    expect(
      createImportedUrlFilterItems([{ pattern: '^https://example\\.com/.*$' }]),
    ).toEqual([
      {
        id: '00000000-0000-4000-8000-000000000002',
        pattern: '^https://example\\.com/.*$',
        enabled: true,
      },
    ]);

    randomUUID.mockRestore();
  });
});
