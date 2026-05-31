import { expect, test } from "@playwright/test";

test("compile button produces preview or diagnostics", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Compile/i }).click();
  await expect(page.locator("canvas, .text-red-800, text=Rendering preview")).toBeVisible({
    timeout: 30000,
  });
});

test("faq and legal pages load", async ({ page }) => {
  await page.goto("/faq");
  await expect(page.getByRole("heading", { name: /FAQ/i })).toBeVisible();
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: /Privacy/i })).toBeVisible();
});

test("template fork route loads playground", async ({ page }) => {
  await page.goto("/t/resume-modern");
  await expect(page.getByText(/resume-modern/i)).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole("button", { name: /Compile/i })).toBeVisible();
});
