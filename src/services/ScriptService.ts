
export default class ScriptService {
  constructor(
    private readonly mod: typeof chrome.scripting = chrome.scripting,
  ) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute<T>(tabId: number, func: (...args: any[]) => T, args: any[] = [], injectImmediately = false) {
    return this.mod.executeScript({
      target: { tabId },
      func, args,
      injectImmediately,
    }).then(res => res[0].result);
  }

  js(tabId: number, jsfiles: string | string[]): Promise<unknown> {
    return this.mod.executeScript({
      target: { tabId },
      files: (typeof jsfiles === "string") ? [jsfiles] : jsfiles,
    }).then(res => res[0].result);
  }

  style(tabId: number, css: string): Promise<void> {
    return this.mod.insertCSS({
      target: { tabId },
      css,
    });
  }

  offset(tabId: number, offset: { left: number, top: number }): Promise<void> {
    return this.mod.insertCSS({
      target: { tabId },
      css: `
        html {
          overflow: hidden !important;
        }
        body {
          position: relative;
          left: ${offset.left}px;
          top: ${offset.top}px;
        }
      `,
    });
  }
}