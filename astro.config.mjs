import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

import sentry from "@sentry/astro";

const sentryDsn = process.env.PUBLIC_SENTRY_DSN;
const sentryOrg = process.env.SENTRY_ORG ?? "telperion-zs";
const sentryProject = process.env.SENTRY_PROJECT ?? "javascript-astro";
const sentrySourceMapsEnabled = Boolean(
  sentryDsn && process.env.SENTRY_AUTH_TOKEN && sentryOrg && sentryProject,
);

export default defineConfig({
  site: "https://www.telperion.cz",
  adapter: vercel(),
  i18n: {
    defaultLocale: "cs",
    locales: ["cs", "en"],
    routing: {
      prefixDefaultLocale: false,
      strategy: "pathname",
    },
  },
  integrations: [
    icon(),
    react(),
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        return ![/^\/test(\/|$)/, /\/404\/?$/, /\/500\/?$/].some((pattern) =>
          pattern.test(pathname),
        );
      },
    }),
    sentry({
      enabled: Boolean(sentryDsn),
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: sentryOrg,
      project: sentryProject,
      sourcemaps: {
        disable: !sentrySourceMapsEnabled,
      },
      telemetry: false,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
