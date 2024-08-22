
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

  public options = {
    find: async () => {
      const tabs = await this.mod.query({ url: chrome.runtime.getURL("index.html") });
      const found: chrome.tabs.Tab[] = [];
      for (let i = 0; i < tabs.length; i++) {
        try {
          const url = new URL(tabs[i].url!);
          if (url.hash === "#options" || url.hash === "#/options") {
            found.push(tabs[i]);
          }
        } catch (e) {
          continue;
        }
      }
      return found;
    },
    open: async (params: Record<string, unknown> = {}) => {
      const url = new URL(chrome.runtime.getURL("index.html"));
      url.search = new URLSearchParams(params as Record<string, string>).toString();
      url.hash = "#options";
      return await this.mod.create({ url: url.toString(), active: true });
    },
    reopen: async (params: Record<string, unknown> = {}) => {
      const tabs = await this.options.find();
      await this.mod.remove(tabs.map(tab => tab.id!));
      return await this.options.open(params);
    },
  }

  public async get(tabId: number): Promise<chrome.tabs.Tab | undefined> {
    return new Promise(resolve => this.mod.get(tabId, resolve));
  }
}