import { describe, expect, it } from 'vitest';

import { createProfileHeaderText, parseHeaderText } from '@/shared/headerText';
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
  urlFilters: [],
};

describe('createProfileHeaderText', () => {
  it('复制当前面板中已启用的请求头键值对文本', () => {
    expect(createProfileHeaderText(profile)).toBe('x-debug: 1');
  });

  it('忽略未启用或 key 为空的请求头', () => {
    expect(
      createProfileHeaderText({
        ...profile,
        headers: [
          ...profile.headers,
          { id: 'header-3', key: ' ', value: 'skip', enabled: true },
          {
            id: 'header-4',
            key: ' x-fe-env ',
            value: ' custom ',
            enabled: true,
          },
        ],
      }),
    ).toBe('x-debug: 1\nx-fe-env: custom');
  });
});

describe('parseHeaderText', () => {
  it('解析单行与多行请求头文本', () => {
    expect(parseHeaderText('x-fe-env: canvas_agent')).toEqual({
      ok: true,
      headers: [{ key: 'x-fe-env', value: 'canvas_agent' }],
    });

    expect(
      parseHeaderText('x-fe-env: canvas_agent\nAuthorization: Bearer token'),
    ).toEqual({
      ok: true,
      headers: [
        { key: 'x-fe-env', value: 'canvas_agent' },
        { key: 'Authorization', value: 'Bearer token' },
      ],
    });
  });

  it('忽略空行并允许值中包含冒号', () => {
    expect(
      parseHeaderText('\n  x-forwarded-for: 1.1.1.1:8080  \n\nx-empty:'),
    ).toEqual({
      ok: true,
      headers: [
        { key: 'x-forwarded-for', value: '1.1.1.1:8080' },
        { key: 'x-empty', value: '' },
      ],
    });
  });

  it('拒绝缺少冒号或名称为空的输入', () => {
    expect(parseHeaderText('x-fe-env canvas_agent')).toEqual({
      ok: false,
      error: '第 1 行格式无效，应为「名称: 值」。',
    });

    expect(parseHeaderText('x-debug: 1\n  : value')).toEqual({
      ok: false,
      error: '第 2 行格式无效，应为「名称: 值」。',
    });
  });

  it('拒绝空白输入', () => {
    expect(parseHeaderText('   \n\n')).toEqual({
      ok: false,
      error: '请输入至少一行请求头，格式为「名称: 值」。',
    });
  });
});
