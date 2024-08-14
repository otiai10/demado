import React from "react";
import Mado from "../../models/Mado";
import PermissionService from "../../services/PermissionService";
import type MadoLauncher from "../../services/MadoLauncher";
import { ChoiceField } from "../form/ChoiceField";
import { MatrixField } from "../form/MatrixField";
import { InputField } from "../form/InputField";
import { ColorField } from "../form/ColorField";

export function CreateNewMadoModal({
  active, close, launcher,
}: { active: boolean, close: () => void, launcher: MadoLauncher }) {
  const [state, setState] = React.useState({ mado: Mado.new() });
  return (
    <div className={"modal " + (active ? "is-active" : "")}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">窓の新規登録</p>
          {/* <button className="delete" aria-label="close" onClick={close}>あああ</button> */}
        </header>
        <section className="modal-card-body">
          <InputField label="窓のURL" type="url" icon="fa-link" help=""
            placeholder="http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854"
            onChange={ev => { state.mado.url = ev.target.value; setState({ mado: state.mado }) }}
          />
          <InputField label="窓の名前" type="text" icon="fa-tag" help=""
            placeholder="艦これ（ながらプレイ用）" required={false}
            onChange={ev => { state.mado.name = ev.target.value; setState({ mado: state.mado }) }}
          />
          <MatrixField label="窓のサイズ" items={[
            { label: "横幅", key: "width",  icon: "fa-arrows-h", placeholder: 1200 },
            { label: "高さ", key: "height", icon: "fa-arrows-v", placeholder:  720 },
          ]} onChange={(ev, key: "width" | "height") => { state.mado.size[key] = parseInt(ev.target.value); setState({ mado: state.mado }) }} />
          <MatrixField label="窓内コンテンツの意図的ズレ" items={[
            { label: "右方向", key: "left", icon: "fa-long-arrow-right", placeholder:   0 },
            { label: "下方向", key: "top",  icon: "fa-long-arrow-down",  placeholder: -76 },
          ]} onChange={(ev, key: "left" | "top") => { state.mado.offset[key] = parseInt(ev.target.value); setState({ mado: state.mado }) }} />
          <ChoiceField label="アドレスバー表示" onChange={(ev) => { state.mado.addressbar = ev.target.value == "1"; setState({ mado: state.mado }) }} />
          <InputField label="ズーム倍率" type="number" icon="fa-search" help="" placeholder="0.5"
            onChange={ev => { state.mado.zoom = parseFloat(ev.target.value); setState({ mado: state.mado }) }}
          />
          <ColorField label="窓の色（管理用）" onChange={ev => { state.mado.colorcode = ev.target.value; setState({ mado: state.mado }) }} />
          {/* <MatrixField label="窓を開く場所" /> */}
        </section>
        <footer className="modal-card-foot">
          <div className="buttons">
            <button className="button is-success" disabled={!state.mado.hasValidURL()}
              onClick={async () => {
                await state.mado.save();
                setState({ mado: Mado.new() });
                close();
              }}
            >これでよし</button>
            <button className="button" onClick={() => close()}>やっぱりやめる</button>
            <button className="button is-info" disabled={!state.mado.hasValidURL()}
              onClick={async () => {
                const yes = await (new PermissionService()).ensure(state.mado.url);
                if (!yes) return;
                await launcher.launch(state.mado);
                // console.log("opened", opened);
              }}
            >試しに開く</button>
          </div>
        </footer>
      </div>
    </div>
  );
}