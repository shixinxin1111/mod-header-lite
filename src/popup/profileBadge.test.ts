import { describe, expect, it } from 'vitest';

import { getProfileBadge } from '@/popup/profileBadge';

describe('getProfileBadge', () => {
  it('中文名称最多显示两个字', () => {
    expect(getProfileBadge('画布模式')).toBe('画布');
  });

  it('英文名称最多显示四个字符', () => {
    expect(getProfileBadge('canvas')).toBe('canv');
  });

  it('混合名称按两个英文等于一个汉字裁剪', () => {
    expect(getProfileBadge('ab画布')).toBe('ab画');
    expect(getProfileBadge('a画布')).toBe('a画');
  });

  it('空名称显示默认占位', () => {
    expect(getProfileBadge('   ')).toBe('配');
  });

  it('默认配置名称优先显示编号', () => {
    expect(getProfileBadge('配置 12')).toBe('12');
  });
});
