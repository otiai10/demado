"use strict";

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
