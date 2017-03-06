class Offseter {

}
class Resizer {

}

export default class ConfigureDecorator {
  constructor(context) {
    this.context  = context;
    this.offseter = new Offseter();
    this.resizer  = new Resizer();
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
    container.style.padding         = '36px';
    container.appendChild(this.getResizer(doc));
    container.appendChild(this.getOffseter(doc));
    container.appendChild(this.getZoomer(doc));
    return container;
  }
  getResizer(doc) {
    let rows = doc.createElement('div');
    let title = doc.createElement('h2');
    title.innerHTML = '画面の大きさ（size）';
    rows.appendChild(title);
    let r1 = doc.createElement('div');
    r1.innerHTML = '<p>横幅 <span>−</span> <span>＋</span></p>';
    rows.appendChild(r1);
    let r2 = doc.createElement('div');
    r2.innerHTML = '<p>縦幅 <span>−</span> <span>＋</span></p>';
    rows.appendChild(r2);
    return rows;
  }
  getOffseter(doc) {
    let rows = doc.createElement('div');
    let title = doc.createElement('h2');
    title.innerHTML = '画面のズレ（offset）';
    rows.appendChild(title);
    let r1 = doc.createElement('div');
    r1.innerHTML = '<p>左右 <span>−</span> <span>＋</span></p>';
    rows.appendChild(r1);
    let r2 = doc.createElement('div');
    r2.innerHTML = '<p>上下 <span>−</span> <span>＋</span></p>';
    rows.appendChild(r2);
    return rows;
  }
  getZoomer(doc) {
    let rows = doc.createElement('div');
    let title = doc.createElement('h2');
    title.innerHTML = '画面の倍率（zoom）';
    rows.appendChild(title);
    let r1 = doc.createElement('div');
    r1.innerHTML = '<p>倍率 <span>−</span> <span>＋</span></p>';
    rows.appendChild(r1);
    return rows;
  }
}
