import js from '@eslint/js';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'type',
            'builtin',
            'external',
            'internal',
            'parent',
            ['sibling', 'index'],
          ],
          'newlines-between': 'always-and-inside-groups',
        },
      ],
    },
    settings: {
      'import/internal-regex': '^@/',
      'import/ignore': ['node_modules/'],
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: [
            'tsconfig.json',
            'tsconfig.*.json',
            'packages/*/tsconfig.json',
            'packages/*/tsconfig.*.json',
          ],
        },
      },
    },
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs}'],
    ...js.configs.recommended,
  },
  ...tsEslint.config({
    files: ['**/*.{ts,tsx,cts,mts}'],
    extends: [
      js.configs.recommended,
      tsEslint.configs.strictTypeChecked,
      tsEslint.configs.stylisticTypeChecked,
    ],
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-extraneous-class': [
        'error',
        { allowWithDecorator: true },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  }),
  {
    files: ['**/*.{jsx,tsx}'],
    ...reactRefreshPlugin.configs.recommended,
  },
  {
    files: ['**/*.{jsx,tsx}'],
    ...reactPlugin.configs.flat.recommended,
  },
  {
    files: ['**/*.{jsx,tsx}'],
    ...reactPlugin.configs.flat['jsx-runtime'],
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: reactHooksPlugin.configs.recommended.rules,
  },
  {
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    ...importPlugin.flatConfigs.recommended,
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    ...importPlugin.flatConfigs.typescript,
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    rules: {
      ...prettierConfig.rules,
    },
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];
