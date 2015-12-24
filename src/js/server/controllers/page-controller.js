"use strict";

class PageController {
  static SaveTempSize(req, sender, sendResponse) {
    Promise.resolve(req.isWindows).then((isWindows) => {
      if (!isWindows) return Promise.resolve({width:req.w,height:req.h});
      return Launcher.chrome(sender.tab.windowId).getWindow();
    }).then((win) => {
      return Cache.set("pagesize."+sender.tab.id, {w:win.width, h:win.height});
    }).then((cached) => {
      sendResponse({status:"ok",saved: cached});
    }).catch((err) => {
      sendResponse({status:"internal", error: err});
    });
  }
  static GetTempSize(req, sender, sendResponse) {
    var size = Cache.draw("pagesize."+req.tabID);
    if (!size) return sendResponse({msg:"not found"});
    sendResponse({
      status:"ok",
      size: size
    });
  }
  static PositionTracking(req, sender, sendResponse) {
    MadoStore.local().get(req.id).then((mado) => {
      mado.position.left = req.left;
      mado.position.top = req.top;
      return MadoStore.local().set(mado);
    }).then((set) => {
      sendResponse({status:"ok"});
    }).catch((err) => {
      sendResponse({
        status:"internal",
        error: err
      });
    });
  }
}
