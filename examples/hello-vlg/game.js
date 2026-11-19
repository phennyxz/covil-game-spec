import {createCovilRuntime} from "./covil-core.mjs";
const state = document.getElementById("state");
const position = document.getElementById("position");
let x = 0, y = 0;
async function init(covil) {
  for (const [action, dx, dy] of [["left",-1,0],["right",1,0],["up",0,-1],["down",0,1]]) {
    covil.controls.on(action, pressed => {
      if (!pressed) return;
      x += dx; y += dy;
      position.textContent = `Position: ${x}, ${y}`;
    });
  }
  covil.lifecycle.on("start", () => { state.textContent = "Running"; });
  covil.lifecycle.on("resume", () => { state.textContent = "Running"; });
  covil.lifecycle.on("pause", () => { state.textContent = "Paused"; });
  covil.lifecycle.on("stop", () => { state.textContent = "Stopped"; });
  state.textContent = "Ready";
}
// Bootstrap is experimental. A production host must validate and isolate the frame.
window.addEventListener("message", function bootstrap(event) {
  if (event.data?.type !== "covil.connect" || event.data?.covil !== "0.1" ||
      !event.ports?.[0] || typeof event.data.sessionId !== "string" ||
      event.data.sessionId.length < 16) return;
  createCovilRuntime({port:event.ports[0],sessionId:event.data.sessionId,init});
  window.removeEventListener("message",bootstrap);
});
