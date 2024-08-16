import { useEffect, useMemo, useState } from "react";
import Mado from "../../models/Mado";
import MadoLauncher from "../../services/MadoLauncher";
import PermissionService from "../../services/PermissionService";
import CaptureService from "../../services/CaptureService";

export function MuteButton({ mado, launcher, refresh }: { mado: Mado, launcher: MadoLauncher, refresh: () => void }) {
  if (!mado.$existance) return null;
  const muted = mado.$existance.tab.mutedInfo?.muted;
  return <div className="icon"
    title={muted ? "ミュート解除" : "ミュートする"}
    onClick={(ev) => { ev.stopPropagation(); launcher.mute(mado, !muted).then(refresh); }}
  ><i className={muted ? "fa fa-volume-off" : "fa fa-volume-up"} /></div>;
}

export function CameraButton({ mado }: { mado: Mado }) {
  const [granted, setGranted] = useState(false);
  const perm = useMemo(() => new PermissionService(), []);
  useEffect(() => { perm.capture.granted().then(setGranted) }, [perm, setGranted]);
  if (!mado.$existance) return null;
  const capture = new CaptureService();
  return <div className="icon"
    title={granted ? "スクリーンショットを撮る" : "スクショには許可が必要です"}
    onClick={(ev) => {
      ev.stopPropagation();
      (granted ? Promise.resolve() : perm.capture.grant()).then(() => capture.capture(mado)).then(() => window.close());
    }}
  ><i className={granted ? "fa fa-camera" : "fa fa-exclamation-circle"} /></div>
}

export function ShortMadoCard({
  mado, index, launcher, refresh,
}: { mado: Mado, index: number, launcher: MadoLauncher, refresh: () => void }) {
  return (
    <div className="demado-short-card"
      style={{ borderColor: mado.colorcodeByIndex(index) }}
      onClick={async () => { await launcher.launch(mado); window.close() }}
    >
      <div className="columns is-mobile">
        <div className="column">{mado.displayName()}</div>
        {mado.$existance ? <div className="column is-narrow">
          <MuteButton mado={mado} launcher={launcher} refresh={refresh} />
          <CameraButton mado={mado} />
        </div> : null}
      </div>
    </div>
  )
}

export function EmptyShortCard() {
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
