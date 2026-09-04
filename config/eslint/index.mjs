import js from '@eslint/js';
import globals from 'globals';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import-x';
import prettierConfig from 'eslint-config-prettier/flat';

import { baseTsConfig } from './parts.mjs';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,jsx,cjs,mjs,ts,tsx,cts,mts}'],
    rules: {
      'import-x/order': [
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
      'import-x/internal-regex': '^@/',
      // 跳过 node_modules 内文件的 ExportMap 解析：
      // 既省性能，也避免对外部包的文档化 default+member 写法（如
      // tseslint.configs.*、importX.flatConfigs.*）产生
      // no-named-as-default-member 噪音。删除会立刻在自检中被抓到。
      'import-x/ignore': ['node_modules/'],
      'import-x/resolver': {
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
  ...baseTsConfig,
  // eslint-plugin-react 尚不支持 ESLint 10（见 README「已知限制」），
  // 上游修复前暂不启用其规则；仅保留 hooks / refresh。
  {
    files: ['**/*.{jsx,tsx}'],
    ...reactRefreshPlugin.configs.recommended,
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    ...reactHooksPlugin.configs.flat['recommended-latest'],
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
];
