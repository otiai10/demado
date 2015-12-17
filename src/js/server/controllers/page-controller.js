"use strict";

class PageController {
  static SaveTempSize(req, sender, sendResponse) {
    Cache.set("pagesize."+sender.tab.id, req);
    sendResponse({status:"ok"});
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
