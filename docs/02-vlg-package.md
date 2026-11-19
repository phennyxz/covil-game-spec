# VLG package format (draft 0.1)

A `.vlg` is a ZIP archive. The root contains `manifest.json`, `integrity.json`, an HTML entrypoint, and local assets. `signature.json` is reserved for signed distribution; development packages may omit it pending a finalized trust policy.

## Proposed baseline restrictions

- UTF-8 filenames with forward-slash separators; paths must be relative, nonempty, unique and normalized, without `.`, `..`, NUL, backslashes or absolute roots.
- No symbolic links, encrypted ZIP entries, duplicate archive paths or unlisted executable resources.
- `integrity.json` inventories every regular file except itself and `signature.json`. Each entry records `path`, byte `size` and lowercase hexadecimal SHA-256.
- All inventory entries must exist, and no unlisted payload file is permitted.
- The ZIP may be compressed; integrity hashes refer to **uncompressed bytes**.
- The signature payload and its canonical representation remain undecided. Do not sign arbitrary JSON serialization and claim interoperable signatures.
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

The integrity inventory cannot include its own hash. The signature file cannot cover itself. Signature semantics (JCS, signature scope, key IDs, rotation, revocation and trust levels) require a separate approved ADR. The current tools **do not** verify signatures.
