import { test, expect } from '@playwright/test';

const uniqueEmail = `e2e-${Date.now()}@example.com`;

test('login → create → validate → delete candidate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('E-mail').fill('admin@example.com');
  await page.getByLabel('Mot de passe').fill('Admin123!');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page).toHaveURL(/\/candidates/);

  await page.getByRole('link', { name: 'Nouveau' }).click();
  await page.getByLabel('Prénom').fill('E2E');
  await page.getByLabel('Nom').fill('Test');
  await page.getByLabel('E-mail').fill(uniqueEmail);
  await page.getByLabel('Téléphone').fill('+33699999999');
  await page.getByRole('button', { name: 'Créer' }).click();

  await expect(page.getByRole('heading', { name: 'E2E Test' })).toBeVisible();

  await page.getByRole('button', { name: 'Valider' }).click();
  await expect(page.getByText('validated')).toBeVisible();

  await page.getByRole('button', { name: 'Supprimer' }).click();
  await expect(page).toHaveURL(/\/candidates$/);
});
