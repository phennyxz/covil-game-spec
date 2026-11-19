# Runtime communication protocol (experimental 0.1)

**Status:** minimal lifecycle and message types approved by [ADR 0004](../adr/0004-runtime-lifecycle-protocol.md); wire-level limits, timeouts and conformance tests remain experimental. Transport for browser hosts: `postMessage` via a dedicated `MessageChannel` port transferred only after the isolated frame is initialized.

## Envelope

```json
{"covil":"0.1","sessionId":"opaque-random-session","id":"message-1","type":"host.init","payload":{"protocol":"0.1","capabilities":[]}}
```

Every message has `covil`, `sessionId`, `id`, `type` and `payload`. Session identifiers are random, per launch. The host validates schema, message size, source and allowed type/state. The game validates the negotiated version and session. A message ID supports correlation; responses use `replyTo` when needed.

## Proposed lifecycle

1. Host creates isolated context and private channel.
2. Host sends `host.init` (protocol, granted capabilities, viewport, input actions).
3. Game sends `game.ready` or `game.error`.
4. Host sends `host.start`.
5. Host may send `host.pause`, `host.resume`, `host.display`, `host.input`.
6. Host sends `host.stop` as a cooperative request; game may release resources and send `game.stopped`. The host can invalidate the session and remove the iframe without waiting for the game.

Unrecognized message types are ignored or rejected according to the negotiated version; they must never trigger privileged behavior. The host may terminate unresponsive games. Define timeouts and error codes before claiming conformance.

**Security:** `postMessage` alone is not a sandbox. A production host requires an opaque isolated origin, restrictive CSP, permission policy and controlled networking. Do not transfer privileged handles or secrets.

## Host authority

The host owns lifecycle transitions, permissions and termination. A VLG cannot authorize itself, send privileged host commands or veto termination. Paused games must stop gameplay simulation. Messages are validated for direction, session, state, schema and size; late messages are discarded. See [ADR 0004](../adr/0004-runtime-lifecycle-protocol.md).

## Capability negotiation (ADR 0006)

The VLG may query host-supported capabilities and session grants; the host remains authoritative. Missing required grants prevent startup, while missing optional grants allow graceful degradation. The exact query/result/revocation message types are **not yet standardized**; see [ADR 0006](../adr/0006-capability-negotiation.md).

## Public VLG API (ADR 0008)

The game-facing SDK calls `init(covil)` after the host has checked required grants and delivered `host.init`. The SDK reports `game.ready` on successful initialization; `host.start` remains the authority to begin gameplay. The public API uses `covil.has()`, `covil.request()` and capability-specific facades, not generic `covil.input()` / `covil.output()`. This is an API design contract, **not yet an implemented SDK**. See [ADR 0008](../adr/0008-vlg-public-api.md) and [API documentation](09-vlg-public-api.md).
