
export default class TabService {
  constructor(
        private readonly mod: typeof chrome.tabs = chrome.tabs,
  ) { }

  public zoom: {
        set: (tabId: number, zoomFactor: number) => Promise<void>,
        get: (tabId: number) => Promise<number>,
    } = {
      set: async (tabId: number, zoomFactor: number | string) => {
        console.log("Setting zoom factor to", tabId, zoomFactor);
        await this.mod.setZoomSettings(tabId, { scope: "per-tab" });
        return await this.mod.setZoom(tabId, parseFloat(zoomFactor as string));
      },
      get: (tabId: number) => this.mod.getZoom(tabId),
    }
}