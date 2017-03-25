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
  render() {
    return (
      <section className="section" style={{padding: '32px 16px 16px 16px'}}>
        <div className="container">
          <div className="columns">
            {this.state.entries.map((entry, i) => <MadoEntryRow key={i} entry={entry} client={this.client} />)}
          </div>
        </div>
        <div className="container" style={{paddingTop:'16px'}}>
          <h1
            className="title is-5"
            style={{textAlign:'center',cursor:'pointer'}}
            onClick={() => window.open('/html/configs.html')}
            >＋</h1>
        </div>
      </section>
    );
  }
}
