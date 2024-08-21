import Dashboard from "../models/Dashboard";
import Mado from "../models/Mado";
import PermissionService from "./PermissionService";
import ScriptService from "./ScriptService";
import TabService from "./TabService";
import WindowService from "./WindowService";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const BROWSER_CONTEXT_SESSION_KEY = `demado_${chrome.runtime.id}_id`;

export enum LaunchMode {
  DEFAULT = "default", // 通常の窓
  PREVIEW = "preview", // 試しに開いてみるやつ
  DYNAMIC = "dynamic", // 画面内設定の窓
}

export default class MadoLauncher {

  constructor(
    private windows: WindowService = new WindowService(),
    private tabs: TabService = new TabService(),
    private scripting: ScriptService = new ScriptService(),
    private permission: PermissionService = new PermissionService(),
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

  async launch(
    mado: Mado,
    mode: LaunchMode = LaunchMode.DEFAULT,
  ): Promise<chrome.windows.Window> {
    const exists = await this.retrieve(mado);
    if (exists && mode == LaunchMode.DEFAULT) {
      // すでにlaunch済みなら、focusして終了
      this.windows.focus(exists.win.id!);
      return exists.win;
    }
    if (exists && (mode == LaunchMode.PREVIEW || mode == LaunchMode.DYNAMIC)) {
      this.windows.close(exists.win.id!);
    }

    const win = await this.windows.open(mado);
    const tab = win.tabs![0];
    await sleep(this.sleepMsForLaunch); // FIXME: onloadが終わるまで待つ

    // まず自分のIDをセッションストレージに保存してもらう
    await this.scripting.execute(tab.id!, function (ext, id, mode) {
      sessionStorage.setItem(`demado_${ext}_id`, id);
      sessionStorage.setItem(`demado_${ext}_mode`, mode);
    }, [chrome.runtime.id, mado._id, mode]);

    // 次に、セッションストレージに保存されたIDなどを使っていろいろする
    await this.scripting.js(tab.id!, "content-script.js");

    if (mode == LaunchMode.DYNAMIC) {
      // 何らかの方法で現在の設定値をページに継承しなければならない
      await this.scripting.execute(tab.id!, function (portablestr) {
        // FIXME: ここのkeyはどこかに定義しないとdynamic-confg.jsとの整合性があぶない
        sessionStorage.setItem("demado_default_config_value", portablestr);
      }, [JSON.stringify(mado.export())]);
      await this.scripting.js(tab.id!, "dynamic-config.js");
    }

    return win;
  }

  // タブIDからMadoを逆引きする
  async lookup(tabId: number): Promise<Mado | null> {
    try {
      const id = await this.scripting.execute(tabId, function (k) {
        return sessionStorage.getItem(k);
      }, [BROWSER_CONTEXT_SESSION_KEY]);
      if (!id) return null;
      const mado = await Mado.find(id);
      await mado?.hydrate(this);
      return mado;
    } catch (e) {
      return null;
    }
  }


  /**
   * retrieve は、指定されたMadoが既に開かれているかどうかを確認し、
   * 開かれている場合はそのウィンドウとタブを返します
   * @param mado 
   * @returns 
   */
  async retrieve(mado: Mado): Promise<{ win: chrome.windows.Window, tab: chrome.tabs.Tab, mado: Mado } | null> {
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
    const existance = await this.retrieve(mado);
    if (!existance) return;
    await this.tabs.mute(existance.tab.id!, muted);
  }

  async permitted(mado: Mado): Promise<boolean> {
    return (await this.permission.contains(mado.url) !== null);
  }
}