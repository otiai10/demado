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
  decorate({entry, configs}) {
    this._infix(entry);
    this._resize(entry);
    this._advanced(entry.mado);
    this._generally(configs);
  }
  /**
   * 窓コンテンツの座標を固定化する処理
   */
  _infix(entry = this.entry) {
    if (!entry) return console.log('窓固定するためにエントリが無い');
    this.context.document.body.style.left = `-${entry.mado.offset.left}px`;
    this.context.document.body.style.top  = `-${entry.mado.offset.top}px`;
    this.context.document.querySelector('html').style.overflow = 'hidden'; // スクロールバー消す
  }
  /**
   * 窓の外枠の大きさを調整する処理
   * アドレスバー表示の場合、高さのdiffが綺麗に取れないので、backgroundに任せる。
   */
  _resize(entry) {
    if (entry.decorated) return; // 窓枠の大きさは、窓内遷移した場合は無視すべき
    const zoom = entry.mado.zoom;
    const innerWidth  = Math.floor(this.context.innerWidth * zoom);
    const innerHeight = Math.floor(this.context.innerHeight * zoom);
    this.client.message('/mado:resize-by', {
      w: this.context.outerWidth -  innerWidth,
      h: this.context.outerHeight - innerHeight,
    }).then(() => this._infix()); // XXX: デバイスによっては、リサイズ後にoverflow:hiddenが無効になっている
  }
  /**
   * 高度なDOM操作などの調整をする処理
   */
  _advanced(mado) {
    if (!mado.advanced) return;
    (mado.advanced.remove || '').split('/').map(selector => {
      const target = this.context.document.querySelector(selector.trim());
      if (target && typeof target.remove == 'function') target.remove();
    });
  }
  /**
   * その他の、窓の個別設定に依存しない処理
   */
  _generally(configs) {
    this.context.onbeforeunload = () => configs.onbeforeunload ? true : null;
    this.interval = this.context.setInterval(() => {
      this.client.message('/mado/position:update', {
        x: this.context.screenX,
        y: this.context.screenY,
      });
    }, 30*1000); // 30秒おきにポジションを記憶
  }
}
