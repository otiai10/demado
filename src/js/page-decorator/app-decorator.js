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
    // this.context.onbeforeunload = () => {
    //   return true;
    // };
    this.interval = this.context.setInterval(() => {
      this.client.message('/mado/position:update', {
        x: this.context.screenX,
        y: this.context.screenY,
      });
    }, 30*1000); // 30秒おきにポジションを記憶
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
