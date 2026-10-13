import { createHeaderItem, createUrlFilterItem } from '@/shared/defaults';
import type { HeaderItem, Profile, UrlFilterItem } from '@/shared/types';

type ImportedHeaderItem = {
  key: string;
  value: string;
};

type ImportedUrlFilterItem = {
  pattern: string;
};

type ImportedProfileConfig = {
  headers: ImportedHeaderItem[];
  urlFilters: ImportedUrlFilterItem[];
};

type ValidationResult =
  | {
      ok: true;
      profileConfig: ImportedProfileConfig;
    }
  | {
      ok: false;
      error: string;
    };

function isRecord(input: unknown): input is Record<string, unknown> {
  return !!input && typeof input === 'object' && !Array.isArray(input);
}

function hasStringField(input: Record<string, unknown>, field: string) {
  return typeof input[field] === 'string';
}

function validateImportedHeaderItem(
  input: unknown,
): input is ImportedHeaderItem {
  return isRecord(input) && hasStringField(input, 'key') && hasStringField(input, 'value');
}

function validateImportedUrlFilterItem(
  input: unknown,
): input is ImportedUrlFilterItem {
  return isRecord(input) && hasStringField(input, 'pattern');
}

export function createProfileExportConfig(
  profile: Profile,
): ImportedProfileConfig {
  return {
    headers: profile.headers
      .filter((header) => header.enabled)
      .map(({ key, value }) => ({ key, value })),
    urlFilters: profile.urlFilters
      .filter((filter) => filter.enabled)
      .map(({ pattern }) => ({ pattern })),
  };
}

export function parseImportedProfileConfig(input: string): ValidationResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(input);
  } catch {
    return {
      ok: false,
      error: 'JSON格式无效，请检查输入内容。',
    };
  }

  if (!isRecord(parsed)) {
    return {
      ok: false,
      error: '配置内容必须是一个 JSON 对象。',
    };
  }

  const headers = parsed.headers;
  const urlFilters = parsed.urlFilters;

  if (
    !Array.isArray(headers) ||
    !headers.every(validateImportedHeaderItem) ||
    !Array.isArray(urlFilters) ||
    !urlFilters.every(validateImportedUrlFilterItem)
  ) {
    return {
      ok: false,
      error: '配置内容不完整，请确认包含 headers 和 urlFilters。',
    };
  }

  return {
    ok: true,
    profileConfig: {
      headers,
      urlFilters,
    },
  };
}

export function createImportedHeaderItems(
  headers: ImportedHeaderItem[],
): HeaderItem[] {
  return headers.map((header) => ({
    ...createHeaderItem(),
    key: header.key,
    value: header.value,
    enabled: true,
  }));
}

export function createImportedUrlFilterItems(
  urlFilters: ImportedUrlFilterItem[],
): UrlFilterItem[] {
  return urlFilters.map((filter) => ({
    ...createUrlFilterItem(),
    pattern: filter.pattern,
    enabled: true,
  }));
}
