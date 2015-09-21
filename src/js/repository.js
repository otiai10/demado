var dmd = dmd || {};
dmd.repository = function(ns, defs) {
  var rootNS = "dmd";
  var repo = function(namespace, defaults) {
    this.namespace = [rootNS, namespace].join(".");
    this.defaults = defaults || {};
  };
  repo.prototype.getAll = function() {
    var ns = this.namespace;
    return JSON.parse(window.localStorage.getItem(ns) || '{}');
  };
  repo.prototype.setAll = function(all) {
    var ns = this.namespace;
    window.localStorage.setItem(JSON.stringify(all));
  };
  repo.prototype.get = function(key) {
    var all = this.getAll();
    return (all[key] !== undefined) ? all[key] : this.defaults[key];
  };
  repo.prototype.set = function(key, val) {
    var all = this.getAll();
    all[key] = val;
    this.setAll(all);
  };
  return new repo(ns, defs);
};
