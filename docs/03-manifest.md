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
  "capabilities": {"storage": "none", "network": "none"}
}
```

`storage` is `none` or `local` in this subset; `network` is `none` or `required`. A required capability that the host cannot grant causes a clear incompatibility error. An entrypoint must be a local relative HTML file. The host may negotiate optional features beyond this baseline, but must not silently grant privileged services.

Input action declaration is approved by [ADR 0005](../adr/0005-input-controls.md): `input.actions` lists logical action identifiers, independent of physical controls. The host maps and delivers them through `host.input`.

[ADR 0006](../adr/0006-capability-negotiation.md) approves required/optional capability negotiation and the rule that missing required grants prevent launch. The current 0.1 schema still supports only the legacy `storage`/`network` subset; the new manifest shape and migration are pending. Do not treat conceptual ADR examples as currently valid manifests.

Future decisions: capability schema migration, origin allowlists, advanced input schemas, minimum protocol versions, localization, icon metadata and game dependencies.
