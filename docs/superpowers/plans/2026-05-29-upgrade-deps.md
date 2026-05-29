# Upgrade tools-config Dependencies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade all dependencies to latest versions (ESLint 10, TypeScript 6, etc.) and fix known config issues.

**Architecture:** Single-pass upgrade of package.json + config files. No build step needed — configs are distributed as-is. `eslint-plugin-import` replaced with `eslint-plugin-import-x` (ESLint 10 compatible fork with identical API, different rule prefix `import-x/` instead of `import/`).

**Tech Stack:** ESLint 10 flat config, TypeScript 6, pnpm 9, Node 22

---

### Task 1: Update package.json dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update dependencies versions**

Replace the `dependencies` section in `package.json` with:

```json
"dependencies": {
  "@eslint/js": "^10.0.1",
  "eslint-config-prettier": "^10.1.8",
  "eslint-import-resolver-typescript": "^4.4.4",
  "eslint-plugin-import-x": "^4.16.2",
  "eslint-plugin-react": "^7.37.5",
  "eslint-plugin-react-hooks": "^7.1.1",
  "eslint-plugin-react-refresh": "^0.5.2",
  "globals": "^17.6.0",
  "stylelint-prettier": "^5.0.3",
  "typescript-eslint": "^8.60.0"
}
```

Key changes: `eslint-plugin-import` removed, `eslint-plugin-import-x` added. All other deps bumped to latest major/minor.

- [ ] **Step 2: Update devDependencies**

Replace the `devDependencies` section with:

```json
"devDependencies": {
  "eslint": "^10.4.0",
  "typescript": "^6.0.3"
}
```

Key changes: `@types/eslint` removed (ESLint 10 ships its own types). `eslint` and `typescript` bumped.

- [ ] **Step 3: Add peerDependencies and peerDependenciesMeta**

Add these two new top-level fields to `package.json`:

```json
"peerDependencies": {
  "eslint": "^10.0.0",
  "prettier": "^3.0.0 || ^4.0.0",
  "stylelint": "^16.0.0",
  "typescript": "^5.0.0 || ^6.0.0"
},
"peerDependenciesMeta": {
  "prettier": { "optional": true },
  "stylelint": { "optional": true },
  "typescript": { "optional": true }
}
```

- [ ] **Step 4: Verify package.json is valid JSON**

Run: `node -e "require('./package.json')"`
Expected: no output (no error = valid JSON)

- [ ] **Step 5: Commit**

```bash
git add package.json
git commit -m "feat: upgrade dependencies to latest versions

- @eslint/js ^9 -> ^10, eslint-config-prettier ^9 -> ^10
- eslint-plugin-import -> eslint-plugin-import-x (ESLint 10 compat)
- eslint-plugin-react-hooks ^5 -> ^7, react-refresh ^0.4 -> ^0.5
- globals ^15 -> ^17, typescript-eslint ^8.18 -> ^8.60
- typescript ^5.9 -> ^6.0, eslint ^10.0 -> ^10.4
- Remove @types/eslint (ESLint 10 ships own types)
- Add peerDependencies for eslint, prettier, stylelint, typescript"
```

---

### Task 2: Update ESLint config

**Files:**
- Modify: `config/eslint/index.mjs`

- [ ] **Step 1: Replace eslint-plugin-import with eslint-plugin-import-x**

Change line 7:
```diff
- import importPlugin from 'eslint-plugin-import';
+ import importPlugin from 'eslint-plugin-import-x';
```

