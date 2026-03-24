import { test, expect } from "@playwright/test";

test("Benchmark: Individual vs Delegated Event Listeners", async ({ page }) => {
  // Go to a blank page for accurate measurement
  await page.goto("about:blank");

  // Inject 5000 dummy elements to simulate a very large page/gallery
  await page.evaluate(() => {
    const container = document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);

    let html = "";
    for (let i = 0; i < 5000; i++) {
      html += `
        <div class="lightbox-trigger" data-full-src="img${i}.jpg">
          <img src="thumb${i}.jpg" alt="Image ${i}" />
        </div>
      `;
    }
    container.innerHTML = html;
  });

  // Wait for elements to be present
  await page.waitForSelector(".lightbox-trigger");

  // Measure individual listeners (Baseline)
  const individualTime = await page.evaluate(() => {
    const start = performance.now();
    const triggers = document.querySelectorAll(".lightbox-trigger");

    // Simulate current Astro script logic
    triggers.forEach((btn) => {
      btn.addEventListener("click", function _individualHandler() {
        // dummy op
        const src = (btn as HTMLElement).dataset.fullSrc || "";
        const alt = btn.querySelector("img")?.alt || "";
      });
    });

    const end = performance.now();

    // Clean up to be fair
    triggers.forEach((btn) => {
      // It's hard to remove anonymous listeners, but we can just measure the attachment time
      // For a fair test, we mainly care about attachment time anyway
    });

    return end - start;
  });

  console.log(
    `⏱️ Baseline (Individual Listeners - 5000 elements): ${individualTime.toFixed(2)}ms`,
  );

  // We need to clear and recreate the DOM to ensure a clean state for the second test
  await page.evaluate(() => {
    document.body.innerHTML = "";
    const container = document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);

    let html = "";
    for (let i = 0; i < 5000; i++) {
      html += `
        <div class="lightbox-trigger" data-full-src="img${i}.jpg">
          <img src="thumb${i}.jpg" alt="Image ${i}" />
        </div>
      `;
    }
    container.innerHTML = html;
  });

  // Measure delegated listener (Optimized)
  const delegatedTime = await page.evaluate(() => {
    const start = performance.now();

    // Simulate the new delegated logic
    document.addEventListener("click", (e) => {
      const target = (e.target as Element).closest(".lightbox-trigger");
      if (!target) return;

      const src = (target as HTMLElement).dataset.fullSrc || "";
      const alt = target.querySelector("img")?.alt || "";
    });

    const end = performance.now();
    return end - start;
  });

  console.log(
    `🚀 Optimized (Delegated Listener - 5000 elements): ${delegatedTime.toFixed(2)}ms`,
  );

  // Calculate improvement
  const improvementMultiplier = individualTime / (delegatedTime || 0.01); // avoid div by zero
  console.log(
    `📊 Improvement: ~${Math.round(improvementMultiplier)}x faster to attach`,
  );

  expect(delegatedTime).toBeLessThan(individualTime);
});
