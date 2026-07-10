import { createDefaultState, createHeaderItem, createProfile, createUrlFilterItem } from '@/shared/defaults';
import type { ExtensionState, HeaderItem, Profile, UrlFilterItem } from '@/shared/types';

export const STORAGE_KEY = 'mod-header-lite-state';

function createNormalizedHeaderItem(input: Partial<HeaderItem> | undefined): HeaderItem {
  return {
    ...createHeaderItem(),
    key: input?.key?.trim() ?? '',
    value: input?.value?.trim() ?? '',
    enabled: input?.enabled ?? true,
    id: input?.id ?? crypto.randomUUID(),
  };
}

function createNormalizedUrlFilterItem(input: Partial<UrlFilterItem> | undefined): UrlFilterItem {
  return {
    ...createUrlFilterItem(),
    pattern: input?.pattern ?? '',
    enabled: input?.enabled ?? true,
    id: input?.id ?? crypto.randomUUID(),
  };
}

function createNormalizedProfile(input: Partial<Profile> | undefined, index: number): Profile {
  return {
    ...createProfile(index + 1),
    name: input?.name?.trim() ? input.name.trim() : `配置 ${index + 1}`,
    headers: Array.isArray(input?.headers)
      ? input.headers.map((item) => createNormalizedHeaderItem(item))
      : [],
    urlFilters: Array.isArray(input?.urlFilters)
      ? input.urlFilters.map((item) => createNormalizedUrlFilterItem(item))
      : [],
    id: input?.id ?? crypto.randomUUID(),
  };
}

export function normalizeExtensionState(input: unknown): ExtensionState {
  if (!input || typeof input !== 'object') {
    return createDefaultState();
  }

  const partialState = input as Partial<ExtensionState>;
  const profiles = Array.isArray(partialState.profiles)
    ? partialState.profiles.map((profile, index) => createNormalizedProfile(profile, index))
    : createDefaultState().profiles;

  const activeProfileExists = profiles.some((profile) => profile.id === partialState.activeProfileId);

  return {
    extensionEnabled: partialState.extensionEnabled ?? true,
    profiles,
    activeProfileId: activeProfileExists ? partialState.activeProfileId ?? null : profiles[0]?.id ?? null,
  };
}

function assertChromeStorage() {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    throw new Error('当前环境无法访问 Chrome Storage。');
  }
}

export async function getStoredState() {
  assertChromeStorage();

  const result = await chrome.storage.local.get(STORAGE_KEY);

  return normalizeExtensionState(result[STORAGE_KEY]);
}

export async function saveStoredState(state: ExtensionState) {
  assertChromeStorage();

  const normalizedState = normalizeExtensionState(state);

  await chrome.storage.local.set({
    [STORAGE_KEY]: normalizedState,
  });

  return normalizedState;
}

export async function ensureStoredState() {
  assertChromeStorage();

  const result = await chrome.storage.local.get(STORAGE_KEY);

  if (typeof result[STORAGE_KEY] === 'undefined') {
    const defaultState = createDefaultState();

    await chrome.storage.local.set({
      [STORAGE_KEY]: defaultState,
    });

    return defaultState;
  }

  const normalizedState = normalizeExtensionState(result[STORAGE_KEY]);

  await chrome.storage.local.set({
    [STORAGE_KEY]: normalizedState,
  });

  return normalizedState;
}
