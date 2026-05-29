# 升级 tools-config 依赖至最新版本

## 概述

将 tools-config 的所有依赖升级到最新版本，包括 ESLint 10、TypeScript 6，并修复已知配置问题。

## 当前状态 vs 目标

### dependencies

| 包 | 当前 | 目标 | 说明 |
|---|------|------|------|
| `@eslint/js` | ^9.17.0 | ^10.0.1 | major |
| `eslint-config-prettier` | ^9.1.0 | ^10.1.8 | major |
| `eslint-import-resolver-typescript` | ^3.7.0 | ^4.4.4 | major |
| `eslint-plugin-import` | ^2.31.0 | 移除 | 不支持 ESLint 10 |
| `eslint-plugin-import-x` | — | 新增 ^4.16.2 | 替代 import 插件 |
| `eslint-plugin-react-hooks` | ^5.1.0 | ^7.1.1 | major |
| `eslint-plugin-react-refresh` | ^0.4.16 | ^0.5.2 | major |
| `eslint-plugin-react` | ^7.37.3 | ^7.37.5 | patch |
| `globals` | ^15.14.0 | ^17.6.0 | major |
| `stylelint-prettier` | ^5.0.2 | ^5.0.3 | patch |
| `typescript-eslint` | ^8.18.2 | ^8.60.0 | minor |

### devDependencies

| 包 | 当前 | 目标 |
|---|------|------|
| `eslint` | ^10.0.3 | ^10.4.0 |
| `typescript` | ^5.9.3 | ^6.0.3 |
| `@types/eslint` | ^9.6.1 | 移除（ESLint 10 自带类型） |

### peerDependencies（新增）

```json
{
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
}
```

## 配置文件变更

### config/eslint/index.mjs

1. **替换 import 插件：** `eslint-plugin-import` → `eslint-plugin-import-x`
   - `import importPlugin from 'eslint-plugin-import'` → `import importPlugin from 'eslint-plugin-import-x'`
   - API 兼容，`flatConfigs.recommended` 和 `flatConfigs.typescript` 保持不变

2. **适配 eslint-plugin-react-hooks v7：**
   - `reactHooksPlugin.configs.recommended.rules` → `reactHooksPlugin.configs['recommended-latest']`

3. **适配 eslint-config-prettier v10：**
   - `import prettierConfig from 'eslint-config-prettier'` → `import prettierConfig from 'eslint-config-prettier/flat'`

4. **清理废弃规则：** 移除 `@typescript-eslint/interface-name-prefix`（已不存在于新版 typescript-eslint）

### config/stylelint/index.js

合并重复的 `rules` 键，修复 `prettier/prettier` 规则被覆盖的 bug。

### config/typescript/tsconfig.json

无需修改。已显式设置 `target: ESNEXT` 和 `module: ESNext`，TypeScript 6 的默认值变更不影响。

### CLAUDE.md

更新依赖版本信息。

## 实施步骤

1. 更新 `package.json`（dependencies、devDependencies、peerDependencies、peerDependenciesMeta）
2. 更新 `config/eslint/index.mjs`（4 项变更）
3. 更新 `config/stylelint/index.js`（合并 rules）
4. 更新 `CLAUDE.md`
5. 运行 `pnpm install` 更新 lockfile
6. 验证配置文件语法正确

## 风险

- `eslint-plugin-react@7` 的 peerDependencies 声明只到 `eslint ^9.7`，实际在 ESLint 10 下可工作但会产生 peerDep 警告
- TypeScript 6 可能引入类型检查行为变更，影响消费项目的类型检查结果
