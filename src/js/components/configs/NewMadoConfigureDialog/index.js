import React, {Component,PropTypes} from 'react';
import {Stepper,Step} from 'react-bulma-stepper';

import cn from 'classnames';

class URLInputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: 'http://www.dmm.com/netgame/social/-/gadgets/=/app_id=750145/',
    };
  }
  render() {
    return (
      <div>
        <div className="columns">
          <div className="column is-8">
            <input
              type="url" className="input"
              onChange={ev => this.setState({url:ev.target.value})}
              value={this.state.url}
            />
          </div>
          <div className="column is-4">
            <a className={cn('button', 'is-primary', {
              'is-disabled': this.state.url == ''
            })} onClick={() => {
              this.props.client.message('/mado/configure', {
                url: this.state.url,
              });
            }}>このURLを開く</a>
          </div>
        </div>
      </div>
    );
  }
  static propTypes = {
    client: PropTypes.object.isRequired,
  }
}

export default class NewMadoConfigureDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
    };
  }
  getSectionForStep() {
    switch(this.state.step) {
    case 1: return <URLInputForm {...this.props}/>;
    default: <h1 className="title">おっぱい</h1>;
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
              <Step step={1} title={'URLを指定'}/>
              <Step step={2} title={'窓のほうで微調整'}/>
              <Step step={3} title={'登録'}/>
            </Stepper>
          </div>
          <section className="content">
            {this.getSectionForStep()}
          </section>
        </section>
        <footer className="modal-card-foot">
          <a className="button" onClick={this.props.close}>いまはしない</a>
        </footer>
      </div>
    );
  }
  static propTypes = {
    client: PropTypes.object.isRequired,
    close:  PropTypes.func.isRequired,
  }
}
