/**
 * 実際つくられる窓のエントリインスタンス
 */
class MadoEntry {
  constructor(mado, tab, win) {
    this.mado  = mado;
    this.tab   = tab;
    this.winId = win.id;
  }
}
/**
 * 実際つくられる窓をオンメモリで管理するやつ
 */
export default class MadoLauncher {
  constructor() {
    this.registry = {};
  }
  launch(mado) {
    return new Promise(resolve => {
      chrome.windows.create({
        url: mado.url,
        type: 'popup',
        width: parseInt(mado.size.width   * mado.zoom),
        height: parseInt(mado.size.height * mado.zoom),
        left: mado.position.left,
        top: mado.position.top,
      }, win => {
        const entry = this.register(mado, win.tabs[0], win);
        resolve(entry);
      });
    });
  }
  register(mado, tab, win) {
    const entry = new MadoEntry(mado, tab, win);
    this.registry[tab.id] = entry;
    return entry;
  }
  has(tabId) {
    return this.registry[tabId];
  }
  static __instance = null
  static sharedInstance() {
    if (this.__instance == null) {
      this.__instance = new this();
    }
    return this.__instance;
  }
}
