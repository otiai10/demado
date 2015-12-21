"use strict";

class Storage {
  constructor(area) {
    this.area = area || chrome.storage.local;
  }
  static local() {
    return new this();
  }
  get(key) {
    return new Promise((resolve) => {
      this.area.get(key, (res) => {
        resolve(res);
      });
    });
  }
  clear() {
    return new Promise((resolve) => {
      this.area.clear(() => {
        resolve();
      });
    });
  }
}
