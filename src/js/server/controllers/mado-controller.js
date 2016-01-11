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
  static ExternalLaunch(req, sender, sendResponse) {
    MadoStore.local().all().then((list) => {
      for (let key in list) {
        if (req.url.match(list[key].url)) return Promise.resolve(list[key]);
      }
      return Promise.reject("not found in demado config");
    }).then((mado) => {
      req.mado = mado;
      mado.url = req.url; // ここで開くURLをリクエストURLに変える
      return Launcher.blank().launch(mado);
    }).then((win) => {
      sendResponse({
        status: "ok",
        mado: req.mado
      });
    }).catch((err) => {
      sendResponse({
        status: "error",
        message: err
      });
    });
  }
  static Capture(req, sender, sendResponse) {
    if (!req.win) return sendResponse({status:"missing arg `win`"});
    Capture.window(req.win).photo().then((res) => {
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
    sendResponse({status:"ok"});
  }
}
