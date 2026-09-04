import base from './index.mjs';
import { baseTsConfig, typeCheckedTsConfig } from './parts.mjs';

/**
 * 与默认入口同构，仅将基础 TS 规则集原位替换为 type-aware 版本。
 * 依赖 projectService 定位消费方的 tsconfig.json，
 * tsconfig 未覆盖的文件会直接报错——适合纯 TS 项目。
 */

/** @type {import('eslint').Linter.Config[]} */
export default base.flatMap((entry) =>
  baseTsConfig.includes(entry) ? typeCheckedTsConfig : [entry]
);
