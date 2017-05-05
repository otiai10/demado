import React, {Component,PropTypes} from 'react';

export default class AdvancedConfigDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressbar: this.props.mado.addressbar ? true : false,
      advanced:   this.props.mado.advanced || {remove:''},
    };
  }
  render() {
    const {mado} = this.props;
    return (
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">「{mado.name}」の高度な設定</p>
          <button className="delete" onClick={this.props.close}></button>
        </header>
        <section className="modal-card-body">
          <div className="columns is-mobile">
            <div className="column is-4">
              <b>アドレスバーを表示する</b>
            </div>
            <div className="column is-8">
              <input type="checkbox" checked={this.state.addressbar} className="checkbox" onChange={ev => this.setState({addressbar:ev.target.checked})}/>
            </div>
          </div>
          <div className="columns">
            <div className="column is-12">
              <b>DOM操作</b>
              <div className="columns is-mobile">
                <div className="column is-2 is-offset-2"><b>削除</b></div>
                <div className="column is-8">
                  <input
                    type="text" className="input"
                    placeholder="例) nav.navbar-fixed-top"
                    value={this.state.advanced.remove || ''}
                    onChange={ev => this.setState({advanced: {...this.state.advanced, remove: ev.target.value}})}
                  />
                  <p className="help">スラッシュ区切りのCSSセレクタを指定してください。querySelector(s).remove()をします。</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          {/* FIXME: 窓リストをstateにして、setStateでrerenderするようにしたい */}
          <button className="button" onClick={() => this.props.mado.update(this.state) && location.reload()}>保存</button>
        </footer>
      </div>
    );
  }
  static propTypes = {
    mado: PropTypes.object.isRequired,
    close: PropTypes.func.isRequired,
  }
}
