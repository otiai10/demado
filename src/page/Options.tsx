import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Mado, { PortableJSONObject } from "../models/Mado";
import GlobalConfig from "../models/GlobalConfig";
import MadoLauncher from "../services/MadoLauncher";
import WindowService from "../services/WindowService";
import TabService from "../services/TabService";
import ScriptService from "../services/ScriptService";
import { MadoCard } from "../components/mado/MadoCard";
import { MadoConfigModal } from "../components/mado/MadoConfigModal";
import { EmptyMadoEntryView } from "../components/mado/EmptyMadoEntryView";
import { CopyRight } from "../components/info/CopyRight";
import { ReleaseNote, ReleaseNoteObject } from "../components/info/ReleaseNote";
import { IssueReport } from "../components/info/IssueReport";
import { DevInfoAnchor } from "../components/info/DevInfoAnchor";
import note from "../release-note.json";
import Dashboard from "../models/Dashboard";

// @see https://stackoverflow.com/a/28962290
function isBefore(a: HTMLElement, b: HTMLElement): boolean {
  if (a.parentNode !== b.parentNode) return false;
  for (let cur: ChildNode | null | undefined = a.previousSibling; cur; cur = cur?.previousSibling) {
    if (cur === b) return true;
  }
  return false;
}

function ImportFileView({
  setModal, refresh,
}: {
  setModal: (modal: { target?: Mado | null, active: boolean }) => void;
  refresh: () => void;
}) {
  return (
    <div className="file">
      <label className="file-label">
        <input className="file-input" type="file" name="resume" onChange={ev => {
          const files = ev.target.files;
          if (!files || !files.length) return;
          try {
            const r = new FileReader();
            r.onload = async (ev) => {
              const port = JSON.parse(ev.target?.result as string) as PortableJSONObject;
              if (port.mados.length > 1) {
                if (window.confirm(`${port.mados.length}件の設定を一括インポートしますか？\n\n${port.mados.map(m => m.name || m.url).join("\n")}`)) {
                  const mados = port.mados.map(madolike => Mado.new(madolike));
                  for (let i = 0; i < mados.length; i++) {
                    await mados[i].save();
                  }
                  setTimeout(() => refresh(), 200);
                }
              } else if (port.mados.length === 1) {
                const madolike = port.mados[0];
                setModal({ active: true, target: Mado.new(madolike) });
              }
            };
            r.readAsText(files[0]);
          } catch (e) { console.error(e); }
        }} />
        <span className="file-cta">
          <span className="file-icon">
            <i className="fa fa-arrow-circle-up"></i>
          </span>
          <span className="file-label"> インポート</span>
        </span>
      </label>
    </div>
  )
}

