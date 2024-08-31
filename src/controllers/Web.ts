import LaunchHistory from "../models/LaunchHistory";
import MadoLauncher from "../services/MadoLauncher";
import TabService from "../services/TabService";

/**
 * hashやqueryを除去してURLを比較する
 */
const cleanupURL = (raw: string) => {
  return raw.split("#")[0].split("?")[0];
}

/**
 * hashやqueryを除去したうえで、
 * httpおよびhttpsの差分も含めてURLを比較する
 */
const compareURL = (a: string, b: string) => {
  if (cleanupURL(a) === cleanupURL(b)) return true;
  if (cleanupURL(a).replace("http:", "https:") === cleanupURL(b).replace("http:", "https:")) return true;
  return false;
}

/**
 * 未ログイン状態でのページリロード時に、DMMなどでログインしたあとに
 * リダイレクトされたときに、窓をactivateしなおす
 */
export async function onNavigationCommited(details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) {
  if (details.frameType != "outermost_frame") return;
  const launcher = new MadoLauncher();
  if (details.transitionType == "reload") {
    const mado = await launcher.lookup(details.tabId);
    if (!mado || !mado.$existance) return;
    await launcher.reactivate(mado.$existance!.tab!, mado);
  }
  if (details.transitionQualifiers.includes("server_redirect")) {
    const tab = await new TabService().get(details.tabId);
    if (!tab) return;
    const history = await LaunchHistory.find(`${details.tabId}`);
    if (!history) return;
    if (!compareURL(details.url, history.mado.url)) return;
    history.delete();
    // console.log(`(demado) %c[INFO]`, "color:white;background-color:blue;", details);
    await launcher.anchor(tab, history.mado, history.mode); // sessionStorageを埋め直す
    const mado = await launcher.lookup(details.tabId);
    if (!mado || !mado.$existance) return;
    await launcher.reactivate(mado.$existance!.tab!, mado);
  }
}
