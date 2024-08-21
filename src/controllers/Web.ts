import MadoLauncher from "../services/MadoLauncher";

export async function onNavigationCommited(details: chrome.webNavigation.WebNavigationTransitionCallbackDetails) {
  if (details.frameType != "outermost_frame") return;
  console.log(`%c[${details.transitionType}]`, "color:white;background-color:blue;", `[${details.frameType}]`, details.url);
  if (details.transitionType != "reload") return;
  const launcher = new MadoLauncher();
  const mado = await launcher.lookup(details.tabId);
  if (!mado) return;
  await launcher.reactivate(mado.$existance!.tab!);
}
