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
  getResetIcon() {
    if (Mado.list().length == 0) return null;
    return (
      <span
        style={{color:'#dfdfdf',cursor:'pointer',float:'right'}}
        onClick={() => {
          if (window.confirm('全削除しますか？') && window.confirm(`マジで全削除しますか？\n\n${Mado.list().map(mado => '- ' + mado.name).join('\n')}`)) {
            Mado.drop();
            location.reload();
          }
        }}
        >
        <i className="fa fa-trash-o" />
      </span>
    );
  }

  render() {
    return (
      <section className="section">
        <h1 className="title">demadoの設定 {this.getPlusIcon()} {this.getResetIcon()}</h1>
        <div className="columns is-multiline">
          {this.getMadoTiles()}
        </div>
        {this.getModal()}
      </section>
    );
  }
}
