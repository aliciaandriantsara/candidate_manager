import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

const nodeGlobals = { process:"readonly", __dirname:"readonly", __filename:"readonly", console:"readonly", Buffer:"readonly", setTimeout:"readonly", clearTimeout:"readonly" };
const testGlobals = { describe:"readonly", it:"readonly", test:"readonly", expect:"readonly", beforeAll:"readonly", afterAll:"readonly", beforeEach:"readonly", afterEach:"readonly", jest:"readonly" };

export default [
  js.configs.recommended,
  { files: ["src/**/*.ts"], languageOptions: { parser: tsparser, parserOptions: { ecmaVersion: 2022 }, globals: nodeGlobals }, plugins: { "@typescript-eslint": tseslint }, rules: { ...tseslint.configs.recommended.rules, "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }] } },
  { files: ["tests/**/*.ts"], languageOptions: { parser: tsparser, parserOptions: { ecmaVersion: 2022 }, globals: { ...nodeGlobals, ...testGlobals } }, plugins: { "@typescript-eslint": tseslint }, rules: { ...tseslint.configs.recommended.rules, "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }] } },
];
