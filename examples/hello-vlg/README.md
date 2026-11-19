# Hello VLG

A tiny framework-free game that moves a point using abstract directional actions. It demonstrates the proposed `covil.connect` bootstrap and lifecycle messages, **not** secure host implementation.

Build the ZIP package with `node tools/build-example.mjs`. Do not open untrusted VLGs directly in a privileged page.

The manifest declares required capabilities `input.buttons` and `output.graphics` and no optional capabilities, using ADR 0007 lists. These identifiers are illustrative until the canonical capability registry is finalized. The prototype validator checks declaration structure, **not** actual device support or permissions.
