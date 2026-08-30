// 'tools-config/eslint' 的类型声明：flat config 数组（与 index.mjs 的
// /** @type {import('eslint').Linter.Config[]} */ 同构）。不依赖 eslint
// 类型包（保持本包零类型依赖），元素形状放宽为可索引记录——消费方的
// 典型用法（.filter / 展开进自己的数组）只需要这一层精度。
declare const config: ReadonlyArray<Record<string, unknown>>;

export default config;
