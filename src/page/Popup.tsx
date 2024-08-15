import { useLoaderData } from "react-router-dom";
import Mado from "../models/Mado";
import MadoLauncher from "../services/MadoLauncher";
import WindowService from "../services/WindowService";
import TabService from "../services/TabService";
import ScriptService from "../services/ScriptService";
import PermissionService from "../services/PermissionService";
import React, { useEffect, useMemo } from "react";
import CaptureService from "../services/CaptureService";

function MuteButton({ mado, launcher }: { mado: Mado, launcher: MadoLauncher }) {
  if (!mado.$existance) return null;
  const muted = mado.$existance.tab.mutedInfo?.muted;
  return <div className="icon"
    title={muted ? "ミュート解除" : "ミュートする"}
    onClick={() => launcher.mute(mado, !muted)}
  ><i className={muted ? "fa fa-volume-off" : "fa fa-volume-up"} /></div>;
}

function CameraButton({ mado }: { mado: Mado }) {
  const [granted, setGranted] = React.useState(false);
  const perm = useMemo(() => new PermissionService(), []);
  useEffect(() => { perm.capture.granted().then(setGranted) }, [perm, setGranted]);
  if (!mado.$existance) return null;
  const capture = new CaptureService();
  return <div className="icon"
    title={granted ? "スクリーンショットを撮る" : "スクショには許可が必要です"}
    onClick={async () => {
      if (!granted) setGranted(await perm.capture.grant());
      else capture.capture(mado);
    }}
  ><i className={granted ? "fa fa-camera" : "fa fa-exclamation-circle"} /></div>
}

function ShortMadoCard({ mado, index, launcher }: { mado: Mado, index: number, launcher: MadoLauncher }) {
  return (
    <div className="demado-short-card"
      style={{
        borderColor: mado.colorcodeByIndex(index),
      }}
      onClick={() => launcher.launch(mado)}
    >
      <div className="columns is-mobile">
        <div className="column">{mado.displayName()}</div>
        {mado.$existance ? <div className="column is-narrow">
          <MuteButton mado={mado} launcher={launcher} />
          <CameraButton mado={mado} />
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
