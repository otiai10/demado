"use strict";

class Config {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
  id() {
    return this.key;
  }
  static decode(obj) {
    return new Config(obj.key, obj.value);
  }
}

class ConfigStore extends KVS {
  constructor(storage) {
    super(storage, "config", Config.decode);
  }
  static local() {
    return new this(window.localStorage);
  }
  set(key, value) {
    return super.set(new Config(key, value));
  }
}
