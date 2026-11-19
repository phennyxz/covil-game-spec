// Experimental COVIL 0.1 VLG SDK core: no privileged APIs, no runtime permission requests.
export function createCovilRuntime({port, sessionId, init}) {
  if (!port || typeof port.postMessage !== "function" || typeof sessionId !== "string" || sessionId.length < 16 || typeof init !== "function") {
    throw new TypeError("Invalid COVIL runtime bootstrap");
  }
  let state = "connected", seq = 0;
  let actions = new Set(), grants = new Set();
  const listeners = new Map();
  const handlers = {start: new Set(), pause: new Set(), resume: new Set(), stop: new Set()};
  const send = (type, payload = {}) => port.postMessage({covil:"0.1", sessionId, id:"game-"+(++seq), type, payload});
  const fail = error => {
    if (state === "stopped") return;
    state = "failed";
    send("game.error", {code:"INIT_FAILED", message:String(error?.message || error).slice(0,200)});
  };
  const api = Object.freeze({
    has: id => grants.has(id),
    controls: Object.freeze({
      on(action, callback) {
        if (!actions.has(action) || typeof callback !== "function") throw new TypeError("Unknown action or invalid callback");
        let set = listeners.get(action);
        if (!set) listeners.set(action, set = new Set());
        set.add(callback);
        return () => set.delete(callback);
      }
    }),
    lifecycle: Object.freeze({
      on(event, callback) {
        if (!Object.hasOwn(handlers,event) || typeof callback !== "function") throw new TypeError("Unknown lifecycle event");
        handlers[event].add(callback);
        return () => handlers[event].delete(callback);
      }
    })
  });
  function emit(event) {
    for (const fn of handlers[event]) {
      try { fn(); } catch (error) { fail(error); break; }
    }
  }
  async function receive(message) {
    if (!message || message.covil !== "0.1" || message.sessionId !== sessionId || typeof message.type !== "string" || state === "stopped" || state === "failed") return;
    switch (message.type) {
      case "host.init":
        if (state !== "connected") return;
        if (message.payload?.protocol !== "0.1" || !Array.isArray(message.payload.capabilities) || !Array.isArray(message.payload.actions) ||
            message.payload.capabilities.some(x => typeof x !== "string") || message.payload.actions.some(x => typeof x !== "string")) {
          fail(new Error("Invalid host.init")); return;
        }
        state = "initializing";
        grants = new Set(message.payload.capabilities);
        actions = new Set(message.payload.actions);
        try {
          await init(api);
          if (state !== "initializing") return;
          state = "ready";
          send("game.ready");
        } catch (error) { fail(error); }
        break;
      case "host.start":
        if (state !== "ready") return;
        state = "running"; emit("start"); break;
      case "host.pause":
        if (state !== "running") return;
        state = "paused"; emit("pause"); break;
      case "host.resume":
        if (state !== "paused") return;
        state = "running"; emit("resume"); break;
      case "host.input":
        if (state !== "running" || !grants.has("input.buttons")) return;
        if (!actions.has(message.payload?.action) || typeof message.payload?.pressed !== "boolean") return;
        for (const fn of listeners.get(message.payload.action) || []) {
          try { fn(message.payload.pressed); } catch (error) { fail(error); break; }
        }
        break;
      case "host.stop":
        state = "stopped"; emit("stop"); send("game.stopped"); port.close?.(); break;
    }
  }
  port.onmessage = event => { void receive(event.data); };
  port.start?.();
  return Object.freeze({getState:()=>state});
}
