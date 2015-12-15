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
}
