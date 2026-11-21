# AGENTS.md — COVIL contributor instructions

This file applies to the whole repository, including AI coding agents.

## Read before editing or generating a VLG

1. [Responsibility boundaries](docs/12-responsibilities-and-developer-guide.md)
2. [Manifest contract](docs/03-manifest.md), [machine-readable schema](schemas/manifest.schema.json), [capability registry](schemas/capabilities.registry.json)
3. [VLG package format](docs/02-vlg-package.md), [runtime contract](docs/11-core-runtime-contract.md), [public API](docs/09-vlg-public-api.md)
4. [Official SDK](sdk/covil-core.mjs), [hello-vlg](examples/hello-vlg/) and [validator](tools/validate-vlg.mjs)
5. Applicable ADRs when changing protocol, isolation, signing, distribution or lifecycle.

**Do not infer APIs from the README alone.** If a required source cannot be accessed, report the missing source; do not fabricate a substitute. Keep architecture and actual implementation status separate.

## Component ownership

- **Game developer:** game logic, assets, manifest, `async init(covil)`, logical-action and lifecycle callbacks.
- **SDK:** API facade, session messages, `host.init` handshake, `game.ready` after successful initialization.
- **Host:** device mapping, capability grants, `host.start/pause/resume/stop`, isolation, policy and trust checks.
- **Build tools:** discover assets, validate manifest/package, produce SHA-256 inventory and VLG ZIP.
- **Developer/distributor:** distinct signing and publication authorization per ADRs 0002 and 0009.

Never create a custom `sdk.js` to replace the protocol; never send `game.ready` using raw `window.parent.postMessage`. Use the official SDK or a demonstrably conformant alternative. Do not start simulation before `host.start`. The SDK is **experimental**, not a production security boundary.

## Authoring and building a game

Place game source in a directory with `manifest.json`, its `entry` HTML, JS/CSS and assets. Use the [hello-vlg bootstrap](examples/hello-vlg/game.js) and import `./covil-core.mjs`; the builder injects this file automatically.

```sh
node tools/covil-build.mjs examples/hello-vlg dist/hello-vlg.vlg
node tools/validate-vlg.mjs dist/hello-vlg.vlg
node --test tests/conformance/*.test.mjs
```

`covil-build.mjs` is an unsigned **developer-mode** packager. It does not sign, homologate, execute, or prove the safety of packages. It rejects source symlinks, reserved metadata files, and a source `covil-core.mjs` that would shadow the official SDK. Do not modify the SDK to make a game pass.

## Definition of done

- Build works for arbitrary nested assets, not a hardcoded file list.
- Generated package passes the repository validator.
- Game uses declared logical actions and lifecycle events.
- Changes to a public contract include docs, a conformance test, and an ADR when significant.
- Report commands actually executed and failures; do not claim tests ran if they did not.
- Do not claim production readiness: signed trust chain, hardened host and independent interoperability remain pending.

## VLG path policy

Do not impose a fixed directory layout on game authors. Only `manifest.json`, `integrity.json`, and optional `signature.json` have reserved root paths. `manifest.entry` may point to nested HTML; all game-authored resources may be nested freely and must appear in the SHA-256 inventory. Preserve archive-relative paths in hosts. The inventory is an integrity map, **not** a JavaScript import resolver: ensure relative HTML/CSS/JS references resolve from their containing files. The experimental builder injects `covil-core.mjs` at the archive root; use `../covil-core.mjs` from `src/game.js`, for example.
