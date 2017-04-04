import React, {Component,PropTypes} from 'react';
import {Stepper,Step} from 'react-bulma-stepper';

import cn from 'classnames';

import URLInputForm         from './URLInputForm';
import MadoConfigureWaiting from './MadoConfigureWaiting';
import NameConfirmationForm from './NameConfirmationForm';
import ImportMadoDialog     from '../ImportMadoDialog';

export default class NewMadoConfigureDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      draft: null,
      importing: false,
    };
    this.startDraftObservation();
  }
  // これ苦しいですねー
  startDraftObservation() {
    this.observe = setInterval(() => {
      const draft = localStorage.getItem('draft');
      if (draft) {
        window.focus(); // これ必要ないかも？
        clearInterval(this.observe);
        this.onDraftCreated(JSON.parse(draft));
        localStorage.removeItem('draft');
      }
    },700);
  }
  onDraftCreated(draft) {
    this.setState({step:3, draft: {...this.state.draft, ...draft}});
  }
  getMoreModal() {
    return (
      <div className={cn('modal', this.state.importing ? 'is-active' : null)}>
        <ImportMadoDialog
          close={() => this.props.close()}
          commit={draft => this.setState({importing:false, draft, step: 3})}
        />
      </div>
    );
  }
  getSectionForStep() {
    switch(this.state.step) {
    case 1: return (
      <URLInputForm
        {...this.props}
        stepTo={step => this.setState({step})}
        setDraft={draft => this.setState({draft})}
      />
    );
    case 2: return (
      <MadoConfigureWaiting
        draft={this.state.draft}
      />
    );
    case 3: return (
      <NameConfirmationForm
        client={this.props.client}
        draft={this.state.draft}
      />
    );
    default: return (<h1 className="title">おっぱい</h1>);
    }
  }
  render() {
    return (
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">新しい窓設定を追加</p>
          <button className="delete" onClick={this.props.close}></button>
        </header>
        <section className="modal-card-body">
          <div className="content">
            <Stepper step={this.state.step}>
              <Step step={1} title={'対象URLを指定'}/>
              <Step step={2} title={'窓のほうで微調整'}/>
              <Step step={3} title={'名前をつけて登録'}/>
            </Stepper>
          </div>
          <section className="content">
            {this.getSectionForStep()}
          </section>
        </section>
        <footer className="modal-card-foot">
          <a
            className="button" onClick={() => this.setState({importing:true})}
            disabled={this.state.step == 3}
            >
            <i className="fa fa-file-code-o" style={{marginRight:'8px'}} />
            <span>設定をインポート</span>
          </a>
        </footer>
        {this.getMoreModal()}
      </div>
    );
  }
  static propTypes = {
    client: PropTypes.object.isRequired,
    close:  PropTypes.func.isRequired,
  }
}
