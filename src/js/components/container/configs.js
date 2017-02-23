import React, {Component} from 'react';
import cn from 'classnames';

export default class ConfigsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: null,
    };
  }

  // {{{ TODO: このへんマジで後方互換性のためだけのものなのでほとぼりが冷めたら消す
  componentDidMount() {
    this._applyOldStorage();
  }
  _getOldStorage() {
    // {{{ XXX: Debug
    const dummy_old_database = '{"https://ponpon-pa.in/":{"url":"https://ponpon-pa.in/","name":"ポンペ","bounds":{"offset":{"x":10,"y":0},"size":{"w":485,"h":375}},"position":{"left":3,"top":23},"zoom":1},"http://game.granbluefantasy.jp/#mypage":{"url":"http://game.granbluefantasy.jp/#mypage","name":"グラブル","bounds":{"offset":{"x":0,"y":0},"size":{"w":640,"h":855}},"position":{"left":442,"top":23},"zoom":1},"http://www.dmm.com/netgame/social/-/gadgets/=/app_id=750145/":{"url":"http://www.dmm.com/netgame/social/-/gadgets/=/app_id=750145/","name":"ガールズシンフォニー","bounds":{"offset":{"x":0,"y":0},"size":{"w":1300,"h":738}},"position":{"left":37,"top":62},"zoom":1}}';
    // }}}
    const str = window.localStorage.getItem('demado.app');
    if (str) return JSON.parse(str);
    else return JSON.parse(dummy_old_database);
  }
  _applyOldStorage() {
    const old = this._getOldStorage();
    if (!old) return;
    this.setState({modal:
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">古い設定が見つかりました</p>
          <button className="delete" onClick={() => this.setState({modal:null})}></button>
        </header>
        <section className="modal-card-body">
          <ul>{Object.keys(old).map(id => {
            return <li key={id}><b>{old[id].name}</b>: {old[id].url}</li>;
          })}</ul>
        </section>
        <footer className="modal-card-foot">
          <a className="button is-success">インポートする</a>
          <a className="button is-danger">削除しちゃう</a>
          <a className="button" onClick={() => this.setState({modal:null})}>いまはしない</a>
        </footer>
      </div>
    });
  }
  // }}}

  getModal() {
    return (
      <div className={cn('modal', {'is-active':!!this.state.modal})}>
        <div className="modal-background"></div>
        {this.state.modal}
      </div>
    );
  }
  render() {
    return (
      <section className="section">
        <h1 className="title">demadoの設定</h1>
        {this.getModal()}
      </section>
    );
  }
}
