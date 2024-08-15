import React from "react";
import { useLoaderData } from "react-router-dom";
import Mado from "../models/Mado";
import { MadoCard } from "../components/mado/MadoCard";
import { MadoConfigModal } from "../components/mado/MadoConfigModal";
import { EmptyMadoEntryView } from "../components/mado/EmptyMadoEntryView";
import MadoLauncher from "../services/MadoLauncher";
import WindowService from "../services/WindowService";
import TabService from "../services/TabService";
import ScriptService from "../services/ScriptService";

// @see https://stackoverflow.com/a/28962290
function isBefore(a: HTMLElement, b: HTMLElement): boolean {
  if (a.parentNode !== b.parentNode) return false;
  for (let cur: ChildNode | null | undefined = a.previousSibling; cur; cur = cur?.previousSibling) {
    if (cur === b) return true;
  }
  return false;
}

export function OptionsPage() {
  const { mados } = useLoaderData() as { mados: Mado[] };
  const [modal, setModal] = React.useState<{ target?: Mado | null, active: boolean }>({ target: null, active: false });
  const refresh = () => window.location.reload(); // FIXME: loaderDataを再取得するためにページをリロードする
  const launcher = new MadoLauncher(new WindowService(), new TabService(), new ScriptService());
  const [dragged, setDragged] = React.useState<HTMLElement | null>(null);
  const reorder = async () => {
    const ids = Array.from(document.querySelectorAll(".demado-card")).map(e => e.getAttribute("data-id")).filter(Boolean);
    for (let index = 0; index < ids.length; index++) await mados.find(m => m._id === ids[index])?.update({ index });
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
              <button className="button is-primary" onClick={() => setModal({ active: true })}>
                <i className="fa fa-plus" /> 新規追加
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
    <MadoConfigModal
      launcher={launcher}
      active={modal.active}
      close={() => { setModal({ active: false, target: null }); refresh(); }}
      mado={modal.target || new Mado()}
      update={(mado: Mado) => { setModal({ active: true, target: mado }) }}
    />,
  ];
}
