import Mado from "../models/Mado";
import ScriptService from "./ScriptService";
import TabService from "./TabService";
import WindowService from "./WindowService";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
interface framesize { w: number; h: number; }

export default class MadoLauncher {

  constructor(
        private windows: WindowService,
        private tabs: TabService,
        private scripting: ScriptService,
  ) { }

  private sleepMsForLaunch = 1000;

  async launch(mado: Mado): Promise<chrome.windows.Window> {
    const win = await this.windows.open(mado);
    // TODO: Bazel対応
    await sleep(this.sleepMsForLaunch);
    const tab = win.tabs![0];
    await this.tabs.zoom.set(tab.id!, mado.zoom);
    const { outer, inner } = await this.scripting.execute<{ outer: framesize, inner: framesize }>(tab.id!, () => {
      return { outer: { w: window.outerWidth, h: window.outerHeight }, inner: { w: window.innerWidth, h: window.innerHeight } };
    });
    await this.windows.resizeBy(win.id!, this.considerBazel(outer, inner, mado));
    await this.scripting.offset(tab.id!, mado.offset);
    return win;
  }

  // どのくらいのサイズでリサイズするかを決める
  considerBazel(outer: framesize, inner: framesize, mado: Mado): framesize {
    return { w: outer.w - (inner.w * mado.zoom), h: outer.h - (inner.h * mado.zoom) };
  }

  /**
   * 単一Windowの中に、単一のTabが存在する場合、これはdemadoによって生成されたものと判断する.
   * 厳密に正しくはないが、しょうがないね.
   * もっと厳密にやるなら、demadoが生成したページのコンテキストにscriptingでsessionStorageかなんかに、mado._idを埋め込むとかだろうか.
   * @param mado 
   * @returns 
   */
  async exists(mado: Mado): Promise<{ win: chrome.windows.Window, tab: chrome.tabs.Tab, mado: Mado } | null> {
    const tabs = await this.tabs.query({ url: mado.url })
    if (tabs.length === 0) return null;
    const results = tabs.map(async tab => {
      const siblings = await this.tabs.query({ windowId: tab.windowId })
      if (siblings.length !== 1) return null;
      const win = await this.windows.get(tab.windowId!, { populate: true });
      return { win, tab, mado };
    }).filter(Boolean);
    return results.length === 0 ? null : results[0];
  }
}