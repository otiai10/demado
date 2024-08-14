import Mado from "../models/Mado";

export default class CaptureService {
  constructor(
    private readonly tabs: typeof chrome.tabs = chrome.tabs,
    private readonly downloads: typeof chrome.downloads = chrome.downloads,
  ) { }

  private static datetime(now = new Date()): string {
    // "YYYY-MMDD-HHmmss" format with zero padding
    return [
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
    ].map(n => n.toString().padStart(2, "0")).join("");
  }

  async capture(mado: Mado, options: chrome.tabs.CaptureVisibleTabOptions = { quality: 1, format: "png" }): Promise<string> {
    const url = await this.tabs.captureVisibleTab(mado.$existance!.win.id!, options);
    const filename = "demado" + "/" + mado.displayName() + "/" + CaptureService.datetime() + "." + options.format;
    await this.downloads.download({ url, filename });
    return filename;  
  }
}