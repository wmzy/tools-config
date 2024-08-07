import { fixupPluginRules } from '@eslint/compat';
import js from '@eslint/js';
import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';

const fixedReactHooksPlugin = fixupPluginRules(reactHooksPlugin);
const fixedImportPlugin = fixupPluginRules(importPlugin);

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/internal-regex': '^@/',
      'import/ignore': ['node_modules/'],
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
          project: [
            'tsconfig.json',
            'tsconfig.*.json',
            'packages/*/tsconfig.json',
            'packages/*/tsconfig.*.json',
          ],

          // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default

          // use <root>/path/to/folder/tsconfig.json
          // "project": "path/to/folder",

          // Multiple tsconfigs (Useful for monorepos)

          // use a glob pattern
          // "project": "packages/*/tsconfig.json",

          // use an array
          // "project": [
          //   "packages/module-a/tsconfig.json",
          //   "packages/module-b/tsconfig.json"
          // ],

          // use an array of glob patterns
          // "project": [
          //   "packages/*/tsconfig.json",
          //   "other-packages/*/tsconfig.json"
          // ]
        },
      },
    },
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs}'],
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.{ts,tsx,cts,mts}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
      },
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': fixedReactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...fixedReactHooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/no-unknown-property': 'off',
      'react/prop-types': 'off',
    },
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        jsxPragma: null, // for @typescript/eslint-parser
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    plugins: {
      import: fixedImportPlugin,
    },
    rules: {
      ...fixedImportPlugin.configs.recommended.rules,
      ...fixedImportPlugin.configs.typescript.rules,
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
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    settings: {
      ...fixedImportPlugin.configs.typescript.settings,
    },
  },
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    rules: {
      ...prettierConfig.rules,
    },
  },
];
