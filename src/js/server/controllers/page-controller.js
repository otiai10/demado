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
}
