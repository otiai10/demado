"use strict";

class Launcher {
  constructor(context, winID, mod) {
    this.context = context;
    this.winID = winID;
    this.mod = mod || chrome;
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
    console.log(factor);
    return new Promise((res) => {
      this.mod.tabs.getAllInWindow(this.winID, (tabs) => {
        this.mod.tabs.setZoom(tabs[0].id, factor, () => {
          res(tabs[0]);
        });
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
  modify(bounds) {
    var styles = this.context.document.getElementsByTagName("body")[0].getAttribute("style") || "";
    styles += "position:fixed;";
    styles += "left:-"+bounds.offset.x+"px;";
    styles += "top:-"+bounds.offset.y+"px;";
    this.context.document.getElementsByTagName("body")[0].setAttribute("style", styles);
    return Promise.resolve();
  }
}
