import React, {Component,PropTypes} from 'react';
import cn from 'classnames';

export default class NumberInput extends Component {
  render() {
    return (
      <div className="column">
        <label className="label">{this.props.label}</label>
        <input
          type="number"
          className={cn('input', this.props.className)}
          value={this.props.value}
          onChange={ev => this.props.onChange(parseInt(ev.target.value))}
        />
      </div>
    );
  }
  static propTypes = {
    label:     PropTypes.string.isRequired,
    value:     PropTypes.number.isRequired,
    className: PropTypes.oneOfType([
      PropTypes.string, PropTypes.arrayOf(PropTypes.string)
    ]),
    onChange:  PropTypes.func.isRequired,
  }
}
