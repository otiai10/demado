import React, {Component} from 'react';

import {Client} from 'chomex';

import cn from 'classnames';

import Mado from '../models/Mado';
import MadoConfigTile         from '../components/configs/MadoConfigTile';
import NewMadoConfigureDialog from '../components/configs/NewMadoConfigureDialog';

import '../components/configs/main.css';

export default class ConfigsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: null,
    };
    this.client = new Client(chrome.runtime);
    // だるいしここでやるわ
    document.querySelector('#demado-version').innerHTML = 'version ' + chrome.runtime.getManifest().version;
  }

  // {{{ TODO: このへんマジで後方互換性のためだけのものなのでほとぼりが冷めたら消す
  componentDidMount() {
    this._applyOldStorage();
  }
  _getOldStorage() {
    const str = window.localStorage.getItem('demado.app');
    if (str) return JSON.parse(str);
    else return null;
  }
  _applyOldStorage() {
    const old = this._getOldStorage();
    if (!old) return;
    this.setState({modal: (
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
          <a className="button is-success" onClick={() => this.onClickImport(old)}>インポートする</a>
          <a className="button is-danger">削除しちゃう</a>
          <a className="button" onClick={() => this.setState({modal:null})}>いまはしない</a>
        </footer>
      </div>
    )});
  }
  onClickImport(old) {
    Object.keys(old).map(key => old[key]).map(m => {
      let mado = Mado.new({
        url:  m.url,
        name: m.name,
        size: {
          width:  m.bounds.size.w,
          height: m.bounds.size.h,
        },
        offset: {
          left: m.bounds.offset.x,
          top:  m.bounds.offset.y,
        },
        position: {
          x: m.position.left,
          y: m.position.top,
        },
        zoom: m.zoom,
      });
      mado.save();
    });
    window.localStorage.removeItem('demado.app');
  }
  // }}}

  showMadoJSON(mado) {
    this.setState({modal: (
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">「{mado.name}」の設定をエクスポート</p>
          <button className="delete" onClick={() => this.setState({modal:null})}></button>
        </header>
        <section className="modal-card-body">
          <pre><code className="code">{mado.toExportalYAML()}</code></pre>
        </section>
      </div>
    )});
  }

  getModal() {
    return (
      <div className={cn('modal', {'is-active':!!this.state.modal})}>
        <div className="modal-background"></div>
        {this.state.modal}
      </div>
    );
  }

  getNewMadoModal() {
    return (
      <NewMadoConfigureDialog
        client={this.client}
        close={() => this.setState({modal:null})}
      />
    );
  }

  getMadoTiles() {
    return Mado.list().map(mado => <MadoConfigTile mado={mado} key={mado._id} showMadoJSON={this.showMadoJSON.bind(this)} />);
  }

  getPlusIcon() {
    return (
      <span
        className={cn({empty: Mado.list().length == 0})}
        style={{cursor:'pointer'}}
        onClick={() => this.setState({modal: this.getNewMadoModal()})}
      >＋</span>
    );
  }

  render() {
    return (
      <section className="section">
        <h1 className="title">demadoの設定 {this.getPlusIcon()}</h1>
        <div className="columns is-multiline">
          {this.getMadoTiles()}
        </div>
        {this.getModal()}
      </section>
    );
  }
}
