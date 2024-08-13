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
}