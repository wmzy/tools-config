# Tools config

ESLint（flat config）、Prettier、Stylelint、TypeScript 的共享配置包。

## 安装

```
pnpm add -D eslint prettier stylelint typescript tools-config
```

`prettier`、`stylelint`、`typescript` 均为可选 peer 依赖，用到哪个入口装哪个。`eslint` 为必选 peer 依赖。

## ESLint

默认入口：非 type-aware 规则，无需 tsconfig 即可 lint，适合任意 JS/TS 项目。

```js
// eslint.config.mjs
import config from 'tools-config/eslint';

export default config;
```

如需基于类型信息的规则（`no-unsafe-*` 等）：

```js
// eslint.config.mjs
import config from 'tools-config/eslint/type-checked';

export default config;
```

type-checked 入口通过 `projectService` 自动定位项目中的 `tsconfig.json`。未被任何 tsconfig 覆盖的文件会直接报错——只适合完整纳入 tsconfig 的 TS 项目。

### React 插件现状

`eslint-plugin-react` 因尚不支持 ESLint 10（peer 上限 `^9.7`，且 `settings.react.version: 'detect'` 会触发上游崩溃）暂未启用，待上游发布兼容版本后恢复。

仍随包提供 `eslint-plugin-react-hooks` 与 `eslint-plugin-react-refresh`（官方均已支持 ESLint 10）。它们和将来恢复的 react 插件一样必须是硬依赖：flat config 的插件必须能从本包位置解析，pnpm 严格 node_modules 下 peer 依赖不可见。这些规则只作用于 `jsx/tsx` 文件，不影响非 React 代码的 lint 结果。

## Prettier

```json
// .prettierrc
"tools-config/prettier"
```

## Stylelint

```js
// stylelint.config.mjs
export default {
  extends: ['tools-config/stylelint'],
};
```

设计意图是极简：只启用 `prettier/prettier`（与 Prettier 保持一致的格式）和 `block-no-empty` 两条规则。风格类检查交给 Prettier 与 ESLint，Stylelint 不重复造轮子。如需标准 CSS 规则集，可在项目配置中自行 `extends: ['stylelint-config-standard', 'tools-config/stylelint']`。

## TypeScript

```json
// tsconfig.json
{
  "extends": "tools-config/typescript",
  "compilerOptions": {
    "outDir": "dist",
    "declaration": true
  },
  "include": ["src"]
}
```

基础配置只含环境无关的编译选项（`strict`、`moduleResolution: bundler` 等）。构建相关选项（`outDir`、`declaration`、`sourceMap` 等）由各项目自行声明——共享 base config 硬编码 `outDir` 会导致产物写进 `node_modules`（`${configDir}` 指向配置所在目录）。

## 开发

```
pnpm test
```

`scripts/smoke.sh` 以消费方视角验证四个入口：ESLint 默认/type-checked 入口对 pass/fail 样本分别断言、Prettier 与 Stylelint 对发布配置自检并拦截违规样本、TypeScript 以 `extends` 方式真实编译。CI 同时跑 `--frozen-lockfile` 安装，锁文件漂移会直接失败。
