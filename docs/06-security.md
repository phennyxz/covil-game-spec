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

Signature canonicalization: evaluate RFC 8785 JCS, Ed25519, key IDs, expiry/revocation, update identity and key rollover in a dedicated ADR.