export function OptionsPage() {
  const releasenote = note as unknown as ReleaseNoteObject;
  const { mados, spotlight, config, dashboard } = useLoaderData() as { mados: Mado[], spotlight: Mado | null, config: GlobalConfig, dashboard: Dashboard };
  const [modal, setModal] = React.useState<{ target?: Mado | null, active: boolean }>({ target: spotlight, active: !!spotlight });
  const navigate = useNavigate();
  const refresh = () => navigate("/options");
  const launcher = new MadoLauncher(new WindowService(), new TabService(), new ScriptService());
  const [dragged, setDragged] = React.useState<HTMLElement | null>(null);
  const [devinfo, setDevInfo] = React.useState(false);
  const reorder = async () => {
    const ids = Array.from(document.querySelectorAll(".demado-card")).map(e => e.getAttribute("data-id")).filter(Boolean);
    for (let index = 0; index < ids.length; index++) await mados.find(m => m._id === ids[index])?.update({ index });
    refresh();
  }
  return [
    <section key="head" className="section">
      <div className="container is-max-desktop">
        <p className="title">demadoの設定</p>
        <p className="subtitle is-size-6">任意のウェブページを小窓化できます. 詳しくは<a className="link" href="https://github.com/otiai10/demado/wiki" target="_blank">ここ</a></p>
      </div>
    </section>,
    <section key="mados" className="section demado-mado-card-section">
      <div className="container is-max-desktop">
        <div className="grid is-col-min-12">
          {mados.length === 0 ? <EmptyMadoEntryView key={'empty'} /> : mados.map((mado, i) => <MadoCard
            mado={mado} index={i} launcher={launcher}
            edit={() => setModal({ active: true, target: mado })}
            refresh={refresh}
            onDragStart={ev => setDragged(ev.currentTarget)}
            onDragEnd={() => { setDragged(null); reorder() }}
            onDragOver={ev => {
              if (isBefore(dragged!, ev.currentTarget)) {
                ev.currentTarget.parentNode?.insertBefore(dragged!, ev.currentTarget);
              } else {
                ev.currentTarget.parentNode?.insertBefore(dragged!, ev.currentTarget.nextSibling);
              }
            }}
            key={mado._id}
          />)}
        </div>
      </div>
    </section>,
    <section key="global-actions" className="section demado-global-action-buttons">
      <div className="container is-max-desktop">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <button className="button is-primary" onClick={() => setModal({ active: true, target: Mado.new() })}>
                <i className="mr-2 fa fa-plus" /> 新規追加
              </button>
            </div>
            <div className="level-item">
              <ImportFileView setModal={setModal} refresh={refresh} />
            </div>
          </div>
          <div className="level-right">
            <div className="level-item buttons">
              {mados.length > 1 ? <button className="button is-text"
                onClick={async () => { if (window.confirm(`${mados.length}件の設定をすべて削除しますか？`)) {
                  await Mado.drop(); refresh()
                }}}
              ><i className="mr-2 fa fa-trash-o" />すべて削除</button> : null}
              {mados.length > 1 ? <button className="button is-text"
                onClick={() => window.open(`?export=${mados.map(m => m._id).join(",")}#debug`)}
              ><i className="mr-2 fa fa-paper-plane" />すべてエクスポート</button> : null}
              <button className="button is-text"
                onClick={() => window.open("https://github.com/otiai10/demado/discussions/108")}
              ><i className="mr-2 fa fa-book" />レシピ集</button>
            </div>
          </div>
        </div>
      </div>
    </section>,
    <section key="global-config" className="section demado-global-config">
      <div className="container is-max-desktop">
        <hr />
        <p className="title is-4 mb-4">共通の設定</p>

        <div className="mb-2">
          <label className="checkbox">
            <input className="mr-2" type="checkbox" checked={config.alertOnClose} onChange={async (ev) => {
              await config.update({ alertOnClose: ev.target.checked }); refresh();
            }} />
            <span>ブラウザを閉じ際に確認のアラートを表示する</span>
          </label>
        </div>

        <div className="mb-2">
          <span className="mr-1">ダッシュボードの座標</span>
          <span className="mr-1">{JSON.stringify(dashboard?.position)}</span>
          <button className="button is-small" onClick={async () => {
            await (await Dashboard.user()).update({ position: { x: 0, y: 0 } });
            refresh();
          }}>初期化</button>
        </div>

      </div>
    </section>,
    <section key="foot" className="section demado-foot">
      <div className="container is-max-desktop">
        <hr />

        <DevInfoAnchor active={devinfo}
          open={() => {
            setDevInfo(!devinfo);
            config.update({ readDevInfoVersion: releasenote.releases[0].version });
          }}
          announce={releasenote.announce}
          config={config}
          version={releasenote.releases[0].version}
        />

        {/* {{{ 一時的な措置 */}
        <div className="level">
          <div className="level-item">
            <button className="button is-size-7 is-light" onClick={() => window.open("#/debug")}>
              デバッグページを開く
            </button>
          </div>
        </div>
        {/* }}} */}

        {devinfo ? <ReleaseNote note={releasenote} /> : null}
        {devinfo ? <IssueReport /> : null}
        {devinfo ? <CopyRight repository={releasenote.reference.repo} /> : null}
      </div>
    </section>,
    <MadoConfigModal
      key="modal"
      launcher={launcher}
      active={modal.active}
      close={() => { setModal({ active: false, target: null }); }}
      mado={modal.target}
      update={(mado: Mado) => { setModal({ active: true, target: mado }) }}
      refresh={refresh}
    />,
  ];
}
