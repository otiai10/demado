"use strict";

class Mado {
  constructor(url, name) {
    this.url = url;
    this.name = name;
    this.bounds = new Bounds(10, 10, 400, 120);
    this.position = new Position(100, 100);
    this.zoom = 1;
  }
  id() {
    return this.url;
  }
  static decode(obj) {
    var mado = new Mado(obj.url, obj.name);
    obj.bounds = obj.bounds || {};
    mado.bounds = new Bounds(
      obj.bounds.offset.x,
      obj.bounds.offset.y,
      obj.bounds.size.w,
      obj.bounds.size.h
    );
    obj.position = obj.position || {};
    mado.position = new Position(
      obj.position.left || 100,
      obj.position.top || 100
    );
    mado.zoom = obj.zoom || 1;
    return mado;
  }
  static createFromLegacy(obj) {
    try {
      var mado = new Mado(obj.url, obj.name);
      mado.position = new Position(parseInt(obj.widget.position.left), parseInt(obj.widget.position.top));
      mado.bounds = new Bounds(
        parseInt(obj.widget.offset.left), parseInt(obj.widget.offset.top),
        parseInt(obj.widget.size.width), parseInt(obj.widget.size.height)
      );
      return mado;
    } catch (e) { /* nice catch!! */ }
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
