#!/usr/bin/env bash
# tools-config 的 smoke 套件：验证四个导出入口在消费方场景下真实可用。
# 每个工具的「pass 期望退出 0 / fail 期望退出非 0」都做断言，
# 防止配置改动悄悄失效（CI 曾只有 echo OK）。
set -euo pipefail

cd "$(dirname "$0")/.."
# 把仓库根 node_modules/.bin 放进 PATH，保证子 shell cd 到 fixture 目录后
# 仍能解析到 eslint / prettier / stylelint / tsc。
export PATH="$(pwd)/node_modules/.bin:$PATH"

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

# --- ESLint：默认入口（非 type-aware），经仓库根 eslint.config.mjs 自检 ---
eslint config fixtures/eslint/base/pass.js fixtures/eslint/base/pass.ts \
  fixtures/eslint/base/pass.tsx ||
  fail 'eslint base pass'

if eslint fixtures/eslint/base/fail.js >/dev/null 2>&1; then
  fail 'eslint base should reject fail.js'
fi

# --- ESLint：type-checked 入口（projectService 定位 fixture 内 tsconfig） ---
(
  cd fixtures/eslint/type-checked
  eslint --config ../../../config/eslint/type-checked.mjs pass.ts ||
    fail 'eslint type-checked pass'
  if eslint --config ../../../config/eslint/type-checked.mjs fail.ts \
    >/dev/null 2>&1; then
    fail 'eslint type-checked should reject fail.ts'
  fi
)

# --- ESLint：消费方视角，按包名导入（exports map + 插件解析回归） ---
(
  cd fixtures/eslint/consumer
  eslint pass.js ||
    fail 'eslint consumer package-name import'
)

# --- Prettier：发布配置自检 + 违规文件必须被拦下 ---
prettier --check --config config/prettier.json config fixtures/prettier/pass.js \
  package.json .releaserc.json ||
  fail 'prettier check'

if prettier --check --config config/prettier.json \
  fixtures/prettier/unformatted.js >/dev/null 2>&1; then
  fail 'prettier should reject unformatted.js'
fi

# --- Stylelint：发布配置（ESM）可用 + 空块必须被拦下 ---
stylelint --config config/stylelint/index.mjs fixtures/stylelint/pass.css ||
  fail 'stylelint pass'

if stylelint --config config/stylelint/index.mjs fixtures/stylelint/fail.css \
  >/dev/null 2>&1; then
  fail 'stylelint should reject fail.css'
fi

# --- Stylelint：消费方视角，extends 包名（exports map 回归） ---
(
  cd fixtures/stylelint/consumer
  stylelint pass.css ||
    fail 'stylelint consumer extends package name'
)

# --- TypeScript：消费方视角 extends 发布配置，默认零产物 ---
# 不带 --noEmit：验证 base 的 noEmit 默认值本身生效，
# 防止裸跑 tsc 把 JS 吐进 src/ 被误提交。
(
  cd fixtures/tsconfig
  rm -f src/index.js src/index.js.map src/index.d.ts
  tsc -p tsconfig.json ||
    fail 'tsconfig extends/compile'
  if [ -e src/index.js ] || [ -e src/index.d.ts ]; then
    fail 'tsconfig should not emit into src by default'
  fi
)

echo 'smoke OK'
