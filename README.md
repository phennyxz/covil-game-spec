# COVIL — Console Virtual Leve

**COVIL Game Specification 0.1 (experimental)**

COVIL is an open, framework-independent specification for packaging and running lightweight Web games. **VLG** (Virtual Light Game) is its portable ZIP-based game package format.

- **Jogai**: distribution platform and prospective reference implementation.
- **COVIL**: virtual console and game execution environment.
- **COVIL Game Specification**: public contracts and conformance rules.
- **VLG**: independently distributable game package.

> **Status:** experimental proposal. The files in `docs/` distinguish proposed contracts from settled architectural principles. Do not claim full compliance or production-grade sandboxing based on this prototype.

## SDP and VLG — generic ZIP and game-specific ZIP

**[SDP](https://github.com/phennyxz/SDP-Self-Declared-Digital-Package-Standard)** is the generic, open self-declared digital ZIP standard. **VLG** is the game-specific SDP specialization with COVIL display, input, capabilities and lifecycle contracts. The current legacy VLG 0.1 is **not** SDP-compatible; an additive experimental SDP-backed variant is available without changing legacy builders or validators. See [integration guide](docs/13-sdp-vlg-integration.md) and [ADR 0012](adr/0012-sdp-vlg-profile.md).

```sh
node tools/build-sdp-vlg.mjs examples/hello-vlg dist/hello-sdp.vlg --creator-id example.author --creator-name "Example Author"
node tools/validate-sdp-vlg.mjs dist/hello-sdp.vlg
```

## Repository map

- **[Start here: responsibilities and developer guide](docs/12-responsibilities-and-developer-guide.md)** — mandatory reading for game authors, AI agents and host implementers
- [Founding document](docs/00-foundation.md)
- [Architecture](docs/01-architecture.md)
- [VLG package](docs/02-vlg-package.md)
- [Manifest](docs/03-manifest.md) and [JSON Schema](schemas/manifest.schema.json)
- [Runtime protocol](docs/04-runtime-protocol.md) and [TypeScript contracts](interfaces/covil.ts)
- [Display and input](docs/05-display-input.md)
- [Security](docs/06-security.md) and [distribution trust chain (ADR 0009)](adr/0009-distribution-trust-chain.md)
- [Versioning and conformance](docs/07-versioning.md)
- [Capability registry](docs/08-capability-registry.md) and [machine-readable IDs](schemas/capabilities.registry.json)
- [VLG public API](docs/09-vlg-public-api.md) and [ADR 0008](adr/0008-vlg-public-api.md)
- [Audit and consolidation](docs/10-audit-and-consolidation.md) and [minimal core contract](docs/11-core-runtime-contract.md)
- [Experimental SDK](sdk/covil-core.mjs), [capability preflight](host/capability-preflight.mjs) and [runtime tests](tests/conformance/runtime.test.mjs)
- [Open questions](docs/open-questions.md)
- [Minimal game](examples/hello-vlg/)
- [Validator](tools/validate-vlg.mjs) and [tests](tests/conformance/)
- [Architecture decisions](adr/), including [signed inventory](adr/0002-signature-design.md) and [host-owned iframe isolation](adr/0003-vlg-execution-isolation.md)

## Quick start — build your own VLG

Requires Node.js 20+; no npm dependencies. **Read [AGENTS.md](AGENTS.md) before generating code with an AI assistant** and the [responsibility guide](docs/12-responsibilities-and-developer-guide.md). Do not infer the runtime API from this README alone.

Create a source directory with `manifest.json`, an HTML entrypoint, JavaScript and optional nested assets. Copy the [hello-vlg game bootstrap](examples/hello-vlg/game.js) and import `./covil-core.mjs`; the builder supplies the official experimental SDK automatically.

```sh
node tools/covil-build.mjs examples/hello-vlg dist/hello-vlg.vlg
node tools/validate-vlg.mjs dist/hello-vlg.vlg
node --test tests/conformance/*.test.mjs
```

To package another game, replace the source directory and output name: `node tools/covil-build.mjs my-game dist/my-game.vlg`. The builder discovers nested assets, generates `integrity.json`, rejects reserved metadata and validates the output. It creates **unsigned development packages only**; it does not run games, verify signatures or implement a secure host. The older `tools/build-example.mjs` remains as a fixed-file example and is not the recommended builder.

The prototype validator verifies package structure, SHA-256 integrity, and the manifest subset. Cryptographic signatures are **not yet implemented**. [ADR 0002](adr/0002-signature-design.md) approves Ed25519 signatures over a SHA-256 inventory: unsigned packages are for explicitly enabled developer mode; Jogai catalog distribution requires verified developer signatures **and** distributor authorization per ADR 0009; neither is implemented yet. Do not publish untrusted games from this prototype without a secure isolated host.

## License

See [LICENSE](LICENSE). Contributions welcome under [CONTRIBUTING.md](CONTRIBUTING.md).

Runtime lifecycle and host authority are specified in [ADR 0004](adr/0004-runtime-lifecycle-protocol.md); implementations and conformance tests are pending.

Input device abstraction and host-managed control mapping are specified in [ADR 0005](adr/0005-input-controls.md).

Capability discovery, required/optional grants and compatibility policy are approved in [ADR 0006](adr/0006-capability-negotiation.md); the manifest schema migration is complete, but runtime enforcement is pending.

The [ADR 0007](adr/0007-capability-contract.md) approves `capabilities.required` and `capabilities.optional` without hardware minimums. Schema, validator, types, tests and example now use the approved lists; runtime capability discovery and permission enforcement remain pending; the canonical registry is published.

## Consolidation status (2026-11-19)

The documentation audit is published. A minimal experimental VLG SDK and pure capability preflight were added, and `hello-vlg` was migrated to `init(covil)`. **Tests were authored but not executed in this environment.** No hardened browser host, cryptographic verification, privileged capability bridge or second independent host is implemented. Do not load untrusted games.

## Distribution trust chain

[ADR 0009](adr/0009-distribution-trust-chain.md) approves preserving the developer-signed VLG and adding a **separate signed distribution envelope**, outside the ZIP. Authorization to distribute and technical homologation are distinct claims. The current prototype does not implement the envelope, signatures, trust registry or homologation.
