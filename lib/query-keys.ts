export const AUTH_QUERY_KEYS = {
  all: ["auth"] as const,
  me: () => [...AUTH_QUERY_KEYS.all, "me"] as const,
};

export const USERS_QUERY_KEYS = {
  all: ["users"] as const,
  list: () => [...USERS_QUERY_KEYS.all, "list"] as const,
};

export const DONATIONS_QUERY_KEYS = {
  all: ["donations"] as const,
  list: (params: Record<string, string>) =>
    [...DONATIONS_QUERY_KEYS.all, "list", params] as const,
};

export const STREETS_QUERY_KEYS = {
  all: ["streets"] as const,
  list: () => [...STREETS_QUERY_KEYS.all, "list"] as const,
  progress: () => [...STREETS_QUERY_KEYS.all, "progress"] as const,
};

export const STATS_QUERY_KEYS = {
  all: ["stats"] as const,
  summary: () => [...STATS_QUERY_KEYS.all, "summary"] as const,
};

export const SETTINGS_QUERY_KEYS = {
  all: ["settings"] as const,
};

export const PHOTOS_QUERY_KEYS = {
  all: ["photos"] as const,
  list: () => [...PHOTOS_QUERY_KEYS.all, "list"] as const,
};

export const UPDATES_QUERY_KEYS = {
  all: ["updates"] as const,
  list: () => [...UPDATES_QUERY_KEYS.all, "list"] as const,
};

export const EXPENSES_QUERY_KEYS = {
  all: ["expenses"] as const,
  list: (params: Record<string, string>) =>
    [...EXPENSES_QUERY_KEYS.all, "list", params] as const,
  categories: () => [...EXPENSES_QUERY_KEYS.all, "categories"] as const,
};
