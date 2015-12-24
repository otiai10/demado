"use strict";

// http://qiita.com/ConquestArrow/items/ec291d09ace0cb8008e1
var _registry = {};
class Cache {
  static set(key, value, expire) {
    expire = expire || 60; // 60秒
    if (_registry[key]) {
      clearTimeout(_registry[key].id);
    }
    _registry[key] = {
      value: value,
      expire: expire,
      id: setTimeout(() => {
        delete _registry[key];
      }, expire * 1000)
    };
    return Promise.resolve(Object.create(_registry[key]));
  }
  static get(key) {
    if (!_registry[key]) return;
    return _registry[key].value;
  }
  static delete(key) {
    return delete _registry[key];
  }
  static draw(key) {
    var val = Cache.get(key);
    Cache.delete(key);
    return val;
  }
}
