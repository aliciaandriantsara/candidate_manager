import * as matchers from '@testing-library/jest-dom/matchers';
import { expect, afterAll, afterEach, beforeAll } from 'vitest';
import 'vitest-axe/extend-expect';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

expect.extend(matchers);

export const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
