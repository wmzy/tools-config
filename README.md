# Tools config

## Usage

```
pnpm add -D eslint prettier typescript dev-config
```

## Config files

### `eslint.config.js` or `eslint.config.mjs`

```js
export default from 'dev-config/eslint';
```

### `.prettierrc`

```json
"dev-config/prettier"
```

### `tsconfig.json`

```json
{
  "extends": "dev-config/typescript",
  "compilerOptions": {
    "composite": true,
    /* Paths alias */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}

```