# Tools config

## Usage

```
pnpm add -D eslint prettier typescript tools-config
```

## Config files

### `eslint.config.js` or `eslint.config.mjs`

```js
export default from 'tools-config/eslint';
```

### `.prettierrc`

```json
"tools-config/prettier"
```

### `tsconfig.json`

```json
{
  "extends": "tools-config/typescript",
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