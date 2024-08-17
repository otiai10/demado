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

export function CameraButton({ mado, inpopup }: { mado: Mado, inpopup: boolean }) {
  const [granted, setGranted] = useState(false);
  const perm = useMemo(() => new PermissionService(), []);
  useEffect(() => { perm.capture.granted().then(setGranted) }, [perm, setGranted]);
  if (!mado.$existance) return null;
  const capture = new CaptureService();
  return <div className="icon"
    title={granted ? "スクリーンショットを撮る" : "スクショには許可が必要です"}
    onClick={(ev) => {
      ev.stopPropagation();
      (granted ? Promise.resolve() : perm.capture.grant()).then(() => capture.capture(mado)).then(() => { if (inpopup) window.close() });
    }}
  ><i className={granted ? "fa fa-camera" : "fa fa-exclamation-circle"} /></div>
}

export function ShortMadoCard({
  mado, index, launcher, refresh,
  inpopup = true,
}: {
  mado: Mado, index: number, launcher: MadoLauncher, refresh: () => void,
  inpopup?: boolean,
}) {
  return (
    <div className="demado-short-card"
      style={{ borderColor: mado.colorcodeByIndex(index) }}
      onClick={async () => { await launcher.launch(mado); refresh(); if (inpopup) window.close(); }}
    >
      <div className="columns is-mobile">
        <div className="column">{mado.displayName()}</div>
        {mado.$existance ? <div className="column is-narrow">
          <MuteButton mado={mado} launcher={launcher} refresh={refresh} />
          <CameraButton mado={mado} inpopup={inpopup} />
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

export function OpenDashboardButton({
  launcher
}: {
  launcher: MadoLauncher,
}) {
  return (
    <div className="demado-dashboard-opener-container is-clickable" title="ダッシュボードを開く"
      onClick={async () => { await launcher.dashboard.open(); window.close(); }}
    >
      <div className="demado-dashboard-opener-button-wrapper">
        <i className="fa fa-window-restore" />
      </div>
    </div>
  )
}