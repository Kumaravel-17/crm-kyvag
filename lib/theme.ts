export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "kyvag-theme";

/** Light is the default; dark only when the user picked it */
export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
}

/** Inline script for <head>: applies the saved theme before first paint */
export const themeScript = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}`;
