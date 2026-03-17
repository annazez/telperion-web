export const SUPPORTED_LANGUAGES = ["cs-CZ", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "cs-CZ";

export const routeMap: Record<string, string> = {
  "/kontakty": "/en/contacts",
  "/clanky": "/en/articles",
  "/programy/pro-skoly": "/en/workshops/for-schools",
  "/programy/pro-verejnost": "/en/workshops/for-public",
  "/programy/dalsi-programy": "/en/workshops/other",
};

// Optimization: Pre-calculate reverse map and entries
export const reverseRouteMap: Record<string, string> = Object.fromEntries(
  Object.entries(routeMap).map(([cz, en]) => [en, cz]),
);

export const routeMapEntries = Object.entries(routeMap);

/**
 * Translates a path between Czech and English based on the routeMap.
 * Handles exact matches and sub-paths (e.g., articles/slug).
 */
export function translatePath(path: string, toLang: "en" | "cs"): string {
  const isEn = path === "/en" || path.startsWith("/en/");

  if (toLang === "en") {
    // If already in English, return as is
    if (isEn) return path;

    // Exact match lookup O(1)
    const exactMatch = routeMap[path];
    if (exactMatch) return exactMatch;

    // Sub-path match
    for (let i = 0; i < routeMapEntries.length; i++) {
      const [czBase, enBase] = routeMapEntries[i];
      if (path.startsWith(`${czBase}/`)) {
        return path.replace(czBase, enBase);
      }
    }

    // Default: add /en prefix
    return `/en${path === "/" ? "" : path}`;
  } else {
    // If not in English (so it's Czech), return as is
    if (!isEn) return path;

    // Exact match lookup O(1)
    const exactMatch = reverseRouteMap[path];
    if (exactMatch) return exactMatch;

    // Sub-path match
    for (let i = 0; i < routeMapEntries.length; i++) {
      const [czBase, enBase] = routeMapEntries[i];
      if (path.startsWith(`${enBase}/`)) {
        return path.replace(enBase, czBase);
      }
    }

    // Default: remove /en prefix
    return path.replace(/^\/en(?=\/|$)/, "") || "/";
  }
}

export function getSafeLanguage(): SupportedLanguage {
  // Use the URL pathname to strictly determine the language
  if (typeof window !== "undefined") {
    const isEn =
      window.location.pathname === "/en" ||
      window.location.pathname.startsWith("/en/");
    return isEn ? "en" : "cs-CZ";
  }

  // Fallback for SSR (should use Astro.currentLocale there instead)
  return DEFAULT_LANGUAGE;
}
