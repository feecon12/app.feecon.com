// @ts-check
import { expect, test } from "@playwright/test";
import user from "./auth-test-data.json";

//signup
test("TC1_Signup_Page_Test", async ({ page }) => {
  await page.goto("/signup");
  await page.waitForTimeout(1000);

  // Verify signup page loaded correctly
  await expect(page).toHaveURL(/signup/);
  await expect(
    page.getByRole("heading", { name: /Create Account/i })
  ).toBeVisible();

  // Fill out signup form
  await page.locator('xpath=//input[@name="username"]').fill(user.username);
  await page.waitForTimeout(500);

  await page.locator('xpath=//input[@name="email"]').fill(user.email);
  await page.waitForTimeout(500);

  await page.locator('xpath=//input[@name="phone"]').fill(user.phone);
  await page.waitForTimeout(500);

  await page.locator('xpath=//input[@name="password"]').fill(user.password);
  await page.waitForTimeout(500);

  await page
    .locator('xpath=//input[@name="confirmPassword"]')
    .fill(user.confirmPassword);
  await page.waitForTimeout(500);

  await page.locator('xpath=//select[@name="role"]').selectOption(user.role[0]);
  await page.waitForTimeout(500);

  // Submit the form
  await page.locator('xpath=//button[@type="submit"]').click();
  await page.waitForTimeout(3000);

  await page.screenshot();
  // Alternative verifications:
  await expect(page).toHaveURL(/login/); // If redirected to login
});

//login
test("TC2_Login_Page_Test", async ({ page }) => {
  await page.goto("/login");
  await page.waitForTimeout(1000);

  // Verify signup page loaded correctly
  await expect(page).toHaveURL(/login/);
  await expect(
    page.getByRole("heading", { name: /Welcome Back!/i })
  ).toBeVisible();

  await page.waitForSelector('xpath=//input[@name="email"]');

  // Fill out login form
  await page.fill('xpath=//input[@name="email"]', user.email);
  await page.waitForTimeout(500);

  await page.fill('xpath=//input[@name="password"]', user.password);
  await page.waitForTimeout(500);

  // Submit the form
  await page.click('xpath=//button[@type="submit"]');
  await page.waitForTimeout(3000);

  // verifications:
  await expect(page).toHaveURL(/\//); // If redirected to login
});
