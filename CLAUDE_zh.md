# CLAUDE_zh.md (中文版)

> 对应 `CLAUDE.md`，修改时请保持同步。

## 概述

KazuraJS 是一个 pnpm monorepo，包含一系列独立发布的 `@kazura/*` JavaScript/TypeScript 工具库，覆盖 Web、React、Node.js、NestJS 以及构建工具。`packages/` 下每个目录都是独立的 npm 包，各自有版本号和 `dist` 输出。

运行环境要求：Node `>=22.20.0`，包管理器为 pnpm（`packageManager` 字段固定了版本）。

## 常用命令

在仓库根目录执行：

- `pnpm build:komekko` — 先构建 `komekko` 构建工具（原因见下文）
- `pnpm build:all` — 完整流水线：构建 komekko → 重新安装 → 构建所有包
- `pnpm clean:all` — 对所有包执行 `clean`（rimraf dist）
- `pnpm docs:build` — 构建 `docs/` 下的 Docusaurus 文档站
- `pnpm upi` — 通过本地代理安装依赖（`use-proxy-install`）

单包操作（进入 `packages/<name>/` 执行）：

- `pnpm build` — `rimraf dist && komekko`
- `pnpm build:debug` — 同上，加 `DEBUG=komekko:*` 输出详细构建日志

> ⚠️ 包目录没有配置 test runner 或 linter，请勿假设 `pnpm test` / `pnpm lint` 存在。`docs/` 用 `tsc` 做类型检查：`pnpm -C docs typecheck`。

## 构建系统：komekko

`komekko`（位于 [packages/komekko/](packages/komekko/)）是仓库内自建的构建工具，所有包都用它。底层基于 Rollup + esbuild，支持 ESM / CJS / UMD / IIFE 输出、`.d.ts` 类型声明生成、代码压缩、sourcemap 和代码混淆。

komekko 既是工具本身又是 workspace 里的一个包，有两点需要注意：

1. **构建顺序很重要。** komekko 必须先编译，其它依赖它的包才能正常构建。`pnpm build:all` 的流程是：先构建 komekko → 重新执行 `pnpm install`（重新链接 workspace 二进制）→ 再构建其余所有包。如果单独构建某个包报 komekko 二进制找不到，先跑 `pnpm build:komekko`。
2. **komekko 自举（bootstrap）**：通过 `jiti ./src/cli` 直接运行自身 TypeScript 源码，而非调用编译产物。

入口文件的推导逻辑（见 [packages/komekko/src/builder/rollup.ts](packages/komekko/src/builder/rollup.ts)）：

- komekko 读取包目录下的 `komekko.config.ts`（如有）和 `package.json`。
- **若 `komekko.config.ts` 显式定义了 `entries`，则直接使用；** 否则从 `package.json` 的 `exports` / `main` 字段反推出入口：把输出路径（如 `./dist/date/index.mjs`）映射回源码（`src/date/index.ts`）。
- 因此大部分包**不需要** `komekko.config.ts`，新增入口只需在 `package.json` 加 `exports` 子路径，并创建对应的 `src/` 文件。
- 只有非默认输出（如带 `name` / `outDir` 的 UMD 构建）才需要 `komekko.config.ts`。`defineConfig` 支持传单个配置对象或数组（见 [packages/web-storage/komekko.config.ts](packages/web-storage/komekko.config.ts)，它同时输出 UMD `.js` 和压缩版 `.min.js`）。

## 包的约定

- 源码在 `src/`，构建产物在 `dist/`（已 gitignore，构建时生成）。
- 每个包通过 `exports` 字段以 `require` / `import` / `types` 条件分别指向 `dist/*.cjs`、`dist/*.mjs`、`dist/*.d.ts`。
- `@kazura/common` 和 `@kazura/di` 是内部支撑包，被其它包消费。
- 跨包依赖使用 `workspace:*`（komekko 开发依赖）或固定版本范围。

## 工作区布局

`pnpm-workspace.yaml` 包含 `packages/*`、Docusaurus 文档站 `docs/`、若干 `*/example` 示例应用（`web-broadcast`、`react-mobx`、`react-store`），以及 `packages/build-test/*`（用于验证构建产物的 Vite/Rollup/Node 临时测试工程，不发布）。

文档在 `docs/`（Docusaurus）编写，发布地址：https://kazura233.github.io/kazurajs
