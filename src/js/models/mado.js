"use strict";

class Mado {
  constructor(url, name) {
    this.url = url;
    this.name = name;
    this.bounds = new Bounds(10, 10, 400, 120);
  }
  id() {
    return this.url;
  }
  static decode(obj) {
    var mado = new Mado(obj.url, obj.name);
    mado.bounds = new Bounds(
      obj.bounds.offset.x,
      obj.bounds.offset.y,
      obj.bounds.size.w,
      obj.bounds.size.h
    );
    return mado;
  }
}

class MadoStore extends KVS {
  constructor(storage) {
    super(storage, "app", Mado.decode);
  }
  static local() {
    return new this(window.localStorage);
  }
}
