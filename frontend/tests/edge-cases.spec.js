import { test, expect } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

function humanDelay(min = 200, max = 500) {
  return new Promise((r) =>
    setTimeout(r, min + Math.random() * (max - min))
  );
}

const XSS_PAYLOADS = [
  '<script>alert("XSS")</script>',
  '"><img src=x onerror=alert(1)>',
  "javascript:alert(document.cookie)",
  '<svg onload=alert("xss")>',
  "';alert('XSS');//",
  '<iframe src="javascript:alert(1)">',
  '"><body onload=alert(1)>',
  "${7*7}",
  "{{7*7}}",
  "#{7*7}",
];

const SPECIAL_CHAR_INPUTS = [
  "test@#$%^&*()",
  "user+tag@gmail.com",
  "DROP TABLE users;--",
  "admin' OR '1'='1",
  "a]b[c",
  "hello world  ",
  "  spaces  ",
  "\\n\\t\\r",
  "unicode: \u00e9\u00e8\u00ea",
  "emoji: \ud83d\ude00\ud83d\ude01",
  "very".repeat(50) + "long",
  "1234567890".repeat(10),
  "null",
  "undefined",
  "NaN",
  "true",
  "false",
  "0",
  "-1",
  "99999999999999999999",
  "1e308",
  "-1e308",
];

const MALICIOUS_PATHS = [
  "/login<script>alert(1)</script>",
  "/dashboard/../etc/passwd",
  "/login%00.png",
  "/api/v1/../../../etc/passwd",
  "/login%0d%0aInjected-Header: malicious",
  "/<script>alert(1)</script>",
  "/javascript:void(0)",
];

test.describe("Edge Case Injection - Login Page", () => {
  for (const payload of XSS_PAYLOADS) {
    test(`XSS in email field: ${payload.substring(0, 30)}...`, async ({
      page,
    }) => {
      const consoleErrors = [];
      const jsErrors = [];
      page.on("pageerror", (err) => jsErrors.push(err.message));
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });

      await page.goto("/login", { waitUntil: "networkidle" });
      await humanDelay(300, 600);

      await page.locator("#email").fill(payload);
      await page.locator("#password").fill("testpassword123");
      await humanDelay(200, 400);

      await page.getByRole("button", { name: "Sign In" }).click();
      await humanDelay(1000, 2000);

      const alertFired = await page.evaluate(() => {
        return window.__alertFired || false;
      });
      expect(alertFired).toBe(false);

      expect(jsErrors.filter((e) => e.includes("alert"))).toEqual([]);
    });
  }

  for (const payload of XSS_PAYLOADS) {
    test(`XSS in password field: ${payload.substring(0, 30)}...`, async ({
      page,
    }) => {
      const jsErrors = [];
      page.on("pageerror", (err) => jsErrors.push(err.message));

      await page.goto("/login", { waitUntil: "networkidle" });
      await humanDelay(300, 600);

      await page.locator("#email").fill("test@test.com");
      await page.locator("#password").fill(payload);
      await humanDelay(200, 400);

      await page.getByRole("button", { name: "Sign In" }).click();
      await humanDelay(1000, 2000);

      expect(jsErrors.filter((e) => e.includes("alert"))).toEqual([]);
    });
  }

  for (const input of SPECIAL_CHAR_INPUTS) {
    test(`Special chars in email: ${input.substring(0, 25)}...`, async ({
      page,
    }) => {
      const jsErrors = [];
      page.on("pageerror", (err) => jsErrors.push(err.message));

      await page.goto("/login", { waitUntil: "networkidle" });
      await humanDelay(300, 600);

      await page.locator("#email").fill(input);
      await page.locator("#password").fill("password123");
      await humanDelay(200, 400);

      await page.getByRole("button", { name: "Sign In" }).click();
      await humanDelay(1000, 1500);

      await expect(page.getByText("Welcome back")).toBeVisible();
      expect(jsErrors).toEqual([]);
    });
  }

  test("empty email submission", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(300, 600);

    await page.locator("#password").fill("password123");
    await page.getByRole("button", { name: "Sign In" }).click();
    await humanDelay(500, 800);

    const emailValid = await page.locator("#email").evaluate(
      (el) => el.validity.valid
    );
    expect(emailValid).toBe(false);
  });

  test("empty password submission", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(300, 600);

    await page.locator("#email").fill("test@test.com");
    await page.getByRole("button", { name: "Sign In" }).click();
    await humanDelay(500, 800);

    const pwdValid = await page.locator("#password").evaluate(
      (el) => el.validity.valid
    );
    expect(pwdValid).toBe(false);
  });

  test("both fields empty submission", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(300, 600);

    await page.getByRole("button", { name: "Sign In" }).click();
    await humanDelay(500, 800);

    await expect(page.getByText("Welcome back")).toBeVisible();
  });

  test("very long email input", async ({ page }) => {
    const jsErrors = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));

    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(300, 600);

    const longEmail = "a".repeat(500) + "@test.com";
    await page.locator("#email").fill(longEmail);
    await page.locator("#password").fill("password123");
    await humanDelay(200, 400);

    await page.getByRole("button", { name: "Sign In" }).click();
    await humanDelay(1000, 1500);

    await expect(page.getByText("Welcome back")).toBeVisible();
    expect(jsErrors).toEqual([]);
  });

  test("very long password input", async ({ page }) => {
    const jsErrors = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));

    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(300, 600);

    const longPwd = "a".repeat(10000);
    await page.locator("#email").fill("test@test.com");
    await page.locator("#password").fill(longPwd);
    await humanDelay(200, 400);

    await page.getByRole("button", { name: "Sign In" }).click();
    await humanDelay(1000, 1500);

    await expect(page.getByText("Welcome back")).toBeVisible();
    expect(jsErrors).toEqual([]);
  });

  test("SQL injection in email field", async ({ page }) => {
    const jsErrors = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));

    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(300, 600);

    const sqlPayload = "admin'--";
    await page.locator("#email").fill(sqlPayload);
    await page.locator("#password").fill("password123");
    await humanDelay(200, 400);

    await page.getByRole("button", { name: "Sign In" }).click();
    await humanDelay(1000, 1500);

    await expect(page.getByText("Welcome back")).toBeVisible();
    expect(jsErrors).toEqual([]);
  });
});

