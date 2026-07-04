import { test, expect } from "@playwright/test";

test.describe("uMap click-to-load", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem("climateFreskModalSeen", "true");
    });
  });

  test("does not load the map iframe before explicit click", async ({
    page,
  }) => {
    await page.goto("/");

    const iframe = page.locator("#umap-iframe");
    await expect(iframe).not.toHaveAttribute("src", /./);
    await expect(
      page.locator('link[rel="preconnect"][href*="openstreetmap"]'),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Načíst mapu" }),
    ).toBeVisible();
  });

  test("loads the Czech map iframe after click", async ({ page }) => {
    await page.goto("/");

    const iframe = page.locator("#umap-iframe");
    await page.getByRole("button", { name: "Načíst mapu" }).click();

    await expect(iframe).toHaveAttribute(
      "src",
      /umap\.openstreetmap\.fr\/cs-cz\/map\/mapa-telperionu_1371476/,
    );
  });

  test("loads the English map iframe after click", async ({ page }) => {
    await page.goto("/en/");

    const iframe = page.locator("#umap-iframe");
    await page.getByRole("button", { name: "Load map" }).click();

    await expect(iframe).toHaveAttribute(
      "src",
      /umap\.openstreetmap\.fr\/en\/map\/mapa-telperionu_1371476/,
    );
  });
});
