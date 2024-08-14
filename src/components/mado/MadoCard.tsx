import Mado from "../../models/Mado";
import type MadoLauncher from "../../services/MadoLauncher";

function BasicInformationTag({ name, value }: { name: string, value: string | number }) {
  return <span className="tag is-info is-light">{name}: {value}</span>;
}

export function MadoCard({
  mado, index, launcher,
  refresh,
  onDragStart,
  onDragEnd,
  onDragOver,
}: {
  mado: Mado, index: number, launcher: MadoLauncher,
  refresh: () => void,
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
          <span>{mado.name || "_設定無し_"}</span>
          <div className="icon" onClick={async () => {
            await launcher.launch(mado);
          }}><i className="fa fa-window-maximize" /></div>
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
          <div className="column is-narrow">
            <i className="fa fa-trash demado-interactive-icon" title="削除" onClick={async () => {
              if (!window.confirm("この窓設定を削除しますか？")) return;
              await mado.delete(); refresh()
            }} />
          </div>
          <div className="column is-narrow demado-interactive-icon">
            <i className="fa fa-wrench" />
          </div>
        </div>
      </div>
    </div>
  );
}