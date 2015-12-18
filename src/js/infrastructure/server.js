"use strict";

class Server {
  constructor(mod) {
    this.mod = mod || chrome;
  }
  static me() {
    return new this();
  }
  listenMessage(router) {
    this.mod.runtime.onMessage.addListener((req, sender, sendResponse) => {
      var controller = router.routes[req.path];
      if (!controller) controller = router.notfound;
      controller(req, sender, sendResponse);
      return true;
    });
  }
}

class Router {
  constructor() {
    this.routes = {};
  }
  handle(path, controller) {
    this.routes[path] = controller;
  }
  notfound(req, sender, sendResponse) {
    sendResponse({
      status: "not found"
    });
  }
}
