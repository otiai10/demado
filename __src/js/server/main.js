"use strict";

(() => {
  var m = new Router();
  m.handle("/mado/list", MadoController.GetList);
  m.handle("/mado/launch", MadoController.Launch);
  m.handle("/mado/capture", MadoController.Capture);
  m.handle("/page/onresize", PageController.SaveTempSize);
  m.handle("/page/onresize/draw", PageController.GetTempSize);
  m.handle("/page/positiontracking", PageController.PositionTracking);
  m.handle("/config", ConfigController.GetConfig);
  m.handle("/config/list", ConfigController.GetConfigList);
  Server.me().listenMessage(m);

  var c = new Router();
  c.handle("capture", CaptureController.GetCapture);
  c.handle("mute", MuteController.ToggleMuted);
  Server.me().listenCommand(c);

  var exRouter = new Router();
  exRouter.handle("/mado/launch/external", MadoController.ExternalLaunch);
  Server.me().listenExternalMessage(exRouter);
})();
