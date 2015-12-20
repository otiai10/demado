"use strict";

class Download {
  constructor(fname, opt, mod) {
    this.opt = opt || {
      filename: fname,
      saveAs: true,
      method: "GET"
    };
    this.mod = mod || chrome;
  }
  static name(fname) {
    return new this(fname);
  }
  save(url, show) {
    this.opt.url = url;
    return new Promise((res, rej) => {
      this.mod.downloads.download(this.opt, (id) => {
        if (show) this.mod.downloads.show(id);
        return res(id);
      });
    });
  }
}
