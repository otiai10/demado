"use strict";

class MadoController {
  static GetList(req, sender, sendResponse) {
    MadoStore.local().all().then((list) => {
      sendResponse({
        status: "ok",
        list: list
      });
    }).catch((err) => {
      sendResponse({
        status: "internal",
        error: err
      });
    });
  }
  static Launch(req, sender, sendResponse) {
    Launcher.blank().launch(req.mado).then((win) => {
      var tabID = win.tabs[0].id;
      var id = setInterval(() => {
        TabMessage.to(tabID).send({mado: req.mado}).then((res) => {
          if (res && res.status == "ok" && res.count > 10) {
            console.log("[launch ok]", "tab", tabID, "interval", id);
            clearInterval(id);
          }
        });
      }, 2000);
      console.log("[launching]", "tab", tabID, "interval", id);
      sendResponse({status:"ok", win: win});
    }).catch((err) => {
      sendResponse({status:"intenal", error: err});
    })
  }
}
