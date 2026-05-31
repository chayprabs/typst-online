import { expect, test } from "@playwright/test";

test("compile button triggers worker", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Compile/i }).click();
  await expect(
    page.locator("canvas").or(page.getByText(/diagnostics|failed|Compiling|preview/i).first()),
  ).toBeVisible({ timeout: 45000 });
});

test("faq and legal pages load", async ({ page }) => {
  await page.goto("/faq");
  await expect(page.getByRole("heading", { name: /Frequently Asked Questions/i })).toBeVisible();
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /Privacy Policy/i })).toBeVisible();
});

test("template fork route loads playground", async ({ page }) => {
  await page.goto("/t/resume-modern");
  await expect(page.getByText(/resume-modern/i)).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole("button", { name: /Compile/i })).toBeVisible();
});
