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
        <div className="column">{mado.displayName()}</div>
        {mado.$existance ? <div className="column is-narrow">
          <MuteButton mado={mado} launcher={launcher} />
          <CameraButton mado={mado} launcher={launcher} />
        </div> : null}
      </div>

    </div>
  )
}

function EmptyShortCard() {
  return (
    <div className="demado-short-card demado-empty-state"
      onClick={() => window.open(chrome.runtime.getURL("index.html#options"))}
    >
      <div className="level is-mobile">
        <div className="level-item">
          <i className="fa fa-plus" />
        </div>
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
      <EmptyShortCard />
    </div>
  </div>;
}
