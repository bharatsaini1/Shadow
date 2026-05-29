import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

function humanDelay(min = 300, max = 800) {
  return new Promise((r) =>
    setTimeout(r, min + Math.random() * (max - min))
  );
}

async function humanType(page, selector, text) {
  const el = page.locator(selector);
  await el.click();
  for (const ch of text) {
    await el.press(ch);
    await page.waitForTimeout(50 + Math.random() * 120);
  }
}

async function humanScroll(page, times = 3) {
  for (let i = 0; i < times; i++) {
    await page.mouse.wheel(0, 300 + Math.random() * 400);
    await humanDelay(200, 600);
  }
}

test.describe("Landing Page - Public User Journey", () => {
  test("loads landing page and verifies all sections", async ({ page }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(500, 1000);

    await expect(page.locator("nav")).toBeVisible();
    await expect(page.getByText("MentriQ Shadow").first()).toBeVisible();
    await expect(
      page.getByText("Experience the Job Before Getting the Job.")
    ).toBeVisible();

    await page.locator('nav a[href="#how-it-works"]').click();
    await humanDelay(400, 800);
    await expect(page.locator("#how-it-works")).toBeVisible();

    await page.locator('nav a[href="#tracks"]').click();
    await humanDelay(400, 800);
    await expect(page.locator("#tracks")).toBeVisible();

    await page.locator('nav a[href="#pricing"]').click();
    await humanDelay(400, 800);
    await expect(page.locator("#pricing")).toBeVisible();

    await humanScroll(page, 5);

    const trackCards = page.locator("#tracks .fade-in");
    const trackCount = await trackCards.count();
    expect(trackCount).toBeGreaterThanOrEqual(4);

    const planCards = page.locator("#pricing .grid > .fade-in");
    const planCount = await planCards.count();
    expect(planCount).toBe(3);

    expect(consoleErrors).toEqual(
      expect.arrayContaining(
        consoleErrors.filter((e) => !e.includes("favicon"))
      )
    );

    const jsErrors = consoleErrors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("manifest") &&
        !e.includes("404") &&
        !e.includes("net::")
    );
    expect(jsErrors).toEqual([]);
  });

  test("navigates from landing to login page", async ({ page }) => {
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(300, 600);

    await page.getByRole("link", { name: "Get Started" }).first().click();
    await page.waitForURL("**/login", { timeout: 10000 });
    await humanDelay(500, 1000);

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText("Welcome back")).toBeVisible();

    const jsErrors = consoleErrors.filter(
      (e) => !e.includes("favicon") && !e.includes("net::")
    );
    expect(jsErrors).toEqual([]);
  });

  test("landing page has working anchor links in footer", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(300, 600);

    await humanScroll(page, 15);

    const footerLinks = page.locator("footer a");
    const count = await footerLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < count; i++) {
      const href = await footerLinks.nth(i).getAttribute("href");
      expect(href).toMatch(/^#/);
    }
  });
});

test.describe("Login / Register Page - User Auth Journey", () => {
  test("loads login page with both forms", async ({ page }) => {
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(500, 800);

    await expect(page.getByText("Welcome back")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();

    await page.getByText("Don't have an account? Sign up").click();
    await humanDelay(300, 500);

    await expect(page.getByText("Create your account")).toBeVisible();
    await expect(page.locator("#name")).toBeVisible();

    await page.getByText("Already have an account? Sign in").click();
    await humanDelay(300, 500);
    await expect(page.getByText("Welcome back")).toBeVisible();

    const jsErrors = consoleErrors.filter(
      (e) => !e.includes("favicon") && !e.includes("net::")
    );
    expect(jsErrors).toEqual([]);
  });

  test("login form validates required fields", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(400, 700);

    const submitBtn = page.getByRole("button", { name: "Sign In" });
    await submitBtn.click();
    await humanDelay(300, 500);

    const emailInput = page.locator("#email");
    await expect(emailInput).toBeFocused();
  });

  test("register form validates required fields", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(400, 700);

    await page.getByText("Don't have an account? Sign up").click();
    await humanDelay(300, 500);

    const submitBtn = page.getByRole("button", { name: "Create Account" });
    await submitBtn.click();
    await humanDelay(300, 500);

    const nameInput = page.locator("#name");
    await expect(nameInput).toBeFocused();
  });

  test("login form shows error on invalid credentials", async ({ page }) => {
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(400, 700);

    await humanType(page, "#email", "nonexistent@test.com");
    await humanType(page, "#password", "wrongpassword123");
    await humanDelay(200, 400);

    await page.getByRole("button", { name: "Sign In" }).click();
    await humanDelay(1000, 2000);

    await expect(page.getByText("Welcome back")).toBeVisible();

    const jsErrors = consoleErrors.filter(
      (e) => !e.includes("favicon") && !e.includes("net::")
    );
    expect(jsErrors).toEqual([]);
  });

  test("register form shows error on existing email", async ({ page }) => {
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    const testEmail = `duplicate-${Date.now()}@test.com`;

    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(400, 700);

    await page.getByText("Don't have an account? Sign up").click();
    await humanDelay(300, 500);

    await humanType(page, "#name", "Test User");
    await humanType(page, "#email", testEmail);
    await humanType(page, "#password", "password12345");
    await humanDelay(200, 400);

    await page.getByRole("button", { name: "Create Account" }).click();
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    await humanDelay(500, 800);

    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(400, 700);

    await page.getByText("Don't have an account? Sign up").click();
    await humanDelay(300, 500);

    await humanType(page, "#name", "Test User 2");
    await humanType(page, "#email", testEmail);
    await humanType(page, "#password", "password12345");
    await humanDelay(200, 400);

    await page.getByRole("button", { name: "Create Account" }).click();
    await humanDelay(1500, 2500);

    await expect(page.getByText("Create your account")).toBeVisible();

    const jsErrors = consoleErrors.filter(
      (e) => !e.includes("favicon") && !e.includes("net::")
    );
    expect(jsErrors).toEqual([]);
  });
});

