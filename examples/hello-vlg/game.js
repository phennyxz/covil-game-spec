// Experimental COVIL 0.1 sample. No platform/framework dependencies.
(() => {
  const state = document.getElementById("state");
  const position = document.getElementById("position");
  let port, sessionId, running = false, stopped = false, x = 0, y = 0;
  let seq = 0;
  function send(type, payload = {}) {
    port?.postMessage({covil:"0.1", sessionId, id:"game-" + (++seq), type, payload});
  }
  function receive(e) {
    const m = e.data;
    if (!m || m.covil !== "0.1" || m.sessionId !== sessionId || typeof m.type !== "string") return;
    switch(m.type) {
      case "host.init":
        if (m.payload?.protocol !== "0.1") { send("game.error",{code:"UNSUPPORTED_PROTOCOL"}); return; }
        state.textContent = "Ready"; send("game.ready"); break;
      case "host.start": case "host.resume":
        if (!stopped) { running = true; state.textContent = "Running"; } break;
      case "host.pause": running = false; state.textContent = "Paused"; break;
      case "host.input":
        if (!running || !m.payload?.pressed) return;
        if (m.payload.action === "left") x--;
        if (m.payload.action === "right") x++;
        if (m.payload.action === "up") y--;
        if (m.payload.action === "down") y++;
        position.textContent = `Position: ${x}, ${y}`;
        break;
      case "host.stop":
        running = false; stopped = true; state.textContent = "Stopped"; send("game.stopped");
        port.close(); break;
    }
  }
  // Bootstrap only: host must verify origin/source and transfer one dedicated port.
  window.addEventListener("message", function bootstrap(e) {
    if (e.data?.type !== "covil.connect" || e.data?.covil !== "0.1" || !e.ports?.[0] || port) return;
    if (typeof e.data.sessionId !== "string" || e.data.sessionId.length < 16) return;
    sessionId = e.data.sessionId; port = e.ports[0]; port.onmessage = receive; port.start();
    window.removeEventListener("message", bootstrap);
  });
})();
