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
        type: mado.addressbar ? 'normal' : 'popup',
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
    delete this.registry[tabId];
    return true;
  }
  /**
   * tabs.onRemovedだけで削除しきれないケースが？どうやら？あるっぽい？ので？
   * 若干冗長なんだけど、
   * windows.onRemovedでも一応スイープしてあげる
   */
  unlaunchAllInWindow(winId) {
    Object.keys(this.registry).map(tabId => {
      if (this.registry[tabId] && this.registry[tabId].tab.windowId == winId) this.unlaunch(tabId);
    });
  }
  has(tabId) {
    return this.registry[tabId];
  }

  /**
   * 現在のwindowがLauncherのコンテキストにある場合はentryを返す。
   */
  context() {
    return new Promise((resolve, reject) => {
      chrome.tabs.getAllInWindow(null, tabs => {
        if (tabs.length == 0) return reject();
        const entry = this.has(tabs[0].id);
        return entry ? resolve(entry) : reject();
      });
    });
  }

  /**
   * すべてにMado設定を受けて、tabなどをpopulateしてEntryを返す。
   * もちろんこのLauncherインスタンスで管理していないものには、tabなどが無いEntryを返す。
   */
  populate(mados) {
    // Object.values使ってたらChrome54以上じゃないと動かない
    const entries = Object.keys(this.registry).map(key => this.registry[key]).reduce((self, entry) => {
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
