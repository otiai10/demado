"use strict";

(() => {
  var router = new Router();
  router.handle("/mado/list", MadoController.GetList);
  router.handle("/page/onresize", PageController.SaveTempSize);
  router.handle("/page/onresize/draw", PageController.GetTempSize);
  Server.me().listen(router);
})();
