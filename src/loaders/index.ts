import Mado from "../models/Mado";
import GlobalConfig from "../models/GlobalConfig";
import MadoLauncher from "../services/MadoLauncher";
import ScriptService from "../services/ScriptService";
import TabService from "../services/TabService";
import WindowService from "../services/WindowService";
import Dashboard from "../models/Dashboard";

export async function mados() {
  const id = location.search.match(/mado=([^&]+)/)?.[1];
  const spotlight = id ? await Mado.find(id) : null;
  const launcher = new MadoLauncher(new WindowService(), new TabService(), new ScriptService());
  let mados = await Mado.list();
  mados = await Promise.all(mados.map(async mado => {
    return await mado.hydrate(launcher)
  }));
  return {
    mados: mados.sort((p, n) => p.index < n.index ? -1 : 1),
    config: await GlobalConfig.user(),
    spotlight,
  };
}

export async function madosForOptions() {
  const data = await mados();
  const dashboard = await Dashboard.user();
  return {
    ...data,
    dashboard,
  };
}

export async function debugs() {
  const expids = (location.search.match(/export=([^&]+)/)?.[1] || "").split(",");
  const exportargets = (await Promise.all(expids.map(async id => await Mado.find(id)))).filter(Boolean);
  return {
    exports: exportargets,
  };
}