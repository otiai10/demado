import { Router } from "chromite";
import Mado from "../models/Mado";

const r = new Router<chrome.runtime.ExtensionMessageEvent>();

r.on("/mado/position:track", async (m) => {
  const mado = await Mado.find(m.id);
  await mado?.update({ position: m.position });
});

r.onNotFound(async (m, s) => {
  console.log("not found", m, s);
  return {};
});

export default r;