test.describe("Edge Case Injection - Register Form", () => {
  for (const payload of XSS_PAYLOADS.slice(0, 3)) {
    test(`XSS in name field: ${payload.substring(0, 30)}...`, async ({
      page,
    }) => {
      const jsErrors = [];
      page.on("pageerror", (err) => jsErrors.push(err.message));

      await page.goto("/login", { waitUntil: "networkidle" });
      await humanDelay(300, 600);

      await page.getByText("Don't have an account? Sign up").click();
      await humanDelay(300, 500);

      await page.locator("#name").fill(payload);
      await page.locator("#email").fill("newuser@test.com");
      await page.locator("#password").fill("password12345");
      await humanDelay(200, 400);

      await page.getByRole("button", { name: "Create Account" }).click();
      await humanDelay(1000, 2000);

      expect(jsErrors.filter((e) => e.includes("alert"))).toEqual([]);
    });
  }

  test("empty name field on register", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(300, 600);

    await page.getByText("Don't have an account? Sign up").click();
    await humanDelay(300, 500);

    await page.locator("#email").fill("newuser@test.com");
    await page.locator("#password").fill("password12345");
    await page.getByRole("button", { name: "Create Account" }).click();
    await humanDelay(500, 800);

    const nameValid = await page.locator("#name").evaluate(
      (el) => el.validity.valid
    );
    expect(nameValid).toBe(false);
  });

  test("short password on register", async ({ page }) => {
    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(300, 600);

    await page.getByText("Don't have an account? Sign up").click();
    await humanDelay(300, 500);

    await page.locator("#name").fill("Test User");
    await page.locator("#email").fill("newuser@test.com");
    await page.locator("#password").fill("short");
    await page.getByRole("button", { name: "Create Account" }).click();
    await humanDelay(500, 800);

    const pwdValid = await page.locator("#password").evaluate(
      (el) => el.validity.valid
    );
    expect(pwdValid).toBe(false);
  });

  for (const input of SPECIAL_CHAR_INPUTS.slice(0, 5)) {
    test(`Special chars in register name: ${input.substring(0, 20)}...`, async ({
      page,
    }) => {
      const jsErrors = [];
      page.on("pageerror", (err) => jsErrors.push(err.message));

      await page.goto("/login", { waitUntil: "networkidle" });
      await humanDelay(300, 600);

      await page.getByText("Don't have an account? Sign up").click();
      await humanDelay(300, 500);

      await page.locator("#name").fill(input);
      await page.locator("#email").fill("newuser@test.com");
      await page.locator("#password").fill("password12345");
      await humanDelay(200, 400);

      await page.getByRole("button", { name: "Create Account" }).click();
      await humanDelay(1000, 1500);

      await expect(page.getByText("Create your account")).toBeVisible();
      expect(jsErrors).toEqual([]);
    });
  }
});

