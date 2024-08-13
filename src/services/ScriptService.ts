
export default class ScriptService {
  constructor(
    private readonly mod: typeof chrome.scripting = chrome.scripting,
  ) { }

  execute<T>(tabId: number, func: () => T, injectImmediately = false) {
    return this.mod.executeScript({
      target: { tabId },
      func,
      injectImmediately,
    }).then(res => res[0].result);
  }

  offset(tabId: number, offset: { left: number, top: number }): Promise<void> {
    return this.mod.insertCSS({
      target: { tabId },
      css: `
        body {
          position: relative;
          left: ${offset.left}px;
          top: ${offset.top}px;
        }
      `,
    });
  }
}