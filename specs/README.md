# COVIL Specification — sector index

Status: proposed organization (documentation-only). Existing approved ADRs remain authoritative until formally superseded.

| Sector | Scope | Normative boundary |
|---|---|---|
| TEC | Shared technical conventions, versions, identifiers, interoperability | Common contracts |
| SEC | Integrity, trust, signatures, OFPI, quarantine, security requirements | Cross-cutting security obligations |
| APP | Game-facing API, lifecycle events, application behavior | Game/host application contract |
| PAC | VLG ZIP layout, metadata, file inventory, package construction | Package representation |
| CAP | Capability identifiers, negotiation, grants, revocation | Resource access contract |
| RUN | Host execution, sandbox implementation, runtime states, resource management | Runtime enforcement |
| DIS | Catalog publishing, distributor authorization, homologation, updates | Distribution lifecycle |
| DEV | SDK, tooling, examples, test and conformance guidance | Developer workflows |

Potential future sector: NET (multiplayer and external game networking), **not** a current normative sector.

## Governance
- Each sector maintains versioned normative requirements identified as `COVIL-<SECTOR>-NNN`.
- Use MUST, SHOULD, MAY with their usual normative meanings; distinguish proposals from implemented behavior.
- Each requirement should link tests, schemas and relevant ADRs when applicable.
- The umbrella COVIL compatibility version identifies compatible sector versions; sector revisions can evolve independently.
- Approved ADRs preserve decision history; migration of documentation does not change approved behavior.
- Avoid duplicate normative rules: PAC defines inventory representation; SEC owns integrity acceptance and quarantine; RUN enforces execution isolation; CAP owns capability grants.
- SEC applies across every sector, not merely to packages.
- Existing `docs/`, `adr/`, `schemas/`, `sdk/`, `tools/`, `tests/` and `examples/` remain in place during incremental migration. Do not assume empty sector directories or this index are implementation evidence.

## First security rule
[COVIL-SEC-001 — Strict Package Integrity and OFPI Quarantine](sec/001-strict-package-integrity-ofpi.md) is a proposed normative rule requiring implementation and conformance testing before public untrusted-package acceptance.
