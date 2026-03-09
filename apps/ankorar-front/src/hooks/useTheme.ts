import localStorageFunctions, {
  localStorageKeys,
} from "@/utils/localStorageFunctions";
import { useCallback, useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark";

const THEME_MODE_EVENT = "ankorar:theme-mode-change";
const THEME_TRANSITION_CLASS = "theme-mode-transition";
const THEME_TRANSITION_DURATION_MS = 180;

function readStoredThemeMode(): ThemeMode | null {
  const storedTheme = localStorageFunctions.Get<ThemeMode>(
    localStorageKeys.THEME,
  );

  return storedTheme === "dark" || storedTheme === "light" ? storedTheme : null;
}

function readThemeMode(): ThemeMode {
  return readStoredThemeMode() ?? "light";
}

function emitThemeModeChange(themeMode: ThemeMode) {
  window.dispatchEvent(
    new CustomEvent<ThemeMode>(THEME_MODE_EVENT, { detail: themeMode }),
  );
}

function applyThemeMode(themeMode: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("dark", themeMode === "dark");
  root.style.colorScheme = themeMode;
}

function applyThemeModeWithTransition(themeMode: ThemeMode) {
  const root = document.documentElement;
  root.classList.add(THEME_TRANSITION_CLASS);
  applyThemeMode(themeMode);

  window.setTimeout(() => {
    root.classList.remove(THEME_TRANSITION_CLASS);
  }, THEME_TRANSITION_DURATION_MS);
}

export function setThemeMode(themeMode: ThemeMode) {
  localStorageFunctions.Set(localStorageKeys.THEME, themeMode);
  applyThemeModeWithTransition(themeMode);
  emitThemeModeChange(themeMode);
}

export function initializeThemeMode() {
  const initialThemeMode = readThemeMode();
  applyThemeMode(initialThemeMode);
}

function subscribe(onStoreChange: () => void) {
  const onChange = () => onStoreChange();
  const onStorage = (event: StorageEvent) => {
    if (event.key === localStorageKeys.THEME) {
      onStoreChange();
    }
  };

  window.addEventListener(THEME_MODE_EVENT, onChange);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(THEME_MODE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  return readThemeMode();
}

export function useTheme() {
  const themeMode = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const toggleThemeMode = useCallback(() => {
    setThemeMode(themeMode === "dark" ? "light" : "dark");
  }, [themeMode]);

  return {
    themeMode,
    setThemeMode,
    toggleThemeMode,
  };
}
