"use strict";

class ConfigController {
  static GetConfig(req, sender, sendResponse) {
    ConfigStore.local().get(req.key).then((conf) => {
      sendResponse({
        status: "ok",
        config: conf
      });
    }).catch((err) => {
      sendResponse({
        status: "not found",
        error: err
      });
    });
  }
  static GetConfigList(req, sender, sendResponse) {
    ConfigStore.local().all().then((list) => {
      sendResponse({
        status: "ok",
        configs: list
      });
    });
  }
}
