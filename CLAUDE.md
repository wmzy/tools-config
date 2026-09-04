# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`tools-config` is a shared configuration package that bundles opinionated configs for ESLint, Prettier, Stylelint, and TypeScript. Consuming projects install it and extend from it rather than maintaining their own configs.

## Commands

- **Install dependencies:** `pnpm install`
- **Test:** `pnpm test` — `scripts/smoke.sh` 以消费方视角验证四个入口（ESLint pass/fail 断言、Prettier/Stylelint 自检与拦截、tsconfig extends 编译）
- **No build step** — config files in `config/` are distributed as-is

## Architecture

All distributable configs live in `config/`. The package exposes five entry points via `exports` in `package.json`:

| Import path                     | File                             |
| ------------------------------- | -------------------------------- |
| `tools-config/eslint`           | `config/eslint/index.mjs`        |
| `tools-config/eslint/type-checked` | `config/eslint/type-checked.mjs` |
| `tools-config/stylelint`        | `config/stylelint/index.mjs`     |
| `tools-config/prettier`         | `config/prettier.json`           |
| `tools-config/typescript`       | `config/typescript/tsconfig.json`|

## Key Details

- **Package manager:** pnpm 11.22（`packageManager` 字段统一，CI 用 `--frozen-lockfile`）
- **Node version:** 22 (CI)；`engines`: `^20.19.0 || ^22.13.0 || >=24`（对齐 eslint 10）
- **Release:** semantic-release on push to `main` — publish is triggered by changes to `config/**`, `package.json`, or the release workflow
- **ESLint config:** flat-config format (ESLint v10), uses `typescript-eslint` strict+stylistic, prefers `type` over `interface` (`consistent-type-definitions`), enforces `import-x/order` with group ordering. 默认入口非 type-aware；type-aware 规则在 `tools-config/eslint/type-checked`（`projectService`）。TS 共享规则在 `config/eslint/parts.mjs`
- **Commit convention:** semantic-release requires Conventional Commits (`feat:`, `fix:`, etc.)
- **Peer dependencies:** `eslint` (required), `prettier`, `stylelint`, `typescript` (all optional)
