var dmd = dmd || {};
dmd.routes = function(path) {
  switch (path) {
    case "/registry:list":
    return function(req, sender, respond) {
      respond(dmd.repository("registry").getAll());
    };
    case "/registry:get":
    return function(req, sender, respond) {
      if (dmd.repository("config").get("disabled")) return respond(null);
      var base = (sender.url || "").split(/[?#]/)[0];
      respond(dmd.repository("registry").get(base));
    };
    case "/registry:open":
    return function(req, sender, respond) {
      console.log(req);
      dmd.windowManager.open(req.params);
    };
    default:
    return function(req) {
      console.info("not found for request path: ", req.path);
    };
  }
};
