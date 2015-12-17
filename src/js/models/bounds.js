"use strict";

class Bounds {
  constructor(x, y, w, h) {
    this.offset = {
      x: x,
      y: y
    };
    this.size = {
      w: w,
      h: h
    };
  }
}

class Position {
  constructor(left, top) {
    this.left = left;
    this.top = top;
  }
}
