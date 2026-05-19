import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';

describe('Accessibility', () => {
  it('LoginPage has no a11y violations', async () => {
    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
