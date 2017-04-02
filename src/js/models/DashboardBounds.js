import {Model} from 'chomex';

export default class DashboardBounds extends Model {
  static common() {
    return this.find(0);
  }
  static nextID = Model.sequentialID
  static scheme = {
    size: Model.Types.shape({
      width:  Model.Types.number.isRequired,
    }).isRequired,
    position: Model.Types.shape({
      x: Model.Types.number.isRequired,
      y: Model.Types.number.isRequired,
    }).isRequired,
  }
  static default = {
    0: {
      size:     {width: 330},
      position: {x: 100, y: 100},
    }
  }
}
