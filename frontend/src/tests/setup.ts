import '@testing-library/jest-dom';
import 'vitest-axe/extend-expect';
import { afterAll, afterEach, beforeAll, expect } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

expect; // ensure vitest expect is globally available

export const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
