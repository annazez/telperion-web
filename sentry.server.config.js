import * as Sentry from "@sentry/astro";

const tracesSampleRate = Number.parseFloat(
  process.env.SENTRY_TRACES_SAMPLE_RATE ??
    process.env.PUBLIC_SENTRY_TRACES_SAMPLE_RATE ??
    "0",
);

Sentry.init({
  dsn: process.env.PUBLIC_SENTRY_DSN,
  environment:
    process.env.SENTRY_ENVIRONMENT ??
    process.env.PUBLIC_SENTRY_ENVIRONMENT ??
    process.env.VERCEL_ENV ??
    import.meta.env.MODE,
  sendDefaultPii: false,
  tracesSampleRate: Number.isFinite(tracesSampleRate) ? tracesSampleRate : 0,
});
