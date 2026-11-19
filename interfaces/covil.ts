/** COVIL 0.1 EXPERIMENTAL — reference types, not a published stable SDK. */
export type DisplayMode = "emulator" | "mobile" | "adaptive";
export type Orientation = "portrait" | "landscape" | "any";
export type HostMessageType =
  | "host.init" | "host.start" | "host.pause" | "host.resume"
  | "host.stop" | "host.display" | "host.input";
export type GameMessageType = "game.ready" | "game.error" | "game.stopped";
export interface Envelope<T = unknown> {
  covil: "0.1";
  sessionId: string;
  id: string;
  type: HostMessageType | GameMessageType;
  payload: T;
  replyTo?: string;
}
export interface Viewport { width: number; height: number; dpr: number; orientation: Orientation; }
export interface InputEvent { action: string; pressed: boolean; }
export interface InitPayload { protocol: "0.1"; capabilities: string[]; viewport: Viewport; actions: string[]; }
export interface CapabilitiesDeclaration { required: string[]; optional: string[]; }
export interface Manifest {
  schemaVersion: "0.1";
  id: string;
  name: string;
  version: string;
  entry: string;
  runtime: "web";
  display: { mode: DisplayMode; orientation: Orientation; aspectRatio: string };
  input: { actions: string[] };
  capabilities: CapabilitiesDeclaration;
}
