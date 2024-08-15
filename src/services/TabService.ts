
export default class TabService {
  constructor(
    private readonly mod: typeof chrome.tabs = chrome.tabs,
  ) { }

  public zoom: {
    set: (tabId: number, zoomFactor: number) => Promise<void>,
    get: (tabId: number) => Promise<number>,
  } = {
      set: async (tabId: number, zoomFactor: number | string) => {
        await this.mod.setZoomSettings(tabId, { scope: "per-tab" });
        return await this.mod.setZoom(tabId, parseFloat(zoomFactor as string));
      },
      get: (tabId: number) => this.mod.getZoom(tabId),
    }

  query(queryInfo: chrome.tabs.QueryInfo): Promise<chrome.tabs.Tab[]> {
    return new Promise(resolve => this.mod.query(queryInfo, resolve));
  }

  mute(tabId: number, muted: boolean = true): Promise<chrome.tabs.Tab | undefined> {
    return new Promise(resolve => this.mod.update(tabId, { muted }, resolve));
  }
  unmute(tabId: number): Promise<chrome.tabs.Tab | undefined> {
    return this.mute(tabId, false);
  }

  capture(windowId: number, options: chrome.tabs.CaptureVisibleTabOptions = { quality: 1, format: "png" }): Promise<string> {
    return this.mod.captureVisibleTab(windowId, options);
  }
}