import React, {Component,PropTypes} from 'react';
import Mado from '../../../models/Mado';

export default class ImportMadoDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      error: '',
    };
  }
  render() {
    return (
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">窓設定をインポート</p>
          <button className="delete" onClick={this.props.close}></button>
        </header>
        <section className="modal-card-body">
          <section className="content">
            <div className="field">
              <p className="control">
                <textarea
                  onChange={this.onChange.bind(this)}
                  placeholder="エクスポートされたYAML形式の文字列を、改行やインデントそのままでコピペしてください。"
                  className="textarea is-small">
                </textarea>
              </p>
            </div>
          </section>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-primary" disabled={!this.state.valid} onClick={this.onCommit.bind(this)}>決定</button>
          <small className="text is-danger">{this.state.error}</small>
        </footer>
      </div>
    );
  }
  onChange(ev) {
    try {
      const mado = Mado.fromExportalYAML(ev.target.value);
      this.setState({mado, error:null, valid: true});
    } catch (err) {
      this.setState({error: err.toString(), mado: null, valid:false});
    }
  }
  onCommit() {
    this.props.commit(this.state.mado);
  }
  static propTypes = {
    close: PropTypes.func.isRequired,
    commit:PropTypes.func.isRequired,
  }
}
