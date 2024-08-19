import { useMemo } from "react";
import Mado from "../../models/Mado";
import type MadoLauncher from "../../services/MadoLauncher";
import PermissionService from "../../services/PermissionService";
import { useNavigate } from "react-router-dom";

function BasicInformationTag({ name, value }: { name: string, value: string | number }) {
  return <span className="tag is-info is-light">{name}: {value}</span>;
}

function PermissionAlertIcon({ mado }: { mado: Mado }) {
  const perms = useMemo(() => new PermissionService(), []);
  const navigate = useNavigate();
  return (
    <div className="icon has-text-warning is-clickable"
      title="必要な権限が許可されていない可能性があります"
      onClick={async () => {
        const yes = await perms.ensure(mado.url);
        if (yes) navigate(0);
      }}
    ><i className="fa fa-exclamation-circle" /></div>
  )
}

function PreviewLaunchIcon({mado, launcher}: {mado: Mado, launcher: MadoLauncher}) {
  const perms = useMemo(() => new PermissionService(), []);
  return (
    <div className="icon is-clickable" onClick={async () => {
      const yes = await perms.ensure(mado.url, () => window.alert("必要な権限が許可されていないため操作できません"));
      if (!yes) return;
      await launcher.launch(mado);
    }}><i className="fa fa-window-maximize" /></div>
  )
}

export function MadoCard({
  mado, index, launcher,
  refresh, edit,
  onDragStart,
  onDragEnd,
  onDragOver,
}: {
  mado: Mado, index: number, launcher: MadoLauncher,
  refresh: () => void, edit: () => void,
  onDragStart?: (ev: React.DragEvent<HTMLDivElement>) => void,
  onDragEnd?: (ev: React.DragEvent<HTMLDivElement>) => void,
  onDragOver?: (ev: React.DragEvent<HTMLDivElement>) => void,
 }) {
  return (
    <div className="cell card demado-card" key={mado._id}
      data-id={mado._id}
      style={{
        borderColor: mado.colorcodeByIndex(index),
        marginBottom: '8px', // FIXME: これはどこかで定義されているはず
      }}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className={"card-header"} style={{ backgroundColor: mado.colorcodeByIndex(index) }}>
        <p className="card-header-title level">
          <span>{mado.displayName()}</span>
          {mado.$permitted ? <PreviewLaunchIcon mado={mado} launcher={launcher} /> : <PermissionAlertIcon mado={mado} />}
        </p>
      </div>
      <div className="card-content">
        <div className="content is-size-7">
          <div style={{ wordBreak: 'break-all' }}>{mado.url}</div>
          <div>
            {[
              { name: "横幅", value: mado.size.width },
              { name: "高さ", value: mado.size.height },
              { name: "横ずれ", value: mado.offset.left },
              { name: "縦ずれ", value: mado.offset.top },
              { name: "ズーム", value: mado.zoom },
              { name: "アドレスバー", value: mado.addressbar ? "表示" : "非表示" },
            ].map(({ name, value }) => <BasicInformationTag key={name} name={name} value={value} />)}
          </div>
          <div className="is-small">窓位置 x:{mado.position.x} y:{mado.position.y}</div>
        </div>
        <div className="columns is-mobile">
          <div className="column is-narrow demado-interactive-icon">
            <i className="fa fa-trash-o" title="削除" onClick={async () => {
              if (!window.confirm(`この窓設定を削除しますか？\n\n${mado.displayName()}\nid: ${mado._id}`)) return;
              await mado.delete(); refresh()
            }} />
          </div>
          <div className="column is-narrow demado-interactive-icon" title="エクスポート" onClick={() => {
            window.open(`?export=${mado._id}#debug`);
          }}>
            <i className="fa fa-paper-plane" />
          </div>
          <div className="column is-narrow demado-interactive-icon" title="編集" onClick={() => edit()}>
            <i className="fa fa-wrench" />
          </div>
        </div>
      </div>
    </div>
  );
}