
export default class Time {
  constructor() {
    this.d = new Date();
  }
  static new() {
    return new this();
  }
  // もう名前考えるのつかれた
  xxx(joint = '') {
    return [
      `${this.d.getFullYear()}`,
      `${this._pad(this.d.getMonth() + 1)}`,
      `${this._pad(this.d.getDate())}`,
      `${this._pad(this.d.getHours())}`,
      `${this._pad(this.d.getMinutes())}`,
    ].join(joint);
  }
  _pad(orig, digits = 2, padding = '0') {
    for (let i = 0; i < digits; i++) {
      orig = padding + orig;
    }
    return orig.slice(-1 * digits);
  }
}
