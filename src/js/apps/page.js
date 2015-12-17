"use strict";
(() => {
  var mado = null;
  Message.me().send("/mado/list").then((res) => {
    for (var key in res.list) {
      if (key == location.href) {
        mado = res.list[key];
        return Launcher.of(window).modify(mado.bounds);
      }
    }
  }).then(() => {
    window.onresize = (ev) => {
      Message.me().send("/page/onresize", {
        w: window.innerWidth,
        h: window.innerHeight
      });
    };
    return Promise.resolve();
  }).then(() => {
    TabMessage.listen((req, sender, res) => {
      if (!req.bounds) return res({msg:"invalid"});
      // adjust offset
      Launcher.of(window).modify(req.bounds);
      return res({msg:"ok"});
    });
    return Promise.resolve();
  }).then(() => {
    window.setInterval(() => {
      Message.me().send("/page/positiontracking", {
        id: mado.url,
        left: window.screenX,
        top: window.screenY
      });
    }, 10 * 1000);
  });
})();