test.describe("Dashboard - Authenticated User Journey", () => {
  test("redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/dashboard", { waitUntil: "networkidle" });
    await humanDelay(1000, 2000);

    await expect(page).toHaveURL(/\/login/);
  });

  test("shows login page elements correctly", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(500, 800);

    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign In" })
    ).toBeVisible();

    const termsLink = page.getByRole("link", { name: "Terms of Service" });
    await expect(termsLink).toBeVisible();
  });
});

test.describe("Simulation Page - No Session", () => {
  test("shows empty state when no session_id", async ({ page }) => {
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/simulation", { waitUntil: "networkidle" });
    await humanDelay(1000, 1500);

    await expect(
      page.getByText("No Simulation Selected")
    ).toBeVisible();
    await expect(
      page.getByText("Start a simulation from the dashboard")
    ).toBeVisible();

    const jsErrors = consoleErrors.filter(
      (e) => !e.includes("favicon") && !e.includes("net::")
    );
    expect(jsErrors).toEqual([]);
  });
});

test.describe("Interview Page - No Session", () => {
  test("shows error when no interview_id", async ({ page }) => {
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/interview", { waitUntil: "networkidle" });
    await humanDelay(1000, 1500);

    await expect(
      page.getByText("No interview ID provided")
    ).toBeVisible();

    const jsErrors = consoleErrors.filter(
      (e) => !e.includes("favicon") && !e.includes("net::")
    );
    expect(jsErrors).toEqual([]);
  });
});

test.describe("Evaluation Page - No Session", () => {
  test("shows error when no task_id", async ({ page }) => {
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/evaluation", { waitUntil: "networkidle" });
    await humanDelay(1000, 1500);

    await expect(
      page.getByText("No task ID provided").first()
    ).toBeVisible();

    const jsErrors = consoleErrors.filter(
      (e) => !e.includes("favicon") && !e.includes("net::")
    );
    expect(jsErrors).toEqual([]);
  });
});

test.describe("Navigation & Cross-Page Flows", () => {
  test("can navigate between public pages without errors", async ({ page }) => {
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));

    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(500, 800);

    await page.getByRole("link", { name: "Get Started" }).first().click();
    await page.waitForURL("**/login", { timeout: 10000 });
    await humanDelay(500, 800);

    const logoLink = page.locator('a[href="/"]').first();
    await logoLink.click();
    await page.waitForURL("**/", { timeout: 10000 });
    await humanDelay(500, 800);

    await expect(
      page.getByText("Experience the Job Before Getting the Job.")
    ).toBeVisible();

    const jsErrors = consoleErrors.filter(
      (e) => !e.includes("favicon") && !e.includes("net::")
    );
    expect(jsErrors).toEqual([]);
  });

  test("page has correct metadata", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const title = await page.title();
    expect(title).toContain("MentriQ Shadow");
  });
});

test.describe("Responsive Layout Checks", () => {
  test("landing page renders on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(500, 800);

    await expect(
      page.getByText("Experience the Job Before Getting the Job.")
    ).toBeVisible();

    await humanScroll(page, 3);
  });

  test("login page renders on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(500, 800);

    await expect(page.getByText("Welcome back")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
  });
});