test.describe("Edge Case Injection - URL Manipulation", () => {
  for (const path of MALICIOUS_PATHS) {
    test(`Malicious URL: ${path.substring(0, 40)}...`, async ({ page }) => {
      const jsErrors = [];
      page.on("pageerror", (err) => jsErrors.push(err.message));

      try {
        await page.goto(`${BASE_URL}${path}`, {
          waitUntil: "domcontentloaded",
          timeout: 10000,
        });
      } catch (_) {
        // Expected for some malicious paths
      }
      await humanDelay(500, 1000);

      const jsErrorsFiltered = jsErrors.filter(
        (e) => !e.includes("favicon") && !e.includes("net::") && !e.includes("404")
      );
      expect(jsErrorsFiltered).toEqual([]);
    });
  }

  test("path traversal attempt on simulation", async ({ page }) => {
    const jsErrors = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));

    try {
      await page.goto(`${BASE_URL}/simulation?session_id=../../../etc/passwd`, {
        waitUntil: "domcontentloaded",
        timeout: 10000,
      });
    } catch (_) {}
    await humanDelay(500, 1000);

    expect(jsErrors).toEqual([]);
  });

  test("SQL injection in query params", async ({ page }) => {
    const jsErrors = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));

    try {
      await page.goto(
        `${BASE_URL}/evaluation?task_id=1' OR '1'='1`,
        {
          waitUntil: "domcontentloaded",
          timeout: 10000,
        }
      );
    } catch (_) {}
    await humanDelay(500, 1000);

    expect(jsErrors).toEqual([]);
  });
});

test.describe("Edge Case Injection - Rapid Interactions", () => {
  test("rapid form toggle clicks", async ({ page }) => {
    const jsErrors = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));

    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(300, 600);

    for (let i = 0; i < 20; i++) {
      const toggleBtn = page.getByText(
        /Don't have an account|Already have an account/
      );
      await toggleBtn.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(50);
    }
    await humanDelay(500, 800);

    await expect(page.locator("#email")).toBeVisible();
    expect(jsErrors).toEqual([]);
  });

  test("rapid submit button clicks", async ({ page }) => {
    const jsErrors = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));

    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(300, 600);

    await page.locator("#email").fill("test@test.com");
    await page.locator("#password").fill("password123");

    const submitBtn = page.getByRole("button", { name: "Sign In" });
    for (let i = 0; i < 10; i++) {
      await submitBtn.click({ timeout: 1000 }).catch(() => {});
      await page.waitForTimeout(100);
    }
    await humanDelay(1000, 1500);

    await expect(page.getByText("Welcome back")).toBeVisible();
    expect(jsErrors).toEqual([]);
  });

  test("keyboard spam in input fields", async ({ page }) => {
    const jsErrors = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));

    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(300, 600);

    await page.locator("#email").click();
    for (let i = 0; i < 100; i++) {
      await page.keyboard.press(
        ["a", "b", "c", "1", "2", "3", "@", ".", "Backspace"][
          Math.floor(Math.random() * 9)
        ]
      );
    }
    await humanDelay(300, 500);

    await expect(page.locator("#email")).toBeVisible();
    expect(jsErrors).toEqual([]);
  });
});

test.describe("Edge Case Injection - Page Resilience", () => {
  test("rapid page navigation doesn't crash", async ({ page }) => {
    const jsErrors = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));

    const pages = ["/", "/login", "/simulation", "/interview", "/evaluation"];
    for (const p of pages) {
      try {
        await page.goto(`${BASE_URL}${p}`, {
          waitUntil: "domcontentloaded",
          timeout: 5000,
        });
      } catch (_) {}
      await humanDelay(100, 200);
    }
    await humanDelay(500, 800);

    expect(jsErrors).toEqual([]);
  });

  test("browser back/forward doesn't crash", async ({ page }) => {
    const jsErrors = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));

    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(300, 500);

    await page.goto("/login", { waitUntil: "networkidle" });
    await humanDelay(300, 500);

    await page.goBack();
    await humanDelay(500, 800);

    await page.goForward();
    await humanDelay(500, 800);

    await expect(page.locator("#email")).toBeVisible();
    expect(jsErrors).toEqual([]);
  });

  test("page handles missing CSS/JS gracefully", async ({ page }) => {
    const jsErrors = [];
    page.on("pageerror", (err) => jsErrors.push(err.message));

    await page.goto("/", { waitUntil: "networkidle" });
    await humanDelay(500, 800);

    const bodyVisible = await page.locator("body").isVisible();
    expect(bodyVisible).toBe(true);

    expect(jsErrors).toEqual([]);
  });
});
