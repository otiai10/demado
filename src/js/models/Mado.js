import {Model} from 'chomex';
import yaml from 'js-yaml';
import demal from 'demal';

export default class Mado extends Model {
  toExportalDEMAL() {
    return demal.serialize({
      s: {w: this.size.width,  h: this.size.height},
      o: {l: this.offset.left, t: this.offset.top},
      z: this.zoom,
      u: this.url.replace(/\./g, '^'),
    });
  }
  static fromExportalYAML(yamlstring) {
    const obj = yaml.load(yamlstring);
    return Mado.new({
      url:    obj.u.replace(/\s+.*$/, ''),
      size:   {width: obj.s.w, height: obj.s.h},
      offset: {left: obj.o.l, top: obj.o.t},
      zoom:   obj.z,
      position: {x:10,y:10},
    });
  }
  static fromExportalDEMAL(demalstring) {
    const obj = demal.parse(demalstring).json();
    return Mado.new({
      url:    obj.u.trim().replace(/\^/g, '.'),
      size:   {width: obj.s.w, height: obj.s.h},
      offset: {left: obj.o.l, top: obj.o.t},
      zoom:   obj.z,
      position: {x:10,y:10},
    });
  }
  static schema = {
    name: Model.Types.string.isRequired,
    url:  Model.Types.string.isRequired,
    zoom: Model.Types.number.isRequired,
    // 窓サイズ
    size: Model.Types.shape({
      width:  Model.Types.number.isRequired,
      height: Model.Types.number.isRequired,
    }).isRequired,
    // 窓コンテンツのずれ
    offset: Model.Types.shape({
      left: Model.Types.number.isRequired,
      top:  Model.Types.number.isRequired,
    }),
    // ディスプレイに対するLaunchPosition
    position: Model.Types.shape({
      x: Model.Types.number.isRequired,
      y: Model.Types.number.isRequired,
    }).isRequired,
    // アドレスバー表示
    addressbar: Model.Types.bool,
    // 高度なDOM操作
    advanced: Model.Types.shape({
      remove: Model.Types.string, // 削除対象のDOMセレクタ
    }),
  }
  static template = {
    zoom:       1,
    size:       {width:200,height:100},
    offset:     {left:0,top:0},
    position:   {x:10,y:10},
    addressbar: false,
    advanced:   {},
  }
  static nextID = Model.sequentialID
}
