# Manifest contract (experimental subset)

> **Nota canônica:** `manifest.json` é o contrato específico de jogo COVIL. O pacote VLG também exige `sdp.json` (declaração SDP) e `integrity.json` no formato SDP. Consulte [integração SDP–VLG](13-sdp-vlg-integration.md). O manifesto de jogo não substitui `sdp.json`.


The root `manifest.json` declares game identity, version, entrypoint, runtime, display, input and capabilities. The executable code must not depend on Jogai internals.

The draft [JSON Schema](../schemas/manifest.schema.json) checks the mandatory minimum; it is intentionally restrictive and not a complete standard.

```json
{
  "schemaVersion": "0.1",
  "id": "org.example.hello",
  "name": "Hello VLG",
  "version": "1.0.0",
  "entry": "index.html",
  "runtime": "web",
  "display": {"mode": "emulator", "orientation": "portrait", "aspectRatio": "4:3"},
  "input": {"actions": ["up", "down", "left", "right", "pause"]},
  "capabilities": {"required": ["input.buttons", "output.graphics"], "optional": []}
}
```

The ADR 0007 format uses namespaced capability identifiers in `required` and `optional`. Unknown required capabilities prevent launch; unknown optional capabilities do not. The validator checks syntax and disjoint lists; **runtime support and permission grants must be checked by the host**, not inferred from package validity. An entrypoint must be a local relative HTML file. The host may negotiate optional features beyond this baseline, but must not silently grant privileged services.

Input action declaration is approved by [ADR 0005](../adr/0005-input-controls.md): `input.actions` lists logical action identifiers, independent of physical controls. The host maps and delivers them through `host.input`.

[ADR 0006](../adr/0006-capability-negotiation.md) approves required/optional capability negotiation and the rule that missing required grants prevent launch. The 0.1 schema, prototype validator and example now use the new declaration shape. The legacy `storage`/`network` representation is rejected. Capability registry is published; full runtime permission negotiation remains pending.

Future decisions: capability-specific method contracts, origin allowlists, advanced input schemas, minimum protocol versions, localization, icon metadata and game dependencies.

## Approved capability contract (ADR 0007)

The target manifest shape is `capabilities: {required: string[], optional: string[]}` with namespaced capability identifiers. Missing or unknown required capabilities prevent launch; missing or unknown optional capabilities do not. No CPU/GPU/RAM minimums are part of the MVP. See [ADR 0007](../adr/0007-capability-contract.md). **Manifest migration completed:** schema, prototype validator, types, example and conformance tests use the approved lists. This does not implement runtime capability detection or granting.

The canonical identifiers and their functional meanings are documented in [COVIL 0.1 capability registry](08-capability-registry.md). The validator intentionally accepts well-formed unknown identifiers; compatibility decisions belong to the host.

## Entrypoint and internal paths

`manifest.entry` is the sole location hint needed for the game's initial HTML document. It is a safe, archive-relative path, not necessarily a root-level file; for example, `web/index.html` is valid when that file is inventoried. All other game files can live in arbitrary nested directories and are identified by their exact archive-relative paths in `integrity.json`. The host must preserve this hierarchy when loading verified files. The inventory verifies bytes and paths but does **not** resolve JavaScript imports or HTML/CSS relative URLs; those remain subject to standard web URL resolution. The only root-fixed files are `manifest.json`, `integrity.json`, and optional `signature.json`.
