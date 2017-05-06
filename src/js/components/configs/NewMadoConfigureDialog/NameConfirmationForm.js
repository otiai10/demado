import React,{Component,PropTypes} from 'react';
import cn from 'classnames';

export default class NameConfirmationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
  }
  render() {
    const d = this.props.draft;
    return (
      <div>
        <div className="columns">
          <div className="column">
            <table className="table">
              <tbody>
                <tr>
                  <th>URL</th>
                  <td colSpan="4">{d.url}</td>
                </tr>
                <tr>
                  <th>窓のサイズ</th>
                  <th>横幅</th><td>{d.size.width}</td>
                  <th>縦幅</th><td>{d.size.height}</td>
                </tr>
                <tr>
                  <th>ズレ</th>
                  <th>左右</th><td>{d.offset.left}</td>
                  <th>上下</th><td>{d.offset.top}</td>
                </tr>
                <tr>
                  <th>ズーム</th>
                  <td colSpan="4">{d.zoom}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="columns">
          <div className="column is-8">
            <input type="text" className="input"
              onChange={ev => this.setState({name:ev.target.value})}
              value={this.state.name}
            />
          </div>
          <div className="column is-4">
            <a
              className={cn('button', 'is-primary', {
                'is-disabled': this.state.name == ''
              })}
              onClick={() => {
                let draft = {
                  ...this.props.draft,
                  name: this.state.name,
                  advanced: {},
                };
                delete draft['action'];
                this.props.client.message('/mado/configure:upsert', draft)
                .then(() => location.reload())
                .catch(err => {
                  window.alert(`窓設定の作成に失敗しました\n\n${err.status}: ${err.message}\n\nいい感じのエラーハンドリングUIは追い追い作っていくので、今のところは、はじめからやり直してください。すみません(>_<)`);
                  location.reload();
                });
              }}
            >登録</a>
          </div>
        </div>
      </div>
    );
  }
  static propTypes = {
    draft:  PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
  }
}
