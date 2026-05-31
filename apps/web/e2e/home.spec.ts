import { expect, test } from "@playwright/test";

test("home page loads playground", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("banner").getByText("TypstBox")).toBeVisible();
  await expect(page.getByRole("button", { name: /Compile/i })).toBeVisible();
});

test("seo routes respond", async ({ page }) => {
  for (const path of [
    "/typst-playground",
    "/typst-resume",
    "/typst-invoice",
    "/typst-paper",
    "/typst-to-pdf",
    "/privacy",
    "/terms",
  ]) {
    const res = await page.goto(path);
    expect(res?.status()).toBeLessThan(400);
  }
});
