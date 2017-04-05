import React, {Component} from 'react';
import {Client} from 'chomex';

import MadoEntryRow from '../components/popup/MadoEntryRow';

export default class PopupView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
    };
    this.client = new Client(chrome.runtime);
  }
  componentDidMount() {
    this.client.message('/mado/entries').then(({entries}) => this.setState({entries}));
  }
  getIcons() {
    if (this.state.entries.length == 0) {
      return <h1 className="title is-5" style={{cursor:'pointer',textAlign:'center'}} onClick={() => window.open('/html/configs.html')}>＋</h1>;
    }
    return (
      <div style={{display:'flex'}}>
        <div style={{flex:1,display:'flex'}}>
          <span className="title is-5" style={{cursor:'pointer'}} onClick={() => window.open('/html/configs.html')}>
          ＋
          </span>
        </div>
        <div style={{flex:1,display:'flex', justifyContent:'flex-end'}}>
          <span className="title is-5" style={{cursor:'pointer'}} onClick={() => this.client.message('/dashboard:open')}>
            <i className="fa fa-th-list" />
          </span>
        </div>
      </div>
    );
  }
  render() {
    return (
      <section className="section" style={{padding: '32px 16px 16px 16px'}}>
        <div className="container">
          <div className="columns">
            {this.state.entries.map((entry, i) => <MadoEntryRow key={i} entry={entry} client={this.client} refresh={() => window.close()} />)}
          </div>
        </div>
        <div className="container" style={{paddingTop:'16px'}}>
          {this.getIcons()}
        </div>
      </section>
    );
  }
}
