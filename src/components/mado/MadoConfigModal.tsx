import React from "react";
import Mado from "../../models/Mado";
import PermissionService from "../../services/PermissionService";
import type MadoLauncher from "../../services/MadoLauncher";
import { ChoiceField } from "../form/ChoiceField";
import { MatrixField } from "../form/MatrixField";
import { InputField } from "../form/InputField";
import { ColorField } from "../form/ColorField";
import { MadoAdvancedConfigs } from "./MadoAdvancedConfigs";
import { LaunchMode } from "../../services/MadoLauncher";

export function MadoConfigModal({
  active, close, launcher,
  mado, update, refresh,
}: {
  active: boolean, close: () => void, launcher: MadoLauncher,
  mado: Mado, update: (mado: Mado) => void,
  refresh: () => void,
}) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const cleanup = () => { setShowAdvanced(false); close(); };
  return (
    <div className={"modal " + (active ? "is-active" : "")}>
      <div className="modal-background" /* onClick={cleanup} // 背景黒領域で閉じるかどうか悩ましい */></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{mado._id ? "窓の設定変更" : "窓の新規登録"}</p>
          <span className="is-size-6 has-text-grey-light">{mado._id}</span>
        </header>
        <section className="modal-card-body">
          <InputField label="窓のURL" type="url" icon="fa fa-link" help=""
            defaultValue={mado.url}
            placeholder="http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854"
            onChange={ev => { mado.url = ev.target.value; update(mado) }}
          />
          <InputField label="窓の名前" type="text" icon="fa fa-tag" help=""
            defaultValue={mado.name}
            placeholder="艦これ（ながらプレイ用）" required={false}
            onChange={ev => { mado.name = ev.target.value; update(mado) }}
          />
          <MatrixField label="窓のサイズ"
            items={[
              { label: "横幅", key: "width", icon: "fa fa-arrows-h", placeholder: 1200, defaultValue: mado.size.width },
              { label: "高さ", key: "height", icon: "fa fa-arrows-v", placeholder: 720, defaultValue: mado.size.height },
            ]}
            onChange={(ev, key: "width" | "height") => { mado.size[key] = parseInt(ev.target.value); update(mado) }}
          />
          <MatrixField label="窓内コンテンツの意図的ズレ"
            items={[
              { label: "右方向", key: "left", icon: "fa fa-long-arrow-right", placeholder: 0, defaultValue: mado.offset.left },
              { label: "下方向", key: "top", icon: "fa fa-long-arrow-down", placeholder: -76, defaultValue: mado.offset.top },
            ]}
            onChange={(ev, key: "left" | "top") => { mado.offset[key] = parseInt(ev.target.value); update(mado) }}
          />
          <ChoiceField label="アドレスバー表示"
            defaultValue={mado.addressbar ? "1" : "0"}
            onChange={(ev) => { mado.addressbar = ev.target.value == "1"; update(mado) }}
          />
          <InputField label="ズーム倍率" type="number" icon="fa fa-search" help="" placeholder="0.5"
            defaultValue={mado.zoom}
            onChange={ev => { mado.zoom = parseFloat(ev.target.value); update(mado) }}
          />
          <ColorField label="窓の色（管理用）"
            defaultValue={mado.colorcode}
            onChange={ev => { mado.colorcode = ev.target.value; update(mado) }}
          />

          <MadoAdvancedConfigs
            mado={mado} update={update}
            active={showAdvanced} toggle={() => setShowAdvanced(!showAdvanced)}
          />

        </section>
        <footer className="modal-card-foot">
          <div className="buttons">
            <button className="button is-success" disabled={!mado.hasValidURL()}
              onClick={async () => {
                const yes = await (new PermissionService()).ensure(mado.url);
                if (!yes) return;
                await mado.save();
                cleanup(); refresh();
              }}
            >これでよし</button>
            <button className="button" onClick={() => cleanup()}
            >やっぱりやめる</button>
            <button className="button is-warning"
              disabled={!mado.hasValidURL() || !mado._id}
              title={mado._id ? "" : "画面内設定は保存後に利用できます"}
              onClick={async () => {
                const yes = await (new PermissionService()).ensure(mado.url);
                if (yes) await launcher.launch(mado, LaunchMode.DYNAMIC);
              }}
            >画面内設定を開く</button>
            <button className="button is-info" disabled={!mado.hasValidURL()}
              onClick={async () => {
                const yes = await (new PermissionService()).ensure(mado.url);
                if (yes) await launcher.launch(mado, LaunchMode.PREVIEW);
              }}
            >試しに開く</button>
          {!mado._id && <p className="help">※ 窓の新規登録は保存後に画面内設定を利用できます</p>}
          </div>
        </footer>
      </div>
    </div>
  );
}