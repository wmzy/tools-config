import type { Linter } from 'eslint';

// 与 index.mjs 的 /** @type {import('eslint').Linter.Config[]} */ 同构。
// 直接引用 eslint 类型：eslint 是 peerDependency，消费方必然装有，
// 不会为本包引入额外类型依赖。
declare const config: Linter.Config[];

export default config;
