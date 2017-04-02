import React, {Component,PropTypes} from 'react';
import cn from 'classnames';

export default class MadoEntryRow extends Component {
  // ここで色のバリエーションつけるやつ、設定画面と同じなので、別々に定義してるとあぶない。
  _color() {
    switch(this.props.entry.mado._id % 4) {
    case 0: return 'is-primary';
    case 1: return 'is-info';
    case 2: return 'is-success';
    case 3: return 'is-warning';
    }
  }
  _style() {
    return {
      column: {
        paddingTop: 0,
      },
      title: {
        display: 'flex',
        alignItems: 'center',
      },
      icon: {
        display: 'flex',
        alignItems: 'center',
        padding:  '0 6px',
      },
    };
  }
  renderMuteButton() {
    if (!this.props.entry.tab) return null;
    const {muted} = this.props.entry.tab.mutedInfo;
    return (
      <div style={this._style().icon} onClick={this.toggleMute.bind(this)}>
        {muted ? <i className="fa fa-volume-off" /> : <i className="fa fa-volume-up" />}
      </div>
    );
  }
  renderCameraButton() {
    if (!this.props.entry.tab) return null;
    return (
      <div style={this._style().icon} onClick={this.takeScreenshot.bind(this)}>
        <i className="fa fa-camera" />
      </div>
    );
  }
  render() {
    const {entry} = this.props;
    return (
      <div className="column" style={this._style().column}>
        <div className={cn('message', this._color())}>
          <div
            className="message-body mado-config"
            style={{padding:'8px', cursor:'pointer'}}
            onClick={this.launchOrFocus.bind(this)}
            >
            <div style={{display:'flex'}}>
              <div style={{...this._style().title, flex:1}}>
                <small>{entry.mado.name}</small>
              </div>
              {this.renderMuteButton()}
              {this.renderCameraButton()}
            </div>
          </div>
        </div>
      </div>
    );
  }
  launchOrFocus(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.client.message('/mado:launch', {
      _id: this.props.entry.mado._id, winId: this.props.entry.winId,
    });
  }
  toggleMute(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.client.message('/mado:toggle-mute', {
      mado: this.props.entry.mado, tabId: this.props.entry.tab.id,
    }).then(() => this.props.refresh());
  }
  takeScreenshot(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.props.client.message('/mado:screenshot', {
      mado: this.props.entry.mado, winId: this.props.entry.winId,
    });
  }
  static propTypes = {
    entry:  PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired,
  }
}
