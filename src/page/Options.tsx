import React from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Mado from "../models/Mado";
import GlobalConfig from "../models/GlobalConfig";
import MadoLauncher from "../services/MadoLauncher";
import WindowService from "../services/WindowService";
import TabService from "../services/TabService";
import ScriptService from "../services/ScriptService";
import { MadoCard } from "../components/mado/MadoCard";
import { MadoConfigModal } from "../components/mado/MadoConfigModal";
import { EmptyMadoEntryView } from "../components/mado/EmptyMadoEntryView";
import { CopyRight } from "../components/info/CopyRight";
import { ReleaseNote } from "../components/info/ReleaseNote";
import { IssueReport } from "../components/info/IssueReport";
import { DevInfoAnchor } from "../components/info/DevInfoAnchor";
import note from "../release-note.json";

// @see https://stackoverflow.com/a/28962290
function isBefore(a: HTMLElement, b: HTMLElement): boolean {
  if (a.parentNode !== b.parentNode) return false;
  for (let cur: ChildNode | null | undefined = a.previousSibling; cur; cur = cur?.previousSibling) {
    if (cur === b) return true;
  }
  return false;
}

export function OptionsPage() {
  const { mados, spotlight, config } = useLoaderData() as { mados: Mado[], spotlight: Mado | null, config: GlobalConfig };
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
    <section className="section">
      <div className="container is-max-desktop">
        <p className="title">demadoの設定</p>
        <p className="subtitle is-size-6">任意のウェブページを小窓化できます. 詳しくは<a className="link" href="https://github.com/otiai10/demado/wiki" target="_blank">ここ</a></p>
      </div>
    </section>,
    <section className="section demado-mado-card-section">
      <div className="container is-max-desktop">
        <div className="grid is-col-min-12">
          {mados.length === 0 ? <EmptyMadoEntryView/> : mados.map((mado, i) => <MadoCard
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
          />)}
        </div>
      </div>
    </section>,
    <section className="section">
      <div className="container is-max-desktop">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <button className="button is-primary" onClick={() => setModal({ active: true, target: Mado.new() })}>
                <i className="fa fa-plus" /> 新規追加
              </button>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <button className="button"
                onClick={async () => { await Mado.drop(); refresh(); }}
              ><i className="fa fa-trash-o" />すべて削除</button>
            </div>
          </div>
        </div>
      </div>
    </section>,
    <section className="section demado-global-config">
      <div className="container is-max-desktop">
        <hr />
        <p className="title is-4 mb-4">共通の設定</p>
        <div>
          <label className="checkbox">
            <input className="mr-2" type="checkbox" checked={config.alertOnClose} onChange={async (ev) => {
              await config.update({ alertOnClose: ev.target.checked }); refresh();
            }} />
            <span>ブラウザを閉じ際に確認のアラートを表示する</span>
          </label>
        </div>
      </div>
    </section>,
    <section className="section demado-foot">
      <div className="container is-max-desktop">
        <hr />

        <DevInfoAnchor active={devinfo} open={() => setDevInfo(!devinfo)} />

        {/* {{{ 一時的な措置 */}
        <div className="level">
          <div className="level-item">
            <button className="button is-size-7 is-light" onClick={() => window.open("#/debug")}>
              一次的な措置: 旧版での設定（localStorage）を確認する
            </button>
          </div>
        </div>
        {/* }}} */}

        {devinfo ? <ReleaseNote note={note} /> : null}
        {devinfo ? <IssueReport /> : null}
        {devinfo ? <CopyRight repository={note.reference.repo} /> : null}
      </div>
    </section>,
    <MadoConfigModal
      launcher={launcher}
      active={modal.active}
      close={() => { setModal({ active: false, target: null }); }}
      mado={modal.target}
      update={(mado: Mado) => { setModal({ active: true, target: mado }) }}
      refresh={refresh}
    />,
  ];
}
