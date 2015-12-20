"use strict";

(() => {
  var m = new Router();
  m.handle("/mado/list", MadoController.GetList);
  m.handle("/page/onresize", PageController.SaveTempSize);
  m.handle("/page/onresize/draw", PageController.GetTempSize);
  m.handle("/page/positiontracking", PageController.PositionTracking);
  Server.me().listenMessage(m);

  var c = new Router();
  c.handle("capture", CaptureController.GetCapture);
  Server.me().listenCommand(c);
})();
