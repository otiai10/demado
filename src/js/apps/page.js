"use strict";

TabMessage.listen((req, sender, res) => {
  // Accept only demado server.
  if (!req.mado) return res({msg:"invalid"});

  // adjust offset
  Launcher.of(window).modify(req.mado.bounds);
  res({msg:"ok"});

  // send onresize tracking for visible config
  window.onresize = (ev) => {
    console.log(screen);
    debugger;
    Message.me().send("/page/onresize", {
      w: Math.floor(window.innerWidth * req.mado.zoom),
      h: Math.floor(window.innerHeight * req.mado.zoom)
    });
  };

  // send position tracking for launcher position
  window.setInterval(() => {
    Message.me().send("/page/positiontracking", {
      id: req.mado.url,
      left: window.screenX,
      top: window.screenY
    });
  }, 5 * 1000);

  window.onbeforeunload = () => {
    return "demadoからの確認です (๑˃̵ᴗ˂̵)و";
  };

});
