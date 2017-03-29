import React, {Component} from 'react';
import Config from '../../models/Config';

export default class SettingsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prisc: Config.find('use-prisc'),
    };
  }
  _checked(name, modelname, ev) {
    this.state[name].update({value:ev.target.checked});
    this.setState({[name]:Config.find(modelname)});
  }
  render() {
    return (
      <div>
        <table className="table">
          <tbody>
            <tr>
              <td>
                <input
                  id="use-prisc" type="checkbox"
                  checked={this.state.prisc.value}
                  onChange={this._checked.bind(this, 'prisc', 'use-prisc')}
                />
              </td>
              <th><label htmlFor="use-prisc">スクショはPriscで開く</label></th>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
