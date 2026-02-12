export const localStorageKeys = {
  THEME: "@ankorar-adm-theme",
  WAIT_REFRESH: "@ankorar-adm-wait-refresh",
} as const;

export type LocalStorageKeys =
  (typeof localStorageKeys)[keyof typeof localStorageKeys];

function Get<T = unknown>(key: LocalStorageKeys): T | null {
  const item = localStorage.getItem(key);

  return item ? (JSON.parse(item) as T) : null;
}

function isQuotaExceeded(error: unknown) {
  if (typeof DOMException === "undefined") return false;
  if (!(error instanceof DOMException)) return false;

  return (
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    error.code === 22 ||
    error.code === 1014
  );
}

function Set(key: LocalStorageKeys, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (isQuotaExceeded(error)) {
      return false;
    }

    throw error;
  }
}

function Remove(key: LocalStorageKeys) {
  localStorage.removeItem(key);
}

export default { Get, Set, Remove };
