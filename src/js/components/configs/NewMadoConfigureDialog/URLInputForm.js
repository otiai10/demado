import React,{Component,PropTypes} from 'react';
import cn from 'classnames';

export default class URLInputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
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
              this.props.stepTo(2);
              this.props.client.message('/mado/configure', {
                url: this.state.url,
              });
              this.props.setDraft({url: this.state.url});
            }}>このURLを開く</a>
          </div>
        </div>
      </div>
    );
  }
  static propTypes = {
    client:   PropTypes.object.isRequired,
    stepTo:   PropTypes.func.isRequired,
    setDraft: PropTypes.func.isRequired,
  }
}
