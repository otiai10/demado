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
  static to(extID) {
    return new this(extID);
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
  static listen(listener, mod) {
    mod = mod || chrome;
    mod.runtime.onMessage.addListener((req, sender, sendResponse) => {
      listener(req, sender, sendResponse);
      return true;
    });
  }
  static onMessage(mod) {
    mod = mod || chrome;
    return new Promise((resolve) => {
      mod.runtime.onMessage.addListener((req, sender, sendResponse) => {
        req.sender = sender;
        req.response = sendResponse;
        resolve(req);
      });
    });
  }
}
