# Open architectural questions

These items are deliberately **not** final requirements:

1. Signature policy: mandatory for all VLGs or only catalog distribution?
2. Canonical signed payload: RFC 8785 JCS for manifest and integrity, or another byte-level format?
3. Key distribution, revocation, rotation and publisher identity.
4. Host isolation strategy: separate origin, sandboxed iframe, service workers and offline asset serving.
5. ZIP limits, compression methods, Unicode path normalization and duplicate detection.
6. Exact lifecycle error codes, acknowledgements, timeouts and protocol negotiation.
7. Capability declaration: optional vs required; network origin allowlists; persistent storage quota.
8. Compatibility strategy for protocol minor/major versions and extensions.
9. Independent second-host test fixture and test certification process.
10. Governance, trademark, licensing and change approval policy.

Resolve each by an ADR plus tests before marking the behavior normative.
