import React,{Component,PropTypes} from 'react';

export default class MadoConfigureWaiting extends Component {
  render() {
    return (
      <div>
        <div className="column">
          <p>開かれた{this.props.draft.url}のページで調整してください。</p>
        </div>
      </div>
    );
  }
  static propTypes = {
    draft: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,
  }
}
