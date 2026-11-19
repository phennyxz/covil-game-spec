# ADR 0002 — Signature canonicalization and trust

**Status:** proposed; NOT accepted.

## Candidate

SHA-256 for inventory hashes; Ed25519 for signatures; RFC 8785 JCS for canonical JSON. Sign a precisely defined, domain-separated payload that binds manifest and integrity inventory. Exclude `signature.json` itself.

## Questions

How are keys trusted, rotated and revoked? Is signing required for local imports? Which bytes are signed? How are multiple signatures represented?

## Decision

Deferred. The prototype validator must reject any claim of verified signature status.
