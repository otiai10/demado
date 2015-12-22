"use strict";

class Launcher {
  constructor(context, winID, mod) {
    this.context = context;
    this.winID = winID;
    this.mod = mod || chrome;
  }
  open(params) {
    return new Promise((resolve, reject) => {
      this.mod.windows.create(params, (win) => {
        resolve(win);
      });
    });
  }
  launch(mado) {
    return new Promise((resolve, reject) => {
      this.mod.windows.create({
        url: mado.url,
        width: mado.bounds.size.w,
        height: mado.bounds.size.h,
        left: mado.position.left,
        top: mado.position.top,
        type: "popup"
      }, (win) => {

        // allow async
        this.mod.tabs.setZoomSettings(win.tabs[0].id, {
          mode: 'automatic', scope: 'per-tab', defaultZoomFactor: 1
        }, () => {
          setTimeout(() => {
            this.mod.tabs.setZoom(win.tabs[0].id, mado.zoom, (tab) => {
              resolve(win);
            });
          }, 1000);
        });

        resolve(win);
      });
    });
  }
  update(params) {
    return new Promise((resolve, reject) => {
      this.mod.windows.update(this.winID, {
        width: params.width,
        height: params.height
      }, (win) => {
        resolve(win);
      });
    });
  }
  zoom(factor) {
    return new Promise((res) => {
      this.mod.tabs.getAllInWindow(this.winID, (tabs) => {
        this.mod.tabs.setZoom(tabs[0].id, factor, () => {
          res(tabs[0]);
        });
      });
    });
  }
  close() {
    return new Promise((res) => {
      if (!this.winID) return res();
      this.mod.windows.remove(this.winID, () => {
        res();
      });
    });
  }
  focus() {
    return new Promise((res) => {
      if (!this.winID) return res();
      this.mod.windows.update(this.winID, {focused: true}, (win) => {
        res(win);
      });
    });
  }
  onRemoved() {
    return new Promise((res) => {
      this.mod.windows.onRemoved.addListener((winID) => {
        res(winID);
      });
    });
  }
  static of(context) {
    return new this(context);
  }
  static blank() {
    return new this();
  }
  static chrome(winID) {
    return new this(null, winID);
  }
  static find(query) {
    var launcher = new Launcher();
    query = query || {};
    query.windowType = "popup";
    return new Promise((resolve, reject) => {
      launcher.mod.tabs.query(query, (tabs) => {
        if (!tabs || tabs.length == 0) return reject();
        return resolve(tabs[0]);
      });
    });
  }
  getCurrentWindow() {
    return new Promise((res) => {
      this.mod.windows.getCurrent({populate:true}, (win) => {
        res(win);
      });
    });
  }
  static toggleMute(tabID, mod) {
    mod = mod || chrome;
    return new Promise((resolve, reject) => {
      mod.tabs.get(tabID, (tab) => {
        if (!tab) return reject();
        mod.tabs.update(tab.id, {muted: !tab.mutedInfo.muted}, (tab) => {
          resolve(tab);
        });
      });
    });
  }
  modify(bounds) {
    var styles = this.context.document.getElementsByTagName("body")[0].getAttribute("style") || "";
    styles += "position:fixed;";
    styles += "left:-"+bounds.offset.x+"px;";
    styles += "top:-"+bounds.offset.y+"px;";
    this.context.document.getElementsByTagName("body")[0].setAttribute("style", styles);
    return Promise.resolve();
  }
}
