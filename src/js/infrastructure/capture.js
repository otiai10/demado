"use strict";

class Capture {
  constructor(winID, mod) {
    this.winID = winID;
    this.mod = mod || chrome;
  }
  static window(winID) {
    return new this(winID);
  }
  photo(option) {
    option = option || {
      format: "png"
    };
    return new Promise((res, rej) => {
      this.mod.tabs.captureVisibleTab(this.winID, option, (dataURL) => {
        if (!dataURL) return rej({data: dataURL, option: option});
        res({data: dataURL, option: option});
      });
    });
  }
}
