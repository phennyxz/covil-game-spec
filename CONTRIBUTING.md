# Contributing

Open an issue describing the problem and proposed compatibility impact before changing a public contract. Changes to wire formats, manifest fields or lifecycle messages require a documentation update, an example and a conformance test. Use ADRs for significant decisions. Keep COVIL independent of Jogai, React, Next.js and Firebase.

Normative language (MUST, SHOULD, MAY) is provisional until the 0.1 contract is approved. Avoid presenting unimplemented security features as operational. Submit focused pull requests and preserve backwards compatibility when feasible.

## Before implementing games, SDKs or hosts

Read [responsibilities and developer guide](docs/12-responsibilities-and-developer-guide.md) first. Game code owns mechanics and `init(covil)`; the SDK owns the API/protocol bridge; the host owns device mapping, lifecycle, isolation and permission enforcement; the distributor owns publication authorization. Do not invent a second incompatible SDK or send raw `game.ready` through `window.parent.postMessage`. Follow the guide's AI/contributor checklist and use the repository's official example as a starting point.

Before any AI-assisted change, read [AGENTS.md](AGENTS.md). For arbitrary game directories, use `node tools/covil-build.mjs SOURCE OUTPUT.vlg` rather than editing the fixed-file example builder. Include nested assets in conformance tests and run the validator; do not claim tests ran unless verified.
