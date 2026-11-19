# Runtime communication protocol (experimental 0.1)

**Status:** proposed message envelope; subject to interoperability testing. Transport for browser hosts: `postMessage` via a dedicated `MessageChannel` port transferred only after the isolated frame is initialized.

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
6. Host sends `host.stop`; game releases resources and sends `game.stopped`.

Unrecognized message types are ignored or rejected according to the negotiated version; they must never trigger privileged behavior. The host may terminate unresponsive games. Define timeouts and error codes before claiming conformance.

**Security:** `postMessage` alone is not a sandbox. A production host requires an opaque isolated origin, restrictive CSP, permission policy and controlled networking. Do not transfer privileged handles or secrets.
