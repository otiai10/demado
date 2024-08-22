import LaunchHistory from "../models/LaunchHistory";
import MadoLauncher from "../services/MadoLauncher";
import TabService from "../services/TabService";

const cleanupURL = (raw: string) => {
  return raw.split("#")[0].split("?")[0];
}

export async function onNavigationCommited(details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) {
  if (details.frameType != "outermost_frame") return;
  const launcher = new MadoLauncher();
  if (details.transitionType == "reload") {
    // console.log(`(demado) %c[DEBUG]`, "color:grey;background-color:yellow;", details, mado)
    const mado = await launcher.lookup(details.tabId);
    if (!mado || !mado.$existance) return;
    await launcher.reactivate(mado.$existance!.tab!);
  }
  if (details.transitionQualifiers.includes("server_redirect")) {
    const tab = await new TabService().get(details.tabId);
    if (!tab) return;
    const history = await LaunchHistory.find(`${details.tabId}`);
    if (!history) return;
    if (cleanupURL(details.url) !== cleanupURL(history.mado.url)) return;
    history.delete();
    // console.log(`(demado) %c[INFO]`, "color:white;background-color:blue;", details);
    launcher.anchor(tab, history.mado, history.mode); // sessionStorageを埋め直す
    const mado = await launcher.lookup(details.tabId);
    if (!mado || !mado.$existance) return;
    await launcher.reactivate(mado.$existance!.tab!);
  }
}
