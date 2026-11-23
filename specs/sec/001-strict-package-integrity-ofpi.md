# COVIL-SEC-001 — Strict Package Integrity and OFPI Quarantine

**Status:** proposed normative requirement, implementation pending  
**Applies to:** VLG ingestion, validation, installation, publishing and execution on all COVIL hosts and distributors.

## Rule
Every received VLG is untrusted until validated. An exact, complete inventory match is mandatory. Any mismatch MUST cause rejection and classification as **OFPI — Objeto Fraudulento e Perigoso Isolado**. OFPI is an operational security classification; it does **not** establish malicious intent or criminal fraud.

A VLG MUST be rejected as OFPI when any payload file is additional, missing, duplicated, renamed unexpectedly, has a non-normalized/unsafe path, mismatches the inventory's exact uncompressed byte size, declared type, applicable file signature/magic number, or SHA-256 digest, or the ZIP is structurally invalid or violates safety limits. No tolerance, auto-repair, partial acceptance or bypass for known developers.

## Verification boundary
- The inventory MUST enumerate all regular payload files (including `manifest.json`) exactly once. `integrity.json` and `signature.json` are reserved exceptions defined by PAC and signature policy; they are **not** undeclared payload files.
- PAC defines package representation; SEC defines mandatory verification and consequences.
- Verify normalized paths, duplicates, archive structure, safe bounded extraction/streaming, inventory completeness, exact byte sizes and SHA-256 on uncompressed bytes **before execution**.
- The current 0.1 inventory has `path`, `size`, `sha256` only. A normative authenticated declared file type (and policy for magic checks) requires a versioned PAC/schema change; do not silently claim existing packages support it.
- Magic numbers MUST be checked for file formats with defined reliable signatures. Text formats (HTML, JS, CSS, JSON, etc.) need type-specific rules and parsing/policy checks; magic alone never proves safety. A valid hash alone does not authenticate the inventory.
- Verify developer/distributor signatures and trusted key policy separately. A structurally matching unsigned or untrusted package is not authorized for public catalog execution; signature failures have distinct reason codes and MUST be blocked under the applicable trust policy.
- Signed games remain untrusted executable content and MUST run under RUN isolation and CAP restrictions.

## Quarantine
On OFPI classification, the receiving system MUST immediately block execution, installation, and publication, remove the package from normal delivery, and record an incident with package digest, reason code, timestamp and safe diagnostic metadata. The system MUST NOT load any game code, assets or privileged metadata as executable content during inspection.

Server-side quarantine SHOULD retain the original bytes in an access-controlled, non-executable isolated store subject to retention and privacy policy. Browser hosts that cannot safely persist quarantine MUST block and discard untrusted bytes while retaining safe incident metadata as policy permits. A quarantined object MUST NOT be re-enabled by ignoring a mismatch; a corrected package requires full fresh validation.

## Minimum reason codes
- `UNDECLARED_FILE`, `MISSING_FILE`, `DUPLICATE_PATH`, `UNSAFE_PATH`
- `SIZE_MISMATCH`, `TYPE_MISMATCH`, `MAGIC_MISMATCH`, `HASH_MISMATCH`
- `INVALID_ARCHIVE`, `RESOURCE_LIMIT_EXCEEDED`, `INVALID_INVENTORY`

Other trust failures (e.g. `INVALID_SIGNATURE`, `UNKNOWN_KEY`, `REVOKED_KEY`) MUST also block execution under the relevant distribution policy, but MUST remain distinguishable from inventory-based OFPI findings.

## Conformance cases (pending)
1. Exact package passes structural checks and proceeds to independent trust checks.
2. Added, missing and duplicate payload entries each yield OFPI.
3. Wrong byte size, SHA-256, declared type or applicable magic each yield OFPI.
4. ZIP traversal, overlapping/inconsistent entries, decompression bomb and malformed metadata are rejected without executing content.
5. Quarantined objects cannot be executed, published or restored without a fresh complete validation.
6. Signatures cannot substitute for integrity checks; integrity checks cannot substitute for trusted signatures.

## References
- `docs/02-vlg-package.md` — existing PAC 0.1 format
- `docs/06-security.md` — existing security model
- `adr/0002-signature-design.md` — approved developer signing decision
- `adr/0003-vlg-execution-isolation.md` — approved isolation decision
- `adr/0009-distribution-trust-chain.md` — approved distributor envelope design
