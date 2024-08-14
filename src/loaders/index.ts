import Mado from "../models/Mado";
import MadoLauncher from "../services/MadoLauncher";
import ScriptService from "../services/ScriptService";
import TabService from "../services/TabService";
import WindowService from "../services/WindowService";

export async function mados() {
  const launcher = new MadoLauncher(new WindowService(), new TabService(), new ScriptService());
  let mados = await Mado.list();
  mados = await Promise.all(mados.map(async mado => await mado.check(launcher)));
  return { mados: mados.sort((p, n) => p.index < n.index ? -1 : 1) };
}
