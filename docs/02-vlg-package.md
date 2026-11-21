# VLG package format (draft 0.1)

A `.vlg` is a ZIP archive. The root contains `manifest.json`, `integrity.json`, an HTML entrypoint, and local assets. `signature.json` is reserved for signed distribution; development packages may omit it pending a finalized trust policy.

## Proposed baseline restrictions

- UTF-8 filenames with forward-slash separators; paths must be relative, nonempty, unique and normalized, without `.`, `..`, NUL, backslashes or absolute roots.
- No symbolic links, encrypted ZIP entries, duplicate archive paths or unlisted executable resources.
- `integrity.json` inventories every regular file except itself and `signature.json`. Each entry records `path`, byte `size` and lowercase hexadecimal SHA-256.
- All inventory entries must exist, and no unlisted payload file is permitted.
- The ZIP may be compressed; integrity hashes refer to **uncompressed bytes**.
- **Approved (ADR 0002):** Ed25519 signs ASCII `COVIL-VLG-INTEGRITY-v1\\n` followed by the exact bytes of `integrity.json`; do not reserialize the JSON.
- Hosts must impose compressed/uncompressed size, entry count and decompression ratio limits. The prototype validator has its own conservative limits.

## Prototype inventory

```json
{
  "schemaVersion": "0.1",
  "algorithm": "sha256",
  "files": [
    {"path":"index.html","size":123,"sha256":"<64 lowercase hex digits>"}
  ]
}
```

The example above is illustrative, not a complete package inventory.

## Signing boundary

The integrity inventory cannot include its own hash. The signature file cannot cover itself. Signature scope and development/catalog trust policy are approved in [ADR 0002](../adr/0002-signature-design.md). Key ID encoding, rotation and revocation still require normative detail. The current tools **do not** verify signatures.

## Distribution envelope (ADR 0009)

A distributor's second signature is **not** inserted into the original VLG ZIP. The original developer-signed `.vlg` remains unchanged; a separate `distribution.json` and `distribution.sig` envelope binds authorization to the exact package bytes via SHA-256. This avoids invalidating the ADR 0002 inventory-completeness rule. Distribution authorization and technical homologation are separate claims. The envelope schema and signature verifier are not yet implemented. See [ADR 0009](../adr/0009-distribution-trust-chain.md).

## Internal layout and inventory (approved clarification)

The VLG format does **not** prescribe directories for game code or assets. Game authors may organize HTML, JavaScript, CSS, images, audio, and other local resources in arbitrary nested directories, provided every path is safe, normalized, unique, and present in `integrity.json` with its exact uncompressed byte length and SHA-256 hash. The inventory maps archive-relative paths to bytes for integrity verification; it does not rewrite imports or act as a module resolver.

Only package metadata has fixed locations at the archive root: `manifest.json`, `integrity.json`, and `signature.json` when signed. The HTML entrypoint is located by the `manifest.entry` archive-relative path and may itself be nested. The host must preserve the archive-relative path hierarchy when exposing verified files to the isolated game context. HTML references, CSS URLs, and JavaScript imports retain their normal relative-resolution semantics.

The experimental builder currently injects the SDK at the archive root as `covil-core.mjs`. Therefore a JavaScript module in `src/game.js` must import `../covil-core.mjs` (not `./covil-core.mjs`). The SDK location is a tooling convention in 0.1, not a restriction on the locations of game-authored files. This clarification changes no ZIP structure, hashing algorithm, or manifest field.
