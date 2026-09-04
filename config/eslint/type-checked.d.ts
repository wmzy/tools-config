import type { Linter } from 'eslint';

// tools-config/eslint/type-checked 与默认入口同构：flat config 数组。
declare const config: Linter.Config[];

export default config;
