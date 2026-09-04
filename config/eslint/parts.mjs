import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tsEslint from 'typescript-eslint';

const files = ['**/*.{ts,tsx,cts,mts}'];

/**
 * 两个 TS 入口共享的规则覆盖。
 * 注意：这里不能放 type-aware 规则（会要求 parserOptions.project，
 * 导致默认入口在无 tsconfig 的项目里运行时崩溃）。
 */
const tsRules = {
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-unused-vars': 'warn',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/prefer-nullish-coalescing': 'off',
  '@typescript-eslint/no-extraneous-class': [
    'error',
    { allowWithDecorator: true },
  ],
  '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
  '@typescript-eslint/no-invalid-void-type': 'off',
};

/** tools-config/eslint 默认入口：非 type-aware，消费方无需 tsconfig。 */
export const baseTsConfig = defineConfig({
  files,
  extends: [
    js.configs.recommended,
    tsEslint.configs.strict,
    tsEslint.configs.stylistic,
  ],
  rules: tsRules,
});

/**
 * tools-config/eslint/type-checked 入口：type-aware，
 * 通过 projectService 自动定位 tsconfig.json。
 */
export const typeCheckedTsConfig = defineConfig({
  files,
  extends: [
    js.configs.recommended,
    tsEslint.configs.strictTypeChecked,
    tsEslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
    },
  },
  rules: {
    ...tsRules,
    // type-aware 规则只能在有类型信息时启用/覆盖
    '@typescript-eslint/no-confusing-void-expression': 'off',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      { allowNumber: true },
    ],
  },
});