- [ ] **Step 2: Update rule prefix from import/ to import-x/**

In the first config block (lines 15-16), change:
```diff
- 'import/order': [
+ 'import-x/order': [
```

- [ ] **Step 3: Update settings prefix from import/ to import-x/**

In the settings block (lines 31-34), change:
```diff
- 'import/internal-regex': '^@/',
- 'import/ignore': ['node_modules/'],
- 'import/resolver': {
+ 'import-x/internal-regex': '^@/',
+ 'import-x/ignore': ['node_modules/'],
+ 'import-x/resolver': {
```

- [ ] **Step 4: Update eslint-config-prettier import for v10**

Change line 8:
```diff
- import prettierConfig from 'eslint-config-prettier';
+ import prettierConfig from 'eslint-config-prettier/flat';
```

- [ ] **Step 5: Update react-hooks config for v7 flat config API**

Replace lines 91-96 (the react-hooks config block):
```diff
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
-   plugins: {
-     'react-hooks': reactHooksPlugin,
-   },
-   rules: reactHooksPlugin.configs.recommended.rules,
+   ...reactHooksPlugin.configs.flat['recommended-latest'],
  },
```

- [ ] **Step 6: Remove deprecated @typescript-eslint/interface-name-prefix rule**

Remove line 58:
```diff
- '@typescript-eslint/interface-name-prefix': 'off',
```

- [ ] **Step 7: Update import plugin flatConfigs references**

Change lines 108-113 (the import plugin recommended and typescript configs):
```diff
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
-   ...importPlugin.flatConfigs.recommended,
+   ...importPlugin.flatConfigs.recommended,
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
-   ...importPlugin.flatConfigs.typescript,
+   ...importPlugin.flatConfigs.typescript,
  },
```

Note: The property names `flatConfigs.recommended` and `flatConfigs.typescript` are the same in both plugins — no code change needed here. The actual config content changes because the plugin is different.

- [ ] **Step 8: Commit**

```bash
git add config/eslint/index.mjs
git commit -m "feat: update ESLint config for v10 compatibility

- Replace eslint-plugin-import with eslint-plugin-import-x
- Update rule prefix import/ -> import-x/
- Update settings prefix import/ -> import-x/
- Use eslint-config-prettier/flat for v10
- Use react-hooks flat config API for v7
- Remove deprecated @typescript-eslint/interface-name-prefix rule"
```

---

### Task 3: Fix Stylelint config

**Files:**
- Modify: `config/stylelint/index.js`

- [ ] **Step 1: Merge duplicate rules keys**

Replace the entire file content with:

```js
/** @type {import('stylelint').Config} */
module.exports = {
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': true,
    'block-no-empty': true,
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add config/stylelint/index.js
git commit -m "fix: merge duplicate rules keys in stylelint config

The first rules block (prettier/prettier) was silently overwritten
by the second rules block (block-no-empty) due to duplicate keys."
```

---

### Task 4: Update lockfile and verify

**Files:**
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Install dependencies**

Run: `pnpm install`
Expected: Install completes. May show peer dependency warnings for `eslint-plugin-react` (its peerDep declares only up to eslint ^9.7 but works with v10).

- [ ] **Step 2: Verify ESLint config parses correctly**

Run: `node -e "import('./config/eslint/index.mjs').then(m => console.log('ESLint config OK, entries:', m.default.length))"`
Expected: `ESLint config OK, entries: <number>` (no import errors)

- [ ] **Step 3: Verify Stylelint config parses correctly**

Run: `node -e "const c = require('./config/stylelint/index.js'); console.log('Stylelint config OK, rules:', Object.keys(c.rules))"`
Expected: `Stylelint config OK, rules: [ 'prettier/prettier', 'block-no-empty' ]`

- [ ] **Step 4: Commit lockfile**

```bash
git add pnpm-lock.yaml
git commit -m "chore: update pnpm lockfile"
```

---

### Task 5: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Update Key Details section**

Replace the "Key Details" section with:

```markdown
## Key Details

- **Package manager:** pnpm (v9 in CI)
- **Node version:** 22 (CI)
- **Release:** semantic-release on push to `main` — publish is triggered by changes to `config/**`, `package.json`, or the release workflow
- **ESLint config:** flat-config format (ESLint v10), uses `typescript-eslint` strict+stylistic, prefers `type` over `interface` (`consistent-type-definitions`), enforces `import-x/order` with group ordering
- **Commit convention:** semantic-release requires Conventional Commits (`feat:`, `fix:`, etc.)
- **Peer dependencies:** `eslint` (required), `prettier`, `stylelint`, `typescript` (all optional)
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with upgraded dependency info"
```
