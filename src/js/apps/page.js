"use strict";
(() => {
  Message.me().send("/mado/list").then((res) => {
    for (var key in res.list) {
      if (key == location.href) {
        var mado = res.list[key];
        Launcher.of(window).modify(mado);
      }
    }
  }).catch((err) => {
    console.error("demado.error", err);
  });
})();
