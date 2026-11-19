# Manifest contract (experimental subset)

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

[ADR 0006](../adr/0006-capability-negotiation.md) approves required/optional capability negotiation and the rule that missing required grants prevent launch. The 0.1 schema, prototype validator and example now use the new declaration shape. The legacy `storage`/`network` representation is rejected. Capability registry and runtime negotiation remain pending.

Future decisions: canonical capability registry, origin allowlists, advanced input schemas, minimum protocol versions, localization, icon metadata and game dependencies.

## Approved capability contract (ADR 0007)

The target manifest shape is `capabilities: {required: string[], optional: string[]}` with namespaced capability identifiers. Missing or unknown required capabilities prevent launch; missing or unknown optional capabilities do not. No CPU/GPU/RAM minimums are part of the MVP. See [ADR 0007](../adr/0007-capability-contract.md). **Manifest migration completed:** schema, prototype validator, types, example and conformance tests use the approved lists. This does not implement runtime capability detection or granting.

The canonical identifiers and their functional meanings are documented in [COVIL 0.1 capability registry](08-capability-registry.md). The validator intentionally accepts well-formed unknown identifiers; compatibility decisions belong to the host.
