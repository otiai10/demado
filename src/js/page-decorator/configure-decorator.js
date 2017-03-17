const DOM = (doc) => (template) => {
  let tmp = doc.createElement('div');
  tmp.innerHTML = template.trim();
  return tmp.childNodes;
};

const s = {
  row:   'display:flex;margin-bottom:6px;',
  label: 'font-size:14px;margin-right:16px;',
  input: 'font-size:14px;padding:4px;border: thin solid #00c4a7;border-radius:4px;box-shadow:0 0 2px #e0e0e0 inset;margin-right:16px;',
};

/**
 * 設定用に開かれた窓であるときに用いる修飾
 */
export default class ConfigureDecorator {
  constructor(context) {
    this.context  = context;
  }
  decorate() {
    const doc = this.context.document;
    let container = this.getBackground(doc);
    let controlpanel = this.getControlPanel(doc);
    container.appendChild(controlpanel);
    doc.body.appendChild(container);
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
    return bg;
  }
  getControlPanel(doc) {
    let container = doc.createElement('div');
    container.style.backgroundColor = 'rgba(255,255,255,0.8)';
    container.style.borderRadius    = '6px';
    container.style.width           = '80%';
    container.style.height          = '60%';
    container.style.padding         = '12px 36px';
    container.style.overflowY       = 'scroll';
    container.appendChild(this.getResizer(doc));
    container.appendChild(this.getOffseter(doc));
    container.appendChild(this.getZoomer(doc));
    return container;
  }
  onSizeChange(key, ev) {
    console.log('onSizeChange', key, ev.target.value);
  }
  getResizer(doc) {
    const template = `
      <div style="${s.row}">
        <div style="flex:1">
          <span style="${s.label}">横幅</span>
          <input style="${s.input}" id="size-width"  type="number" min="10" />
        </div>
        <div style="flex:1">
          <span style="${s.label}">縦幅</span>
          <input style="${s.input}" id="size-height" type="number" min="10" />
        </div>
      </div>
    `;
    const node = DOM(doc)(template)[0];
    node.querySelector('#size-width').addEventListener('change',  this.onSizeChange.bind(this, 'width'));
    node.querySelector('#size-height').addEventListener('change', this.onSizeChange.bind(this, 'height'));
    return node;
  }
  onOffsetChange(key, ev) {
    console.log('onOffsetChange', key, ev.target.value);
  }
  getOffseter(doc) {
    const template = `
      <div style="${s.row}">
        <div style="flex:1">
          <span style="${s.label}">左右</span>
          <input style="${s.input}" id="offset-left"  type="number" min="10" />
        </div>
        <div style="flex:1">
          <span style="${s.label}">上下</span>
          <input style="${s.input}" id="offset-top" type="number" min="10" />
        </div>
      </div>
    `;
    const node = DOM(doc)(template)[0];
    node.querySelector('#offset-left').addEventListener('change', this.onOffsetChange.bind(this, 'left'));
    node.querySelector('#offset-top').addEventListener('change',  this.onOffsetChange.bind(this, 'top'));
    return node;
  }
  getZoomer(doc) {
    const template = `
      <div style="${s.row}">
        <div style="flex:1">
          <span style="${s.label}">ズーム</span>
          <input style="${s.input}" id="dmd-zoom" type="number" min="0.1" max="4" step="0.1" />
        </div>
        <div style="flex:1"></div>
      </div>
    `;
    const node = DOM(doc)(template)[0];
    return node;
  }
}
