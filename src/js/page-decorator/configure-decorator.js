const DOM = (doc) => (template) => {
  let tmp = doc.createElement('div');
  tmp.innerHTML = template.trim();
  return tmp.childNodes;
};

const s = {
  row:   'display:flex;margin-bottom:6px;',
  label: 'font-size:14px;margin-right:16px;',
  input: 'font-size:14px;padding:4px;border: thin solid #00c4a7;border-radius:4px;box-shadow:0 0 2px #e0e0e0 inset;margin-right:16px;',
  button:'font-size:14px;padding:8px;border:none;border-radius:4px;background-color:#00d1b2;color:#fff;',
};

/**
 * 設定用に開かれた窓であるときに用いる修飾
 */
export default class ConfigureDecorator {
  constructor(context, client) {
    this.context = context;
    this.client  = client;
    this.context.onresize = this.onWindowResize.bind(this);

    // これ大事！！
    this.context.document.body.style.position = 'relative';
  }
  onWindowResize({target}) {
    this.resizer.querySelector('#size-width').value = target.innerWidth;
    this.resizer.querySelector('#size-height').value = target.innerHeight;
  }
  decorate({zoom}) {
    const doc = this.context.document;
    this.background = this.getBackground(doc);
    this.panel = this.getControlPanel(doc, zoom);
    this.background.appendChild(this.panel);
    doc.body.appendChild(this.background);
  }
  getBackground(doc) {
    let bg = doc.createElement('div');
    bg.style.backgroundColor = 'rgba(0,0,0,0.5)';
    bg.style.position = 'fixed';
    bg.style.left   = 0;
    bg.style.top    = 0;
    bg.style.right  = 0;
    bg.style.bottom = 0;
    bg.style.display        = 'flex';
    bg.style.alignItems     = 'center';
    bg.style.justifyContent = 'center';
    bg.style.pointerEvents  = 'none'; // 白背景など窓枠を決定できない場合、窓コンテンツをクリックできる必要がある
    return bg;
  }
  getControlPanel(doc, zoom) {
    let container = doc.createElement('div');
    container.style.backgroundColor = 'rgba(255,255,255,0.8)';
    container.style.borderRadius    = '6px';
    container.style.width           = '80%';
    container.style.height          = '60%';
    container.style.padding         = '12px 36px';
    container.style.overflowY       = 'scroll';
    container.style.pointerEvents   = 'all'; // パネルそのものはちゃんとイベント拾う
    container.appendChild(this.getResizer(doc));
    container.appendChild(this.getOffseter(doc));
    container.appendChild(this.getZoomer(doc, zoom));
    container.appendChild(this.getCommit(doc));
    return container;
  }
  onSizeChange(key, ev) {
    console.log('onSizeChange', key, ev.target.value);
  }
  getResizer(doc) {
    const {innerWidth:w, innerHeight:h} = this.context;
    const template = `
      <div>
        <p>大きさはウィンドウを直接ひっぱって調整してください</p>
        <div style="${s.row}">
          <div style="flex:1">
            <span style="${s.label}">横幅</span>
            <input style="${s.input}" value="${w}" id="size-width" disabled  type="number" min="10" />
          </div>
          <div style="flex:1">
            <span style="${s.label}">縦幅</span>
            <input style="${s.input}" value="${h}" id="size-height" disabled type="number" min="10" />
          </div>
        </div>
      </div>
    `;
    const node = DOM(doc)(template)[0];
    node.querySelector('#size-width').addEventListener('change',  this.onSizeChange.bind(this, 'width'));
    node.querySelector('#size-height').addEventListener('change', this.onSizeChange.bind(this, 'height'));
    this.resizer = node;
    return node;
  }
  onOffsetChange(key, ev) {
    // これマイナスなんだよなあ
    this.context.document.body.style[key] = `-${ev.target.value}px`;
  }
  getOffseter(doc) {
    const template = `
      <div>
        <p>ウィンドウに対するコンテンツのズレですが、大きさ変えると必要なかったりします</p>
        <div style="${s.row}">
          <div style="flex:1">
            <span style="${s.label}">左右</span>
            <input style="${s.input}" value="0" id="offset-left" min="0" type="number" />
          </div>
          <div style="flex:1">
            <span style="${s.label}">上下</span>
            <input style="${s.input}" value="0" id="offset-top" min="0" type="number" />
          </div>
        </div>
      </div>
    `;
    const node = DOM(doc)(template)[0];
    node.querySelector('#offset-left').addEventListener('change', this.onOffsetChange.bind(this, 'left'));
    node.querySelector('#offset-top').addEventListener('change',  this.onOffsetChange.bind(this, 'top'));
    return node;
  }
  getZoomer(doc, currentZoom) {
    const template = `
      <div style="${s.row}">
        <div style="flex:1">
          <span style="${s.label}">ズーム</span>
          <input style="${s.input}" value="${currentZoom}" id="dmd-zoom" type="number" min="0.1" max="4" step="0.1" />
        </div>
        <div style="flex:1"></div>
      </div>
    `;
    const node = DOM(doc)(template)[0];
    node.querySelector('#dmd-zoom').addEventListener('change', ev => {
      this.client.message('/mado/configure/zoom:update', {zoom:ev.target.value});
    });
    return node;
  }
  getCommit(doc) {
    const template = `
      <div>
        <p style="word-break:break-all;">URL: ${this.context.location.href}</p>
        <div style="${s.row}">
          <div style="flex:1">
            <button style="${s.button}" id="dmd-configure-commit">これで決定</button>
          </div>
        </div>
      </div>
    `;
    const node = DOM(doc)(template)[0];
    node.querySelector('#dmd-configure-commit').addEventListener('click', this.onCommit.bind(this));
    return node;
  }
  onCommit() {
    const dict = {
      size: {
        width:  parseInt(this.panel.querySelector('#size-width').value),
        height: parseInt(this.panel.querySelector('#size-height').value),
      },
      offset: {
        left: parseInt(this.panel.querySelector('#offset-left').value),
        top:  parseInt(this.panel.querySelector('#offset-top').value),
      },
      zoom: parseFloat(this.panel.querySelector('#dmd-zoom').value),
      position: {x:0, y:0},
    };
    this.client.message('/mado/configure:draft', dict).then(() => this.context.close());
  }
}
