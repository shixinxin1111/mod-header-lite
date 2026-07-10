export type HeaderItem = {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
};

export type UrlFilterItem = {
  id: string;
  pattern: string;
  enabled: boolean;
};

export type Profile = {
  id: string;
  name: string;
  headers: HeaderItem[];
  urlFilters: UrlFilterItem[];
};

export type ExtensionState = {
  extensionEnabled: boolean;
  profiles: Profile[];
  activeProfileId: string | null;
};
