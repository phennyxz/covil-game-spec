# COVIL — Console Virtual Leve

**COVIL Game Specification 0.1 (experimental)**

COVIL is an open, framework-independent specification for packaging and running lightweight Web games. **VLG** (Virtual Light Game) is its portable ZIP-based game package format.

- **Jogai**: distribution platform and prospective reference implementation.
- **COVIL**: virtual console and game execution environment.
- **COVIL Game Specification**: public contracts and conformance rules.
- **VLG**: independently distributable game package.

> **Status:** experimental proposal. The files in `docs/` distinguish proposed contracts from settled architectural principles. Do not claim full compliance or production-grade sandboxing based on this prototype.

## Repository map

- [Founding document](docs/00-foundation.md)
- [Architecture](docs/01-architecture.md)
- [VLG package](docs/02-vlg-package.md)
- [Manifest](docs/03-manifest.md) and [JSON Schema](schemas/manifest.schema.json)
- [Runtime protocol](docs/04-runtime-protocol.md) and [TypeScript contracts](interfaces/covil.ts)
- [Display and input](docs/05-display-input.md)
- [Security](docs/06-security.md)
- [Versioning and conformance](docs/07-versioning.md)
- [Open questions](docs/open-questions.md)
- [Minimal game](examples/hello-vlg/)
- [Validator](tools/validate-vlg.mjs) and [tests](tests/conformance/)
- [Architecture decisions](adr/), including [signed inventory](adr/0002-signature-design.md) and [host-owned iframe isolation](adr/0003-vlg-execution-isolation.md)

## Quick start

Requires Node.js 20+; no npm dependencies.

```sh
node tools/build-example.mjs
node tools/validate-vlg.mjs dist/hello-vlg.vlg
node --test tests/conformance/*.test.mjs
```

The prototype validator verifies package structure, SHA-256 integrity, and the manifest subset. Cryptographic signatures are **not yet implemented**. [ADR 0002](adr/0002-signature-design.md) approves Ed25519 signatures over a SHA-256 inventory: unsigned packages are for explicitly enabled developer mode; Jogai catalog distribution requires verified developer signatures. Do not publish untrusted games from this prototype without a secure isolated host.

## License

See [LICENSE](LICENSE). Contributions welcome under [CONTRIBUTING.md](CONTRIBUTING.md).

Runtime lifecycle and host authority are specified in [ADR 0004](adr/0004-runtime-lifecycle-protocol.md); implementations and conformance tests are pending.

Input device abstraction and host-managed control mapping are specified in [ADR 0005](adr/0005-input-controls.md).

Capability discovery, required/optional grants and compatibility policy are approved in [ADR 0006](adr/0006-capability-negotiation.md); the manifest schema migration is pending.
