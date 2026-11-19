# Display and input (core approved; extensions pending)

Three display modes are proposed:

- `emulator`: host-managed game viewport with optional virtual controls.
- `mobile`: viewport-first, touch and gesture friendly.
- `adaptive`: game adapts to host-reported dimensions and orientation.

The host owns the console chrome and input surfaces. The game owns only its isolated drawing surface. Display mode does **not** dictate input method: touch, keyboard and gamepad may coexist.

The host communicates logical viewport width/height, device pixel ratio and orientation changes using `host.display`. Input uses abstract actions, not device-specific key codes. `host.input` carries an action and a pressed/released state. A paused game must not continue simulation unintentionally.

Per [ADR 0005](../adr/0005-input-controls.md), the host owns device-to-action mapping, focus, remapping and virtual controls. The manifest declares logical actions; `host.input` delivers `{action, pressed}`. The host consolidates simultaneous device presses, suppresses gameplay input and clears pressed states on pause, focus loss or termination. The display mode never mandates a particular input device.

Pending: analog axes, gestures and pointer coordinates, multiplayer input, accessibility details, fullscreen and safe-area behavior.

The shared lifecycle and transport are approved by [ADR 0004](../adr/0004-runtime-lifecycle-protocol.md). Display mode never changes the isolation boundary or message authority; the host controls viewport reporting and abstract input delivery.
