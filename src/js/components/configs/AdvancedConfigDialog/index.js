import React, {Component,PropTypes} from 'react';

export default class AdvancedConfigDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressbar: this.props.mado.addressbar ? true : false,
    };
  }
  render() {
    const {mado} = this.props;
    return (
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">「{mado.name}」の高度な設定</p>
          <button className="delete" onClick={() => this.setState({modal:null})}></button>
        </header>
        <section className="modal-card-body">
          <div className="columns is-mobile">
            <div className="column is-4">
              <b>アドレスバーを表示する</b>
            </div>
            <div className="column is-8">
              <input type="checkbox" checked={this.state.addressbar} className="checkbox" onChange={ev => this.setState({addressbar:ev.target.checked})}/>
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          {/* FIXME: 窓リストをstateにして、setStateでrerenderするようにしたい */}
          <button className="button" onClick={() => this.props.mado.update(this.state) && location.reload()}>保存</button>
        </footer>
      </div>
    );
  }
  static propTypes = {
    mado: PropTypes.object.isRequired,
  }
}
