/**
 * 登録済みMadoが開かれた窓であるときに用いる修飾
 */
export default class AppDecorator {
  constructor(context, client) {
    this.context = context;
    this.client  = client;
    // これ大事！！
    this.context.document.body.style.position = 'relative';
  }
  decorate({entry}) {
    this.context.document.body.style.left = `-${entry.mado.offset.left}px`;
    this.context.document.body.style.top  = `-${entry.mado.offset.top}px`;
    this.resize(entry.mado.zoom);
  }
  resize(zoom) {
    const innerWidth  = Math.floor(this.context.innerWidth * zoom);
    const innerHeight = Math.floor(this.context.innerHeight * zoom);
    this.context.resizeBy(
      this.context.outerWidth -  innerWidth,
      this.context.outerHeight - innerHeight,
    );
  }
}
