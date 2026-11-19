# Versioning and conformance

Separate versions exist for the COVIL specification, the host implementation, each game and each extension. The `schemaVersion` in a manifest identifies its schema, not the game release.

Version 0.1 is experimental and may change incompatibly before stabilization. A host declares supported protocol versions and granted capabilities; a game declares required capabilities. Unsupported requirements fail explicitly.

## Initial test tiers

- **Package:** archive parsing, safe paths, inventory, hashes, schema.
- **Protocol:** handshake, session checks, lifecycle, invalid messages.
- **Host:** sandbox, permissions, input, viewport and shutdown.
- **Portability:** identical package runs on two independent hosts.

Passing the prototype CLI tests establishes only **package-validation prototype** status, not full COVIL conformance. No official conformance certification exists yet.
