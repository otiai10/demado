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
      setTimeout(() => {
        TabMessage.to(win.tabs[0].id).send({mado: req.mado});
      }, 1000);
      sendResponse({status:"ok", win: win});
    }).catch((err) => {
      sendResponse({status:"intenal", error: err});
    })
  }
}
