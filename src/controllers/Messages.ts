import { Router } from "chromite";
import Mado, { MadoLikeParams } from "../models/Mado";
import TabService from "../services/TabService";
import GlobalConfig from "../models/GlobalConfig";

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

r.on("/global-config:get", async () => {
  const config = await GlobalConfig.user();
  return { config };
});

r.onNotFound(async (m, s) => {
  console.log("not found", m, s);
  return { status: 404, message: `not found for path: ${m._act_}` };
});

export default r;