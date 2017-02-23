"use strict";

// TabMessage.listen((req, sender, res) => {
(() => {
  var count = 0;
  TabMessage.listen((req, sender, sendResponse) => {

    // Accept only demado server.
    if (!req.mado) return sendResponse({status:"invalid"});

    count++;

    // adjust offset
    Launcher.of(window).modify(req.mado.bounds);
    sendResponse({
      status:"ok",
      count: count
    });

    // send onresize tracking for visible config
    window.onresize = (ev) => {
      Message.me().send("/page/onresize", {
        w: Math.floor(window.innerWidth * req.mado.zoom),
        h: Math.floor(window.innerHeight * req.mado.zoom),
        isWindows: (window.navigator.userAgent.indexOf("Win") > 0)
      });
    };

    // send position tracking for launcher position
    window.setInterval(() => {
      Message.me().send("/page/positiontracking", {
        id: req.mado.url,
        left: window.screenX,
        top: window.screenY
      }).catch((err) => { /* console.log("[demado.003]", err) */ });
    }, 5 * 1000);

    Message.me().send("/config", {key: "close-alert"}).then((res) => {
      if (res.config && res.config.value == true) {
        window.onbeforeunload = () => {
          return "demadoからの確認です (๑˃̵ᴗ˂̵)و";
        };
      }
    }).catch((err) => { console.log("[demado.002]", err)});

  });
})();
