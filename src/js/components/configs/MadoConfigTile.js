import React, {Component,PropTypes} from 'react';
import cn from 'classnames';

import NumberInput from './NumberInput';

export default class MadoConfigTile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mado: this.props.mado,
    };
  }

  _color() {
    switch(this.state.mado._id % 4) {
    case 0: return 'is-primary';
    case 1: return 'is-info';
    case 2: return 'is-success';
    case 3: return 'is-warning';
    }
  }

  onSizeChanged(key, value) {
    this.state.mado.update({size: {...this.state.mado.size, [key]:value}});
    this.setState({mado: this.state.mado});
  }

  onOffsetChanged(key, value) {
    this.state.mado.update({offset: {...this.state.mado.offset, [key]:value}});
    this.setState({mado: this.state.mado});
  }

  render() {
    return (
      <div className="column" key={this.state.mado._id}>
        <div className={cn('message', this._color())}>
          <div className="message-header">
            <h1>{this.state.mado.name}</h1>
          </div>
          <div className="message-body">
            <div className="columns">
              <div className="column">
                <a>{this.state.mado.url}</a>
              </div>
            </div>
            <div className="columns is-mobile">
              <NumberInput
                  className={this._color()}
                  label="size:width"
                  value={this.state.mado.size.width}
                  onChange={val => this.onSizeChanged('width', val)}
                />
              <NumberInput
                  className={this._color()}
                  label="size:height"
                  value={this.state.mado.size.height}
                  onChange={val => this.onSizeChanged('height', val)}
                />
              <NumberInput
                  className={this._color()}
                  label="offset:left"
                  value={this.state.mado.offset.left}
                  onChange={val => this.onOffsetChanged('left', val)}
                />
              <NumberInput
                  className={this._color()}
                  label="offset:top"
                  value={this.state.mado.offset.top}
                  onChange={val => this.onOffsetChanged('top', val)}
                />
            </div>
          </div>
        </div>
      </div>
    );
  }
  static propTypes = {
    mado: PropTypes.shape({
      _id:  PropTypes.any.isRequired,
      name: PropTypes.string.isRequired,
      url:  PropTypes.string.isRequired,
      size: PropTypes.object.isRequired,
    }).isRequired,
  }
}
