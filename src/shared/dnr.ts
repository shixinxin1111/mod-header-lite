import type {
  ExtensionState,
  HeaderItem,
  Profile,
  UrlFilterItem,
} from '@/shared/types';
import { validateRegexPattern } from '@/shared/validation';

const RESOURCE_TYPES: chrome.declarativeNetRequest.ResourceType[] = [
  'main_frame',
  'sub_frame',
  'xmlhttprequest',
  'script',
  'image',
  'font',
  'media',
  'ping',
  'other',
] as unknown as chrome.declarativeNetRequest.ResourceType[];

export function getActiveProfile(state: ExtensionState): Profile | null {
  return (
    state.profiles.find((profile) => profile.id === state.activeProfileId) ??
    null
  );
}

function compileRequestHeaders(
  headers: HeaderItem[],
): chrome.declarativeNetRequest.ModifyHeaderInfo[] {
  const compiledHeaders: chrome.declarativeNetRequest.ModifyHeaderInfo[] = [];
  const seenHeaders = new Set<string>();

  for (let index = headers.length - 1; index >= 0; index -= 1) {
    const item = headers[index];
    const key = item.key.trim();
    const value = item.value.trim();
    const normalizedKey = key.toLowerCase();

    if (!item.enabled || !key || !value || seenHeaders.has(normalizedKey)) {
      continue;
    }

    seenHeaders.add(normalizedKey);
    compiledHeaders.unshift({
      header: key,
      operation: 'set',
      value,
    });
  }

  return compiledHeaders;
}

function getValidUrlFilters(urlFilters: UrlFilterItem[]) {
  return urlFilters.filter((item) => {
    if (!item.enabled || !item.pattern.trim()) {
      return false;
    }

    return validateRegexPattern(item.pattern) === null;
  });
}

export function compileDynamicRules(
  state: ExtensionState,
): chrome.declarativeNetRequest.Rule[] {
  if (!state.extensionEnabled) {
    return [];
  }

  const activeProfile = getActiveProfile(state);

  if (!activeProfile) {
    return [];
  }

  const compiledHeaders = compileRequestHeaders(activeProfile.headers);
  const validUrlFilters = getValidUrlFilters(activeProfile.urlFilters);

  if (!compiledHeaders.length || !validUrlFilters.length) {
    return [];
  }

  return validUrlFilters.map((filter, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: 'modifyHeaders',
      requestHeaders: compiledHeaders,
    },
    condition: {
      regexFilter: filter.pattern.trim(),
      resourceTypes: RESOURCE_TYPES,
    },
  }));
}

export async function syncDynamicRules(state: ExtensionState) {
  if (typeof chrome === 'undefined' || !chrome.declarativeNetRequest) {
    return;
  }

  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const compiledRules = compileDynamicRules(state);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingRules.map((rule) => rule.id),
    addRules: compiledRules,
  });

  return compiledRules;
}
