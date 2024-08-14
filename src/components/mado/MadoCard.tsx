import Mado from "../../models/Mado";
import type MadoLauncher from "../../services/MadoLauncher";

function BasicInformationTag({ name, value }: { name: string, value: string | number }) {
  return <span className="tag is-info is-light">{name}: {value}</span>;
}

export function MadoCard({
  mado, index, launcher,
}: { mado: Mado, index: number, launcher: MadoLauncher }) {
  return (
    <div className="cell card demado-card" key={mado._id} style={{
      borderColor: mado.colorcodeByIndex(index),
      marginBottom: '8px', // FIXME: これはどこかで定義されているはず
    }}>
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
        </div>
      </div>
    </div>
  );
}