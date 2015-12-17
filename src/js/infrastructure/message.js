"use strict";

var chrome = chrome || {};

class Message {
  constructor(extID, mod) {
    this.extID = extID;
    this.mod = mod || chrome;
  }
  send(path, params) {
    params = params || {};
    params.path = path;
    return new Promise((resolve, reject) => {
      this.mod.runtime.sendMessage(this.extID, params, (res) => {
        if (res.status != "ok") return reject(res);
        return resolve(res);
      });
    });
  }
  static me() {
    return new this(null);
  }
}

class TabMessage {
  constructor(tabID, mod) {
    this.tabID = tabID;
    this.mod = mod || chrome;
  }
  send(params) {
    params = params || {};
    return new Promise((resolve, reject) => {
      this.mod.tabs.sendMessage(this.tabID, params, (res) => {
        resolve(res);
      });
    });
  }
  static to(tabID) {
    return new this(tabID);
  }
  static listen(cb, mod) {
    mod = mod || chrome;
    mod.runtime.onMessage.addListener(cb);
  }
}
