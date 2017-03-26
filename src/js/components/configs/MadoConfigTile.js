import React, {Component,PropTypes} from 'react';
import cn from 'classnames';
import {Client} from 'chomex';

export default class MadoConfigTile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mado: this.props.mado,
    };
    // TODO: これ、上からpropsで渡されたほうがいいかも？
    this.client = new Client(chrome.runtime);
  }

  _color() {
    switch(this.state.mado._id % 4) {
    case 0: return 'is-primary';
    case 1: return 'is-info';
    case 2: return 'is-success';
    case 3: return 'is-warning';
    }
  }

  onSizeChanged(key, value) {
    this.state.mado.update({size: {...this.state.mado.size, [key]:value}});
    this.setState({mado: this.state.mado});
  }

  onOffsetChanged(key, value) {
    this.state.mado.update({offset: {...this.state.mado.offset, [key]:value}});
    this.setState({mado: this.state.mado});
  }

  render() {
    const styles = {icon:{fontSize:'24px',cursor:'pointer', margin: '8px 16px 0 0'}};
    const mado = this.state.mado;
    return (
      <div className="column" key={mado._id}>
        <div className={cn('message', this._color())}>
          <div className="message-header">
            <h1>{mado.name}</h1>
          </div>
          <div className="message-body">
            <div className="columns">
              <div className="column">
                <table className="table is-narrow" style={{backgroundColor:'transparent',marginBottom:0}}>
                  <tbody id="table-nohover">
                    <tr>
                      <th>URL</th>
                      <td colSpan="4" style={{wordBreak:'break-all'}}>{mado.url}</td>
                    </tr>
                    <tr>
                      <th style={{minWidth:'106px'}}>窓のサイズ</th>
                      <th>横幅</th><td>{mado.size.width}</td>
                      <th>縦幅</th><td>{mado.size.height}</td>
                    </tr>
                    <tr>
                      <th>ズレ</th>
                      <th>左右</th><td>{mado.offset.left}</td>
                      <th>上下</th><td>{mado.offset.top}</td>
                    </tr>
                    <tr>
                      <th>ズーム</th>
                      <td colSpan="4">{mado.zoom}</td>
                    </tr>
                    <tr>
                      <th>起動位置</th>
                      <th>X</th><td>{mado.position.x}</td>
                      <th>Y</th><td>{mado.position.y}</td>
                    </tr>
                    <tr>
                      <td colSpan="5">
                        <i className="fa fa-trash is-danger"
                          style={styles.icon}
                          title="設定の削除"
                          onClick={() => {
                            if (!window.confirm(`「${mado.name}」を削除しますか？`)) return;
                            this.client.message('/mado:delete', mado).then(() => location.reload());
                          }}
                        />
                        <i className="fa fa-file-code-o"
                          style={styles.icon}
                          title="設定のエクスポート"
                          onClick={() => this.props.showMadoJSON(mado)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  static propTypes = {
    mado: PropTypes.shape({
      _id:  PropTypes.any.isRequired,
      name: PropTypes.string.isRequired,
      url:  PropTypes.string.isRequired,
      size: PropTypes.object.isRequired,
    }).isRequired,
    showMadoJSON: PropTypes.func.isRequired,
  }
}
