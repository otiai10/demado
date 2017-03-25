/**
 * 実際つくられる窓のエントリインスタンス
 */
class MadoEntry {
  constructor(mado, tab, win = {}) {
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
  focus(winId) {
    return new Promise(resolve => {
      chrome.windows.update(winId, {focused: true}, resolve);
    });
  }
  launch(mado) {
    return new Promise(resolve => {
      chrome.windows.create({
        url: mado.url,
        type: 'popup',
        width: parseInt(mado.size.width   * mado.zoom),
        height: parseInt(mado.size.height * mado.zoom),
        left: mado.position.x,
        top:  mado.position.y,
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
  unlaunch(tabId) {
    const entry = {...this.registry[tabId]};
    delete this.registry[tabId];
    return entry;
  }
  has(tabId) {
    return this.registry[tabId];
  }

  /**
   * すべてにMado設定を受けて、tabなどをpopulateしてEntryを返す。
   * もちろんこのLauncherインスタンスで管理していないものには、tabなどが無いEntryを返す。
   */
  populate(mados) {
    const entries = Object.values(this.registry).reduce((self, entry) => {
      self[entry.mado._id] = entry;
      return self;
    }, {});
    return mados.map(mado => {
      return entries[mado._id] ? entries[mado._id] : new MadoEntry(mado);
    });
  }

  /**
   * tabの情報が変わることがあるので、それを更新するやつ
   */
  update(tab) {
    if (this.registry[tab.id]) this.registry[tab.id].tab = tab;
  }

  static __instance = null
  static sharedInstance() {
    if (this.__instance == null) {
      this.__instance = new this();
    }
    return this.__instance;
  }
}
