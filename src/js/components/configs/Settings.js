import React, {Component} from 'react';
import Config from '../../models/Config';

export default class SettingsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beforeunload: Config.find('ask-before-unload'),
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
                  id="ask-before-unload" type="checkbox"
                  checked={this.state.beforeunload.value}
                  onChange={this._checked.bind(this, 'beforeunload', 'ask-before-unload')}
                />
              </td>
              <th><label htmlFor="ask-before-unload">窓を閉じるとき確認ダイアログを表示する</label></th>
            </tr>
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
