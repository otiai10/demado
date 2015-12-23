"use strict";

class CaptureController {
  static GetCapture(req, sender, sendResponse) {
    Capture.window().photo().then((res) => {
      ConfigStore.local().get("use-prisc").then((use) => {
        if (!use.value) return Promise.reject();
        Message.to(Const.prisc).send("open/edit", {params: {imgURI: res.data}});
        return Promise.resolve();
      }).catch((err) => {
        // download directly
        var fname = Download.getFileName() + "." + res.option.format;
        Download.name(fname).save(res.data, true);
      });
    });
  }
}
