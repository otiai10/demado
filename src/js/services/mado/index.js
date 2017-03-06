
export class MadoConfigureManager {
  static instance = null;
  static sharedInstance(opt = {}) {
    if (this.instance == null) {
      this.instance = new this(opt);
    }
    return this.instance;
  }
  constructor(opt = {}) {
    this.url      = opt.url      || '';
    this.position = opt.position || {x: 10, y: 10};
    this.size     = opt.size     || {width: 800, height: 480};
    // empty
    this.target   = {};
  }
  open() {
    return (new Promise((resolve, reject) => {
      chrome.tabs.query({
        url: this.url,
      }, tabs => {
        if (!tabs || !tabs.length) return reject();
        this.target = tabs[0];
        resolve(tabs[0]);
      });
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
  hasTarget(tabId) {
    console.log('hasTarget', this.target, tabId);
    return this.target && this.target.id == tabId;
  }
}
