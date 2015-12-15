"use strict";

class KVS {
  constructor(storage, namespace, decode) {
    this.storage = storage;
    this.namespace = "demado." + namespace;
    this.decode = decode;
  }
  all() {
    return new Promise((resolve, reject) => {
      var raw = this.storage.getItem(this.namespace) || '{}';
      try {
        var list = JSON.parse(raw);
        for (var key in list) {
          if (!list.hasOwnProperty(key)) continue;
          list[key] = this.decode(list[key]);
        }
        resolve(list);
      } catch (e) {
        reject(e);
      }
    });
  }
  get(id) {
    return new Promise((resolve, reject) => {
      this.all().then((all) => {
        if (all[id]) return resolve(all[id]);
        return reject("not found");
      }).catch((err) => {
        return reject(err);
      });
    });
  }
  set(model) {
    return new Promise((resolve, reject) => {
      this.all().then((all) => {
        all[model.id()] = model;
        this.storage.setItem(this.namespace, JSON.stringify(all));
        resolve(all);
      }).catch((err) => { return reject(err); });
    });
  }
  remove(model) {
    return new Promise((resolve, reject) => {
      this.all().then((all) => {
        delete all[model.id()];
        this.storage.setItem(this.namespace, JSON.stringify(all));
        resolve(model);
      }).catch((err) => { return reject(err); });
    });
  }
}
