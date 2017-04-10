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
                  placeholder={[
                    'エクスポートされたDEMAL形式の文字列を1行で、',
                    'あるいはYAML形式の文字列を改行やインデントそのままでコピペしてください。',
                    'DEMAL形式については https://github.com/otiai10/demal を参照してください。',
                    'DEMALの例）',
                    '\ts.w|520,s.h|338,o.l|0,o.t|0,z|1,u|http://google.com'
                  ].join('\n')}
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
    // うーん
    try {
      const mado = Mado.fromExportalYAML(ev.target.value);
      this.setState({mado, error:null, valid: true});
    } catch (err) {
      try {
        const mado = Mado.fromExportalDEMAL(ev.target.value);
        this.setState({mado, error:null, valid: true});
      } catch (err_2) {
        this.setState({
          error: ['1: ' + err.toString(), '2: ' + err_2.toString()].join('\n'),
          mado: null, valid:false
        });
      }
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
