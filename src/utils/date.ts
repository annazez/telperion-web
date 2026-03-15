// A module-scoped cache for Intl.DateTimeFormat instances to avoid performance overhead
const formatters = new Map<string, Intl.DateTimeFormat>();

export function getFormattedDate(date: Date, locale: string = "cs-CZ"): string {
  if (!formatters.has(locale)) {
    formatters.set(
      locale,
      new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }

  return formatters.get(locale)!.format(date);
}
