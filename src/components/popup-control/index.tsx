import { useEffect, useMemo, useState } from "react";
import Mado from "../../models/Mado";
import MadoLauncher from "../../services/MadoLauncher";
import PermissionService from "../../services/PermissionService";
import CaptureService from "../../services/CaptureService";
import type GlobalConfig from "../../models/GlobalConfig";
import { ReleaseNoteObject } from "../info/ReleaseNote";

export function MuteButton({ mado, launcher, refresh }: { mado: Mado, launcher: MadoLauncher, refresh: () => void }) {
  if (!mado.$existance) return null;
  const muted = mado.$existance.tab.mutedInfo?.muted;
  return <div className="icon"
    title={muted ? "ミュート解除" : "ミュートする"}
    onClick={(ev) => { ev.stopPropagation(); launcher.mute(mado, !muted).then(refresh); }}
  ><i className={muted ? "fa fa-volume-off" : "fa fa-volume-up"} /></div>;
}

export function CameraButton({ mado, /* inpopup */ }: { mado: Mado, inpopup: boolean }) {
  const [granted, setGranted] = useState(false);
  const perm = useMemo(() => new PermissionService(), []);
  useEffect(() => { perm.capture.granted().then(setGranted) }, [perm, setGranted]);
  if (!mado.$existance) return null;
  const capture = new CaptureService();
  return <div className="icon"
    title={granted ? "スクリーンショットを撮る" : "スクショには許可が必要です"}
    onClick={async (ev) => {
      ev.stopPropagation();
      await granted ? Promise.resolve() : perm.capture.grant();
      await capture.capture(mado);
    }}
  ><i className={granted ? "fa fa-camera" : "fa fa-exclamation-circle"} /></div>
}

export function ShortMadoCard({
  mado, index, launcher, refresh,
  inpopup = true,
}: {
  mado: Mado, index: number, launcher: MadoLauncher, config: GlobalConfig,
  refresh: () => void,
  inpopup?: boolean,
}) {
  const perm = useMemo(() => new PermissionService(), []);
  const fallback = () => window.alert("許可がないため、操作できません");
  return (
    <div className="demado-short-card"
      style={{ borderColor: mado.colorcodeByIndex(index) }}
      onClick={async () => {
        const yes = await perm.ensure(mado.url, fallback);
        if (!yes) return;
        await chrome.runtime.sendMessage({ __action__: "/mado/launch", id: mado._id });
      }}
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

export function EmptyShortCard({
  releasenote, config,
}: {
  releasenote: ReleaseNoteObject,
  config: GlobalConfig,
}) {
  const an = config.isAnnounceEffective(releasenote.announce, releasenote.releases[0].version);
  return (
    <div className="demado-short-card demado-empty-state"
      onClick={() => window.open(chrome.runtime.getURL("index.html#options"))}
    >
      <div className="level is-mobile">
        <div className={"level-item " + (an ? "has-text-warning is-shaking" : "has-text-")}>
          {an ? <i className="fa fa-bell-o" /> : <i className="fa fa-plus" />}
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