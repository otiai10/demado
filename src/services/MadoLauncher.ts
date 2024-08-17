import Dashboard from "../models/Dashboard";
import Mado from "../models/Mado";
import ScriptService from "./ScriptService";
import TabService from "./TabService";
import WindowService from "./WindowService";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const BROWSER_CONTEXT_SESSION_KEY = `demado_${chrome.runtime.id}_id`;
const BROWSER_CONTEXT_SESSION_VALUE_DRAFT = "__DEMADO_DRAFT__";
interface framesize { w: number; h: number; }

export default class MadoLauncher {

  constructor(
    private windows: WindowService,
    private tabs: TabService,
    private scripting: ScriptService,
  ) { }

  private sleepMsForLaunch = 1000;

  public dashboard = {
    open: async () => {
      const tabs = await this.tabs.query({ url: chrome.runtime.getURL("index.html") });
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].url?.endsWith("#dashboard")) {
          await this.windows.focus(tabs[i].windowId!);
          return;
        }
      }
      const dashboard = await Dashboard.user();
      await this.windows.create(chrome.runtime.getURL("index.html#dashboard"), dashboard.toCreateData());
    },
  }

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
    const { outer, inner } = await this.scripting.execute<{ outer: framesize, inner: framesize }>(tab.id!, function (ext, k, id) {
      sessionStorage.setItem(k, id);
      setInterval(() => chrome.runtime.sendMessage(ext, {
        _act_: "/mado/position:track", id, position: { x: window.screenX, y: window.screenY, },
      }), 10 * 1000);
      return { outer: { w: window.outerWidth, h: window.outerHeight }, inner: { w: window.innerWidth, h: window.innerHeight } };
    }, [chrome.runtime.id, BROWSER_CONTEXT_SESSION_KEY, mado._id || BROWSER_CONTEXT_SESSION_VALUE_DRAFT]);
    await this.windows.resizeBy(win.id!, this.considerBazel(outer, inner, mado));
    await this.scripting.offset(tab.id!, mado.offset);
    await this.scripting.style(tab.id!, mado.stylesheet);
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
    // {{{ chrome API で ドメインのみのURLではエラーが出るため、URLの最後にスラッシュを追加する
    const u = new URL(mado.url);
    const url = (u.pathname == "/" && !mado.url.endsWith("/")) ? mado.url + "/" : mado.url;
    // }}}
    const tabs = await this.tabs.query({ url })
    if (!tabs || tabs.length === 0) return null;
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      if ((await this.tabs.query({ windowId: tab.windowId })).length > 1) continue; // ウィンドウ内に他のタブがある場合はdemadoではない
      if (!(await this.identify(tab, mado))) continue; // セッションストレージに同一のMado IDがない場合は今開こうとしているmadoではない
      const win = await this.windows.get(tab.windowId!, { populate: true });
      return { win, tab, mado };
    }
    return null;
  }

  private async identify(tab: chrome.tabs.Tab, mado: Mado): Promise<boolean> {
    const id = await this.scripting.execute(tab.id!, function (k) {
      return sessionStorage.getItem(k);
    }, [BROWSER_CONTEXT_SESSION_KEY]);
    if (id == mado._id) return true;
    return false; // セッションストレージにIDがない場合はdemadoではない
  }

  async mute(mado: Mado, muted: boolean = true): Promise<void> {
    const exists = await this.exists(mado);
    if (!exists) return;
    await this.tabs.mute(exists.tab.id!, muted);
  }
}