import {Model} from 'chomex';

export default class Mado extends Model {
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
  }
  static template = {
    zoom:     1,
    size:     {width:200,height:100},
    offset:   {left:0,top:0},
    position: {x:10,y:10}
  }
  static nextID = Model.sequentialID
}
