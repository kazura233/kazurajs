# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

KazuraJS is a pnpm monorepo of independently published `@kazura/*` JavaScript/TypeScript utility libraries (web, React, Node.js, NestJS, and build tooling). Each library under `packages/*` is its own npm package with its own version and `dist` output.

Requires Node `>=22.20.0` and pnpm (`packageManager` pins the version).

## Commands

Run from the repo root:

- `pnpm build:komekko` — build the `komekko` build tool first (see below for why order matters)
- `pnpm build:all` — full pipeline: build komekko, reinstall, then build every package
- `pnpm clean:all` — run `clean` (rimraf dist) across all packages
- `pnpm docs:build` — build the Docusaurus site in `docs/`
- `pnpm upi` — install through the local proxy (`use-proxy-install`)

Per-package (run inside `packages/<name>/`):

- `pnpm build` — `rimraf dist && komekko`
- `pnpm build:debug` — same with `DEBUG=komekko:*` for verbose build logging

There is no test runner or linter wired into the packages; do not assume `pnpm test`/`pnpm lint` exist. `docs/` uses `tsc` via `pnpm -C docs typecheck`.

## Build system: komekko

`komekko` (in [packages/komekko/](packages/komekko/)) is the in-repo build tool that every package uses. It wraps Rollup + esbuild and supports ESM/CJS/UMD/IIFE output, `.d.ts` generation, minification, sourcemaps, and code obfuscation.

Two things follow from komekko being both the tool and a package in the workspace:

1. **Build order matters.** komekko must be compiled before any package that depends on it. `pnpm build:all` handles this by building komekko, reinstalling (to relink the workspace binary), then building the rest. When building a single package fails with a missing komekko binary, run `pnpm build:komekko` first.
2. **komekko bootstraps itself** via `jiti ./src/cli` (runs its own TypeScript source) rather than calling the built binary.

How a package build resolves its entries (see [packages/komekko/src/builder/rollup.ts](packages/komekko/src/builder/rollup.ts)):

- komekko reads `komekko.config.ts` (if present) and the package's `package.json`.
- **If `komekko.config.ts` defines `entries`, those are used as-is.** Otherwise komekko *infers* entries from the `exports`/`main` fields of `package.json` by mapping each output path (e.g. `./dist/date/index.mjs`) back to a source file (`src/date/index.ts`).
- This means for most packages, adding a new entry point is done by adding an `exports` subpath in `package.json` and a matching `src/` file — no config change needed.
- `komekko.config.ts` is only needed for non-default output (e.g. UMD builds with a global name/`outDir`). `defineConfig` accepts either a single options object or an array of configs to run multiple builds (see [packages/web-storage/komekko.config.ts](packages/web-storage/komekko.config.ts), which emits a UMD `.js` and a minified `.min.js`).

## Package conventions

- Source lives in `src/`, build output in `dist/` (git-ignored, generated).
- Packages expose `exports` with `require`/`import`/`types` conditions pointing at `dist/*.cjs`, `dist/*.mjs`, `dist/*.d.ts`.
- `@kazura/common` and `@kazura/di` are internal-support packages consumed by others.
- Cross-package deps use `workspace:*` (for the komekko dev tool) or pinned/ranged versions.

## Workspace layout

`pnpm-workspace.yaml` includes `packages/*`, the Docusaurus site `docs/`, several `*/example` apps (`web-broadcast`, `react-mobx`, `react-store`), and `packages/build-test/*` (throwaway Vite/Rollup/Node harnesses for validating built output — not published).

Documentation is authored in `docs/` (Docusaurus) and published to https://kazura233.github.io/kazurajs.

Responses, and any spec/design/requirements docs, should be written in Chinese when possible (the project's docs and commit messages are in Chinese).
