import { describe, expect, it } from 'vitest';

import { urlToOriginRegexPattern } from '@/shared/urlPattern';

describe('urlToOriginRegexPattern', () => {
  it('只保留当前 URL 的协议和域名，路径使用通配符', () => {
    expect(
      urlToOriginRegexPattern(
        'https://example.com/search/results?q=header#intro',
      ),
    ).toBe('^https://example\\.com/.*$');
  });

  it('会保留非默认端口号', () => {
    expect(urlToOriginRegexPattern('http://localhost:3000/settings')).toBe(
      '^http://localhost:3000/.*$',
    );
  });

  it('不会为浏览器内部页面生成规则', () => {
    expect(urlToOriginRegexPattern('chrome://extensions/')).toBe('');
  });
});
