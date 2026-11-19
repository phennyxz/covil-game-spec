# Open architectural questions

These items are deliberately **not** final requirements:

1. **Resolved (ADR 0002):** unsigned packages only in explicitly enabled developer mode; Jogai catalog requires a valid recognized developer signature.
2. **Resolved (ADR 0002):** Ed25519 signs domain-separated exact `integrity.json` bytes, with no JSON reserialization.
3. Key distribution, revocation, rotation and publisher identity.
4. **Partly resolved (ADR 0003):** Web/PWA reference host uses origin-isolated sandboxed iframe and private MessageChannel. Offline asset serving, detailed CSP, network restrictions and cross-game storage isolation remain to be designed.
5. ZIP limits, compression methods, Unicode path normalization and duplicate detection.
6. **Partly resolved (ADR 0004):** host-owned lifecycle, core message names, pause and unilateral termination approved; exact error codes, acknowledgements, timeouts, rate limits and protocol negotiation remain open.
7. **Partly resolved (ADRs 0006–0007):** `capabilities.required` / `capabilities.optional` manifest shape and no-start on missing required grant approved; schema/validator/examples migrated; define canonical capability registry, network origin allowlists, permission UX and storage quota.
8. Compatibility strategy for protocol minor/major versions, extensions and legacy manifest migration.
9. Independent second-host test fixture and test certification process.
10. Governance, trademark, licensing and change approval policy.

Resolve each by an ADR plus tests before marking the behavior normative.

11. **Partly resolved (ADR 0005):** host-managed digital action mapping, focus and pressed-state cleanup approved; analog input, gestures, pointer coordinates, multiplayer input and default layouts remain open.
