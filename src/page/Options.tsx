import { useLoaderData } from "react-router-dom";
import Mado from "../models/Mado";
import { CreateNewMadoModal } from "../components/mado/CreateNewMadoModal";
import React from "react";

export function OptionsPage() {
  const { mados } = useLoaderData() as { mados: Mado[] };
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const refresh = () => window.location.reload(); // FIXME: loaderDataを再取得するためにページをリロードする
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
          {mados.length === 0 ? <EmptyMadoEntryView /> : mados.map((mado, i) => (
            <div className="cell card demado-card" key={mado._id}
              style={{ borderColor: mado.colorcodeByIndex(i) }}
            >
              <div className={"card-header"}
                style={{ backgroundColor: mado.colorcodeByIndex(i) }}
              >
                <p className="card-header-title">
                  <span className="icon">
                    <i className="fas fa-home"></i>
                  </span>
                  <span>{mado.name || "_設定無し_"}</span>
                </p>
              </div>
              <div className="card-content">
                <div className="content">
                  <p style={{ wordBreak: 'break-all' }}>{mado.url}</p>
                </div>
              </div>
            </div>
          ))}
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
