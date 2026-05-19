import { test, expect } from '@playwright/test';

test('login → create → validate → delete candidate', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Email').fill('admin@example.com');
  await page.getByLabel('Mot de passe').fill('Admin123!');
  await page.getByRole('button', { name: 'Connexion' }).click();

  const uniqueEmail = `e2e-${Date.now()}@test.com`;
  await page.getByRole('link', { name: 'Nouveau' }).click();
  await page.getByLabel('Prénom').fill('E2E');
  await page.getByLabel('Nom', { exact: true }).fill('Test');
  await page.getByLabel('E-mail').fill(uniqueEmail);
  await page.getByLabel('Téléphone').fill('+33699999999');
  await page.getByRole('button', { name: 'Créer' }).click();

  await page.getByRole('button', { name: 'Valider' }).click();
  await page.waitForTimeout(3000);

  await page.getByRole('button', { name: 'Supprimer' }).click();
  await expect(page.getByText('E2E')).not.toBeVisible();
});
