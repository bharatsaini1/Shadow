import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

function humanDelay(min = 300, max = 800) {
  return new Promise((r) =>
    setTimeout(r, min + Math.random() * (max - min))
  );
}

test.describe("Visual Regression - Landing Page", () => {
  test("landing page full screenshot", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(1000, 1500);

    await expect(page).toHaveScreenshot("landing-page-full.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test("landing page hero section", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(800, 1200);

    const hero = page.locator("section").first();
    await expect(hero).toHaveScreenshot("landing-hero-section.png", {
      maxDiffPixelRatio: 0.05,
    });
  });

  test("landing page navigation bar", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(500, 800);

    const nav = page.locator("nav");
    await expect(nav).toHaveScreenshot("landing-nav-bar.png", {
      maxDiffPixelRatio: 0.05,
    });
  });

  test("landing page tracks section", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(500, 800);

    const tracks = page.locator("#tracks");
    await expect(tracks).toHaveScreenshot("landing-tracks-section.png", {
      maxDiffPixelRatio: 0.05,
    });
  });

  test("landing page pricing section", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(500, 800);

    const pricing = page.locator("#pricing");
    await expect(pricing).toHaveScreenshot("landing-pricing-section.png", {
      maxDiffPixelRatio: 0.05,
    });
  });

  test("landing page footer", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(500, 800);

    const footer = page.locator("footer");
    await expect(footer).toHaveScreenshot("landing-footer.png", {
      maxDiffPixelRatio: 0.05,
    });
  });
});

test.describe("Visual Regression - Login Page", () => {
  test("login page full screenshot", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(1000, 1500);

    await expect(page).toHaveScreenshot("login-page-full.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test("login form card", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(800, 1200);

    const card = page.locator(".rounded-xl.bg-surface").first();
    await expect(card).toHaveScreenshot("login-form-card.png", {
      maxDiffPixelRatio: 0.05,
    });
  });

  test("register form card", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(500, 800);

    await page.getByText("Don't have an account? Sign up").click();
    await humanDelay(500, 800);

    const card = page.locator(".rounded-xl.bg-surface").first();
    await expect(card).toHaveScreenshot("register-form-card.png", {
      maxDiffPixelRatio: 0.05,
    });
  });
});

test.describe("Visual Regression - Dashboard", () => {
  test("dashboard redirects to login when not authenticated", async ({
    page,
  }) => {
    await page.goto("/dashboard", { waitUntil: "networkidle" });
    await humanDelay(1500, 2500);

    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Visual Regression - Simulation (Empty State)", () => {
  test("simulation empty state screenshot", async ({ page }) => {
    await page.goto("/simulation", { waitUntil: "networkidle" });
    await humanDelay(1000, 1500);

    await expect(page).toHaveScreenshot("simulation-empty-state.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
});

test.describe("Visual Regression - Interview (Error State)", () => {
  test("interview no-id error screenshot", async ({ page }) => {
    await page.goto("/interview", { waitUntil: "networkidle" });
    await humanDelay(1000, 1500);

    await expect(page).toHaveScreenshot("interview-no-id-error.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
});

test.describe("Visual Regression - Evaluation (Error State)", () => {
  test("evaluation no-id error screenshot", async ({ page }) => {
    await page.goto("/evaluation", { waitUntil: "networkidle" });
    await humanDelay(1000, 1500);

    await expect(page).toHaveScreenshot("evaluation-no-id-error.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
});

test.describe("Visual Regression - Responsive", () => {
  test("landing page mobile screenshot", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(1000, 1500);

    await expect(page).toHaveScreenshot("landing-page-mobile.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test("login page mobile screenshot", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(1000, 1500);

    await expect(page).toHaveScreenshot("login-page-mobile.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });

  test("landing page tablet screenshot", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(1000, 1500);

    await expect(page).toHaveScreenshot("landing-page-tablet.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
});
