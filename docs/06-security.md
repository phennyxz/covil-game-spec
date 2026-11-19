# Security model (proposal, NOT a security certification)

## Threats

Untrusted archives may include path traversal, duplicate names, ZIP bombs, malformed files, script injection, attempts to access host state, excessive CPU/memory use, unauthorized network traffic and forged protocol messages.

## Host obligations (target design)

1. Validate paths, file inventory, sizes and SHA-256 **before** execution.
2. Authenticate package signatures when distribution policy requires them; verify against trusted, revocable keys. The signature format is not yet finalized.
3. Run games in a sandboxed, isolated origin with no same-origin access to the host, no inherited session credentials and no privileged APIs.
4. Grant only explicitly negotiated capabilities; default deny storage, network and account data.
5. Limit resources, messages and lifecycle timeouts. A browser cannot reliably guarantee hard CPU/memory limits; use watchdogs and host policy.
6. Prevent service-worker registration and unapproved navigation by third-party games.
7. Avoid `allow-same-origin` combined with `allow-scripts` for same-origin untrusted frames. Prefer separately served, origin-isolated game assets.

**Prototype caveat:** the CLI validator checks structure and hashes only. It does not provide a sandbox, Ed25519 verification, key revocation, malware scanning or safe publishing. Do not run arbitrary imported games as trusted content.

**Approved signature architecture:** see [ADR 0002](../adr/0002-signature-design.md). Sign the domain-separated exact bytes of `integrity.json` with Ed25519; SHA-256 inventory covers every payload file including the manifest. Unsigned local packages require explicit developer mode; Jogai catalog packages require valid signatures from recognized developer keys. Key revocation and rollover details remain open. The current prototype does not implement Ed25519.

## Approved execution isolation (ADR 0003)

The **COVIL host**, not the VLG, enforces security. Treat every game as hostile even if signed. The Web/PWA reference host uses a sandboxed iframe with an isolated/opaque origin, restrictive CSP and permissions, and a per-session MessageChannel. The same boundary covers emulator, mobile and adaptive display modes. See [ADR 0003](../adr/0003-vlg-execution-isolation.md) for obligations, adversarial tests and browser limitations. The current tools are **not** a secure host.

## Two-stage trust (ADR 0009)

The developer signs the original inventory. A publishing server verifies developer identity, signature and package integrity, then may issue a separate distributor-signed authorization envelope bound to the exact VLG bytes. A technical homologation statement, if present, is a distinct evidence-backed claim; neither signature guarantees harmless code. Consoles enforce their own trusted distributor keys, validity, scope, integrity and sandbox. Offline revocation is necessarily bounded by locally available signed trust metadata and policy. This is an **approved architecture, not an implemented security mechanism**. See [ADR 0009](../adr/0009-distribution-trust-chain.md).
