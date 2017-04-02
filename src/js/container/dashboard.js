import React, {Component} from 'react';
import {Client} from 'chomex';

import MadoEntryRow from '../components/popup/MadoEntryRow';

export default class DashboardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
    };
    this.client = new Client(chrome.runtime);
    this.refresh();
  }
  componentDidMount() {
    this.interval = setInterval(() => this.refresh(), 5000);
  }
  refresh() {
    this.client.message('/mado/entries').then(({entries}) => this.setState({entries}));
  }
  render() {
    return (
      <section className="section" style={{padding: '32px 16px 16px 16px'}}>
        <div className="container">
          <div className="columns">
            {this.state.entries.map((entry, i) => <MadoEntryRow key={i}
                entry={entry} client={this.client}
                refresh={this.refresh.bind(this)}
            />)}
          </div>
        </div>
      </section>
    );
  }
}
