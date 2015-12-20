"use strict";

class CaptureController {
  static GetCapture(req, sender, sendResponse) {
    Capture.window().photo().then((res) => {
      ConfigStore.local().get("use-prisc").then((use) => {
        if (!use) return Promise.reject();
        Message.to(Const.prisc).send("open/edit", {params: {imgURI: res.data}});
      }).catch((err) => {
        // download directly
        var fname = "ファイル名" + "." + res.option.format;
        Download.name(fname).save(res.data, true);
      });
    });
  }
}
