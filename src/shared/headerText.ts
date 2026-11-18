import type { Profile } from '@/shared/types';

export type ParsedHeaderLine = {
  key: string;
  value: string;
};

type ParseHeaderTextResult =
  | {
      ok: true;
      headers: ParsedHeaderLine[];
    }
  | {
      ok: false;
      error: string;
    };

export function createProfileHeaderText(profile: Profile) {
  return profile.headers
    .filter((header) => header.enabled && header.key.trim())
    .map((header) => `${header.key.trim()}: ${header.value.trim()}`)
    .join('\n');
}

export function parseHeaderText(input: string): ParseHeaderTextResult {
  const headers: ParsedHeaderLine[] = [];

  for (const [lineIndex, rawLine] of input.split(/\r?\n/).entries()) {
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    const separatorIndex = line.indexOf(':');
    const key = separatorIndex > 0 ? line.slice(0, separatorIndex).trim() : '';

    if (!key) {
      return {
        ok: false,
        error: `第 ${lineIndex + 1} 行格式无效，应为「名称: 值」。`,
      };
    }

    headers.push({
      key,
      value: line.slice(separatorIndex + 1).trim(),
    });
  }

  if (!headers.length) {
    return {
      ok: false,
      error: '请输入至少一行请求头，格式为「名称: 值」。',
    };
  }

  return {
    ok: true,
    headers,
  };
}
