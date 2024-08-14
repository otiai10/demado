import Mado from "../models/Mado";
import ScriptService from "./ScriptService";
import TabService from "./TabService";
import WindowService from "./WindowService";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const BROWSER_CONTEXT_SESSION_KEY = "dmd_launcer_id";
interface framesize { w: number; h: number; }

export default class MadoLauncher {

  constructor(
        private windows: WindowService,
        private tabs: TabService,
        private scripting: ScriptService,
  ) { }

  private sleepMsForLaunch = 1000;

  async launch(mado: Mado): Promise<chrome.windows.Window> {
    // {{{ すでにlaunch済みなら、focusして終了
    const exists = await this.exists(mado);
    if (exists) {
      this.windows.focus(exists.win.id!);
      return exists.win;
    } // }}}
  
    const win = await this.windows.open(mado);
    await sleep(this.sleepMsForLaunch); // FIXME: onloadが終わるまで待つ
    const tab = win.tabs![0];
    await this.tabs.zoom.set(tab.id!, mado.zoom);
    const { outer, inner } = await this.scripting.execute<{ outer: framesize, inner: framesize }>(tab.id!, function (k, v) {
      sessionStorage.setItem(k, v);
      return { outer: { w: window.outerWidth, h: window.outerHeight }, inner: { w: window.innerWidth, h: window.innerHeight } };
    }, [BROWSER_CONTEXT_SESSION_KEY, mado._id]);
    await this.windows.resizeBy(win.id!, this.considerBazel(outer, inner, mado));
    await this.scripting.offset(tab.id!, mado.offset);
    return win;
  }

  // どのくらいのサイズでリサイズするかを決める
  considerBazel(outer: framesize, inner: framesize, mado: Mado): framesize {
    return { w: outer.w - (inner.w * mado.zoom), h: outer.h - (inner.h * mado.zoom) };
  }

  /**
   * @param mado 
   * @returns 
   */
  async exists(mado: Mado): Promise<{ win: chrome.windows.Window, tab: chrome.tabs.Tab, mado: Mado } | null> {
    const tabs = await this.tabs.query({ url: mado.url })
    if (tabs.length === 0) return null;
    const results = tabs.map(async tab => {
      if ((await this.tabs.query({ windowId: tab.windowId })).length > 1) return null; // ウィンドウ内に他のタブがある場合はdemadoではない
      if (!(await this.identify(tab, mado))) return null; // demadoが生成したtabでない場合はdemadoではない
      const win = await this.windows.get(tab.windowId!, { populate: true });
      return { win, tab, mado };
    }).filter(Boolean);
    return results.length === 0 ? null : results[0];
  }

  private async identify(tab: chrome.tabs.Tab, mado: Mado): Promise<boolean> {
    const id = await this.scripting.execute(tab.id!, function (k) {
      return sessionStorage.getItem(k);
    }, [BROWSER_CONTEXT_SESSION_KEY]);
    if (id == mado._id) return true;
    return false; // セッションストレージにIDがない場合はdemadoではない
  }
}