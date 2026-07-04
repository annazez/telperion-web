import * as Sentry from "@sentry/astro";

const tracesSampleRate = Number.parseFloat(
  import.meta.env.PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0",
);

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment:
    import.meta.env.PUBLIC_SENTRY_ENVIRONMENT ??
    import.meta.env.PUBLIC_VERCEL_ENV ??
    import.meta.env.MODE,
  sendDefaultPii: false,
  tracesSampleRate: Number.isFinite(tracesSampleRate) ? tracesSampleRate : 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
});
