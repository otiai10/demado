
export class MadoConfigureManager {
  static instance = null;
  static sharedInstance() {
    if (this.instance == null) {
      this.instance = new this();
    }
    return this.instance;
  }
  constructor() {
    this.target = {};
  }
  open(opt) {
    this.url      = opt.url      || '';
    this.position = opt.position || {x: 100, y: 100};
    this.size     = opt.size     || {width: 520, height: 360};

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
    return this.target && this.target.id == tabId;
  }
}
