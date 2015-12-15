"use strict";

(() => {
  var router = new Router();
  router.handle("/mado/list", MadoController.GetList);
  Server.me().listen(router);
})();
