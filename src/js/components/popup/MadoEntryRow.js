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
  render() {
    const styles = {
      block: {
        display: 'flex',
        alignItems: 'center',
      },
      icon: {
        display: 'flex',
        alignItems: 'center',
        padding:  '0 6px',
      },
    };
    return (
      <div className="column" style={{paddingTop: 0}}>
        <div className={cn('message', this._color())}>
          <div className="message-body" style={{padding:'8px'}}>
            <div style={{display:'flex'}}>
              <div style={{...styles.block, flex:1}}>
                <small>{this.props.entry.mado.name}</small>
              </div>
              <div style={styles.icon}>
                <i className="fa fa-volume-up" />
              </div>
              <div style={styles.icon}>
                <i className="fa fa-chrome" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  static propTypes = {
    entry: PropTypes.object.isRequired,
  }
}
