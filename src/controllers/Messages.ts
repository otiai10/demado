import { Router } from "chromite";
import Mado, { MadoLikeParams } from "../models/Mado";
import TabService from "../services/TabService";
import GlobalConfig from "../models/GlobalConfig";
import WindowService from "../services/WindowService";

const r = new Router<chrome.runtime.ExtensionMessageEvent>();

r.on("/mado/position:track", async (m) => {
  const mado = await Mado.find(m.id);
  await mado?.update({ position: m.position });
});

r.on("/mado/dynamic-config:result", async (m: { mado: string; params: MadoLikeParams }) => {
  const mado = await Mado.find(m.mado);
  if (!mado) return; // TODO: エラーハンドリング
  await mado.update(m.params);
  const tabservice = new TabService();
  await tabservice.options.reopen({ mado: mado._id! });
});

r.on("/mado/dynamic-config/zoom:set", async (m: { value: number }, sender) => {
  const tabservice = new TabService();
  tabservice.zoom.set(sender.tab!.id!, m.value);
});

r.on("/global-config:get", async () => {
  const config = await GlobalConfig.user();
  return { config };
});

r.on("/mado:get", async (m: { id: string }) => {
  const mado = await Mado.find(m.id);
  return { mado };
});

r.on("/mado/resize", async (m: { zoom: number, frame: { outer: { w: number, h: number }, inner: { w: number, h: number } } }, sender) => {
  const tabs = new TabService();
  const zoom = await tabs.zoom.get(sender.tab!.id!);
  const wins = new WindowService();
  const diff = {
    w: m.frame.outer.w - (m.frame.inner.w * zoom),
    h: m.frame.outer.h - (m.frame.inner.h * zoom),
  };
  return await wins.resizeBy(sender.tab!.windowId, diff);
});

r.on("/mado/zoom:set", async (m: { value: number }, sender) => {
  const tabservice = new TabService();
  tabservice.zoom.set(sender.tab!.id!, m.value || 1);
});

r.onNotFound(async (m, s) => {
  console.log("not found", m, s);
  return { status: 404, message: `not found for path: ${m._act_}` };
});

export default r;