# ADR 0001 — Open specification independent of Jogai

**Status:** accepted architectural direction (founding charter).

## Context

A console format coupled to a specific site would prevent independent game creation and third-party hosts.

## Decision

COVIL defines a public package format and versioned host/game protocol. Jogai is the first planned implementation and distribution platform, not a dependency of the specification. Games must not require React, Next.js, Firebase or any official engine.

## Consequences

Contracts and conformance tests live in this repository. Host-specific adapters and service backends stay outside the normative core.
