# Founding charter — COVIL

**Project:** COVIL — Console Virtual Leve  
**Repository:** phennyxz/covil-game-spec  
**Format:** .vlg — Virtual Light Game  
**Version:** experimental 0.1  
**Reference platform:** Jogai (jogai.net.br)

COVIL proposes an open virtual console based on Web technologies, designed to run portable, independent, lightweight games inside a console interface. It is **not** a mandatory game engine, a programming language, or a centralized distribution service.

**Project boundaries:** Jogai supplies catalogue, identity, library and services; COVIL defines the execution environment; this repository publishes the contracts; VLG is the independent unit of distribution. Other hosts must be able to implement the standard without Jogai.

## Architectural principles

1. **Independence:** no required React, Next.js, Firebase or engine.
2. **Lightness:** fast startup and modest resources are design goals, not arbitrary complexity caps.
3. **Portability:** one VLG runs on compatible hosts, subject to negotiated capabilities.
4. **Security:** validate packages, isolate execution and grant capabilities explicitly.
5. **Extensibility:** small mandatory core and optional versioned extensions.

## Scope

The proposed VLG format is a ZIP container with a manifest, an integrity inventory, optional or policy-required signing metadata, a Web entrypoint and all client assets. HTML, CSS, JavaScript and JSON form the baseline. WebAssembly is a future extension. Online games may declare external service requirements. A VLG does not need its own PWA or service worker.

Display modes are `emulator`, `mobile`, and `adaptive`; input is independent of mode. The console owns the outer frame; the game owns its viewport.

The runtime must negotiate protocol version, session, granted capabilities, lifecycle, display and input changes, errors and shutdown. Optional services may include storage, audio, scores, achievements, cloud saves, public identity, multiplayer, networking and purchases.

Package security proposes SHA-256 file inventory and Ed25519 signatures over precisely canonicalized metadata, with JCS (RFC 8785) under evaluation. Signatures do not establish that code is safe. Offline, online and hybrid operation are intended.

## Success criterion

An independent developer creates a VLG without Jogai source code; public tools validate it; at least two compatible hosts execute the identical package without game-specific modifications.

## Interpretation

This charter records project direction, **not** final normative approval of every design option. See [open questions](open-questions.md). Advanced features remain extensions until contracts and tests exist.
