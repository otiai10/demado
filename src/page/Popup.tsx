import { useLoaderData } from "react-router-dom";
import Mado from "../models/Mado";
import MadoLauncher from "../services/MadoLauncher";
import WindowService from "../services/WindowService";
import TabService from "../services/TabService";
import ScriptService from "../services/ScriptService";

function MuteButton({ mado, /* launcher */ }: { mado: Mado, launcher: MadoLauncher }) {
  if (!mado.$existance) return null;
  const muted = mado.$existance.tab.mutedInfo?.muted;
  return <div className="icon"
    title={muted ? "ミュート解除" : "ミュートする"}
    onClick={ev => {
      console.log("fuga") /* launcher.mute(mado.$existance.tab.id!) */
      ev.stopPropagation();
      ev.preventDefault();
    }}><i className={"fa " + (muted ? "fa-volume-off" : "fa-volume-up")} /></div>;
}

function CameraButton({ mado, /* launcher */ }: { mado: Mado, launcher: MadoLauncher }) {
  if (!mado.$existance) return null;
  return <div className="icon"><i className="fa fa-camera" title="スクリーンショットを撮る" /></div>
}

function ShortMadoCard({ mado, index, launcher }: { mado: Mado, index: number, launcher: MadoLauncher }) {
  // const existance = await launcher.exists(mado);
  // console.log(existance);
  console.log(mado.$existance);
  return (
    <div className="demado-short-card"
      style={{
        borderColor: mado.colorcodeByIndex(index),
      }}
      onClick={() => {
        launcher.launch(mado).then(() => window.close());
      }}
    >
      <div className="columns is-mobile">
        <div className="column">
          {mado.name || "_設定無し_"}
        </div>
        {mado.$existance ? <div className="column is-narrow">
          <MuteButton mado={mado} launcher={launcher} />
          <CameraButton mado={mado} launcher={launcher} />
        </div> : null}
      </div>

    </div>
  )
}

export function PopupPage() {
  const { mados } = useLoaderData() as { mados: Mado[] };
  const launcher = new MadoLauncher(new WindowService(), new TabService(), new ScriptService());
  return <div>
    <div className="p-2">
      {mados.map((mado, i) => <ShortMadoCard mado={mado} key={mado._id} index={i} launcher={launcher} />)}
    </div>
  </div>;
}
