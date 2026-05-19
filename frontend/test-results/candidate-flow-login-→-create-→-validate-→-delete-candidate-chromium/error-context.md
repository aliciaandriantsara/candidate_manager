# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: candidate-flow.spec.ts >> login → create → validate → delete candidate
- Location: e2e/candidate-flow.spec.ts:5:1

# Error details

```
Error: locator.fill: Error: strict mode violation: getByLabel('Nom') resolved to 2 elements:
    1) <input id="firstName" name="firstName"/> aka getByRole('textbox', { name: 'Prénom' })
    2) <input id="lastName" name="lastName"/> aka getByRole('textbox', { name: 'Nom', exact: true })

Call log:
  - waiting for getByLabel('Nom')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - status [ref=e8]: Connexion réussie
  - generic [ref=e9]:
    - banner [ref=e10]:
      - navigation [ref=e11]:
        - link "Candidats" [ref=e12] [cursor=pointer]:
          - /url: /candidates
        - link "Nouveau" [ref=e13] [cursor=pointer]:
          - /url: /candidates/new
        - button "Déconnexion" [ref=e14] [cursor=pointer]
    - generic [ref=e15]:
      - heading "Nouveau candidat" [level=1] [ref=e16]
      - generic [ref=e17]:
        - generic [ref=e18]:
          - generic [ref=e19]: Prénom
          - textbox "Prénom" [active] [ref=e20]: E2E
        - generic [ref=e21]:
          - generic [ref=e22]: Nom
          - textbox "Nom" [ref=e23]
        - generic [ref=e24]:
          - generic [ref=e25]: E-mail
          - textbox "E-mail" [ref=e26]
        - generic [ref=e27]:
          - generic [ref=e28]: Téléphone
          - textbox "Téléphone" [ref=e29]
        - button "Créer" [ref=e30] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const uniqueEmail = `e2e-${Date.now()}@example.com`;
  4  | 
  5  | test('login → create → validate → delete candidate', async ({ page }) => {
  6  |   await page.goto('/login');
  7  |   await page.getByLabel('E-mail').fill('admin@example.com');
  8  |   await page.getByLabel('Mot de passe').fill('Admin123!');
  9  |   await page.getByRole('button', { name: 'Se connecter' }).click();
  10 |   await expect(page).toHaveURL(/\/candidates/);
  11 | 
  12 |   await page.getByRole('link', { name: 'Nouveau' }).click();
  13 |   await page.getByLabel('Prénom').fill('E2E');
> 14 |   await page.getByLabel('Nom').fill('Test');
     |                                ^ Error: locator.fill: Error: strict mode violation: getByLabel('Nom') resolved to 2 elements:
  15 |   await page.getByLabel('E-mail').fill(uniqueEmail);
  16 |   await page.getByLabel('Téléphone').fill('+33699999999');
  17 |   await page.getByRole('button', { name: 'Créer' }).click();
  18 | 
  19 |   await expect(page.getByRole('heading', { name: 'E2E Test' })).toBeVisible();
  20 | 
  21 |   await page.getByRole('button', { name: 'Valider' }).click();
  22 |   await expect(page.getByText('validated')).toBeVisible();
  23 | 
  24 |   await page.getByRole('button', { name: 'Supprimer' }).click();
  25 |   await expect(page).toHaveURL(/\/candidates$/);
  26 | });
  27 | 
```