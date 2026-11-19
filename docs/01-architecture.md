# Architecture and boundaries

**Status:** architectural direction; runtime wire contract experimental.

```text
VLG ZIP --> validator --> trusted package store --> isolated game origin
                                              |       |
Jogai / other host --> COVIL runtime ----------+-- message bridge
       |                                             |
       +--- catalogue, account, library         negotiated services
```

The host must not expose internal application objects or privileged tokens to a game. The game communicates through a versioned, structured protocol. Game engines are optional, including proposed Core, Gravity, TopMove, SideMove, Grid and Runner libraries. No engine is required for conformance.

The package contains client-side resources. Server-side multiplayer or other backends are separately hosted and declared. A game can work offline if it needs no unavailable network resource.

The reference host and any Jogai adapter are separate implementations; this repository may contain small portable samples and tools but not Jogai source code.

## Proposed implementation milestones

M1: minimal VLG ZIP, schema, integrity, sandboxed host, handshake, pause/resume/stop, two-host interoperability test. **Not complete:** a pure capability preflight and SDK handshake prototype exist, but the isolated browser host and two-host test do not.

M2: canonical signatures, key trust policy, capability grants, offline package cache.

M3: capability-specific SDK and extensions. A **minimal experimental SDK core** now exists, but privileged capability APIs, hardened host isolation and interoperability certification remain pending.

## Approved isolation boundary

Per [ADR 0003](../adr/0003-vlg-execution-isolation.md), the COVIL console must contain hostile VLG code. The Web/PWA reference uses an origin-isolated sandboxed iframe and a private MessageChannel, independently of emulator/mobile/adaptive display. Optional Workers run inside that boundary; future native hosts may use OS processes. Security conformance requires adversarial tests.
