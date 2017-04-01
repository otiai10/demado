
export class MadoConfigureManager {
  static instance = null;
  static sharedInstance(clean = false) {
    if (clean || this.instance == null) {
      this.instance = new this();
    }
    return this.instance;
  }
  constructor() {
    this.target = {};
  }
  open(mado) {
    if (mado._id) this.mado = mado;
    this.url      = mado.url      || '';
    this.position = mado.position || {x: 100, y: 100};
    this.size     = this._ensureSize() || {width: 520, height: 360};
    return (new Promise((resolve, reject) => {
      chrome.tabs.query({
        url: this.url,
      }, tabs => {
        if (!tabs || !tabs.length) return reject();
        this.target = tabs[0];
        resolve(tabs);
      });
    }).then(tabs => {
      if (window.confirm('このURLで開かれているタブを一度すべて閉じる必要があります。閉じちゃっていいですか？')) {
        return new Promise((resolve, reject) => {
          chrome.tabs.remove(tabs.map(tab => tab.id), reject);
        });
      } else {
        return Promise.resolve(tabs[0]);
      }
    })).catch(() => {
      return new Promise(resolve => {
        chrome.windows.create({
          url:    this.url,
          left:   this.position.x,
          top:    this.position.y,
          width:  this.size.width,
          height: this.size.height,
          type:   'popup',
        }, win => {
          this.target = win.tabs[0];
          resolve(win.tabs[0]);
        });
      });
    });
  }
  _ensureSize() {
    if (!this.mado) return null;
    return {
      width:  parseInt(this.mado.size.width * this.mado.zoom),
      height: parseInt(this.mado.size.height * this.mado.zoom),
    };
  }
  has(tabId) {
    return this.target && this.target.id == tabId ? this : null;
  }
}
