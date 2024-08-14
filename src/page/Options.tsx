import { useLoaderData } from "react-router-dom";
import Mado from "../models/Mado";
import { CreateNewMadoModal } from "../components/mado/CreateNewMadoModal";
import React from "react";
import { MadoCard } from "../components/mado/MadoCard";
import MadoLauncher from "../services/MadoLauncher";
import WindowService from "../services/WindowService";
import TabService from "../services/TabService";
import ScriptService from "../services/ScriptService";

export function OptionsPage() {
  const { mados } = useLoaderData() as { mados: Mado[] };
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const refresh = () => window.location.reload(); // FIXME: loaderDataを再取得するためにページをリロードする
  const launcher = new MadoLauncher(new WindowService(), new TabService(), new ScriptService());
  return [
    <section className="section">
      <div className="container is-max-desktop">
        <p className="title">demadoの設定</p>
        <p className="subtitle is-size-6">任意のウェブページを小窓化できます. 詳しくは<a className="link" href="https://github.com/otiai10/demado/wiki" target="_blank">ここ</a></p>
      </div>
    </section>,
    <section className="section">
      <div className="container is-max-desktop">
        <div className="grid">
          {mados.length === 0 ? <EmptyMadoEntryView /> : mados.map((mado, i) => <MadoCard mado={mado} index={i} launcher={launcher} />)}
        </div>
      </div>
    </section>,
    <section className="section">
      <div className="container is-max-desktop">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <button className="button is-primary" onClick={() => setShowCreateModal(true)}>
                <i className="fa fa-plus" />
                新規追加
              </button>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <button className="button"
                onClick={async () => { await Mado.drop(); refresh(); }}
              ><i className="fa fa-trash" />すべて削除</button>
            </div>
          </div>
        </div>
      </div>
    </section>,
    <CreateNewMadoModal
      launcher={launcher}
      active={showCreateModal}
      close={() => { setShowCreateModal(false); refresh(); }}
    />
  ];
}

function EmptyMadoEntryView() {
  return (
    <div className="cell card demado-empty-state">
      <div className="card-content">
        <div className="content">
          <p>まだ何も登録されていません</p>
        </div>
      </div>
    </div>
  );
}
