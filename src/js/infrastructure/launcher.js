"use strict";

class Launcher {
  constructor(context) {
    this.context = context;
  }
  static launch(mado) {
    chrome.windows.create({
      url: mado.url,
      width: mado.bounds.size.w,
      height: mado.bounds.size.h,
      left: mado.position.left,
      top: mado.position.top,
      type: "popup"
    });
  }
  static of(context) {
    return new this(context);
  }
  modify(mado) {
    var styles = this.context.document.getElementsByTagName("body")[0].getAttribute("style") || "";
    styles += "position:fixed;";
    styles += "left:-"+mado.bounds.offset.x+"px;";
    styles += "top:-"+mado.bounds.offset.y+"px;";
    this.context.document.getElementsByTagName("body")[0].setAttribute("style", styles);
  }
}
