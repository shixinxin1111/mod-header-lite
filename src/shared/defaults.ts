import type { ExtensionState, HeaderItem, Profile, UrlFilterItem } from '@/shared/types';

function createId() {
  return crypto.randomUUID();
}

export function createHeaderItem(): HeaderItem {
  return {
    id: createId(),
    key: '',
    value: '',
    enabled: true,
  };
}

export function createUrlFilterItem(): UrlFilterItem {
  return {
    id: createId(),
    pattern: '',
    enabled: true,
  };
}

export function createProfile(profileNumber: number): Profile {
  return {
    id: createId(),
    name: `配置 ${profileNumber}`,
    headers: [],
    urlFilters: [],
  };
}

export function createDefaultState(): ExtensionState {
  const defaultProfile = createProfile(1);

  return {
    extensionEnabled: true,
    profiles: [defaultProfile],
    activeProfileId: defaultProfile.id,
  };
}
