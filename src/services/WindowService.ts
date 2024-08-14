import Mado from "../models/Mado";

export default class WindowService {
  constructor(
        private readonly mod: typeof chrome.windows = chrome.windows,
  ) { }

  create(url: string, options: chrome.windows.CreateData): Promise<chrome.windows.Window> {
    return this.mod.create({ url, ...options });
  }

  open(mado: Mado): Promise<chrome.windows.Window> {
    return this.create(mado.url, {
      type: mado.addressbar ? "normal" : "popup",
      left: mado.position.x,
      top: mado.position.y,
      width: mado.size.width * mado.zoom,
      height: mado.size.height * mado.zoom,
    });
  }

  resizeBy(windowId: number, size: { w: number | string, h: number | string }): Promise<chrome.windows.Window> {
    return new Promise(resolve => {
      this.mod.get(windowId, { populate: true }, (win) => {
        this.mod.update(windowId, {
          width: win.width! + parseInt(size.w as string),
          height: win.height! + parseInt(size.h as string),
        }, resolve);
      });
    });
  }

  get(windowId: number, getInfo: chrome.windows.QueryOptions): Promise<chrome.windows.Window> {
    return new Promise(resolve => this.mod.get(windowId, getInfo, resolve));
  }
}