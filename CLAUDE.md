# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`tools-config` is a shared configuration package that bundles opinionated configs for ESLint, Prettier, Stylelint, and TypeScript. Consuming projects install it and extend from it rather than maintaining their own configs.

## Commands

- **Install dependencies:** `pnpm install`
- **Test:** `pnpm test` (currently a no-op placeholder)
- **No build step** — config files in `config/` are distributed as-is

## Architecture

All distributable configs live in `config/`. The package exposes four entry points via `exports` in `package.json`:

| Import path              | File                            |
| ------------------------ | ------------------------------- |
| `tools-config/eslint`    | `config/eslint/index.mjs`       |
| `tools-config/stylelint` | `config/stylelint/index.js`     |
| `tools-config/prettier`  | `config/prettier.json`          |
| `tools-config/typescript`| `config/typescript/tsconfig.json`|

## Key Details

- **Package manager:** pnpm (v9 in CI)
- **Node version:** 22 (CI)
- **Release:** semantic-release on push to `main` — publish is triggered by changes to `config/**`, `package.json`, or the release workflow
- **ESLint config:** flat-config format (ESLint v10), uses `typescript-eslint` strict+stylistic, prefers `type` over `interface` (`consistent-type-definitions`), enforces `import-x/order` with group ordering
- **Commit convention:** semantic-release requires Conventional Commits (`feat:`, `fix:`, etc.)
- **Peer dependencies:** `eslint` (required), `prettier`, `stylelint`, `typescript` (all optional)
