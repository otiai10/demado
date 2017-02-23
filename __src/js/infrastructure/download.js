"use strict";

class Download {
  constructor(fname, opt, mod) {
    this.opt = opt || {
      filename: fname,
      // saveAs: true,
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
  static zp(s, digit, padding) {
    s = String(s);
    digit = digit || 2;
    padding = padding || "0";
    for (var i = 0; i < digit; i++) {
      s = padding + s;
    }
    return s.slice(s.length - digit);
  }
  static getFileName(prefix) {
    var zp = Download.zp;
    prefix = (prefix) ? prefix + "_" : "";
    var d = new Date();
    return prefix + d.getFullYear() + zp(d.getMonth() + 1) + zp(d.getDate()) + "_" + zp(d.getHours()) + zp(d.getMinutes());
  }
}
