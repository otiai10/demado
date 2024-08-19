import GlobalConfig from "../../models/GlobalConfig";
import { Announce } from "./ReleaseNote";

function isAnnounceEffective(announce: Announce | undefined, config: GlobalConfig, latestversion: string): boolean {
  if (!announce) return false;
  if (announce.effective?.since) {
    const since = new Date(announce.effective?.since || 0);
    if (since > new Date()) return false;
  }
  if (announce.effective?.until) {
    const until = announce.effective?.until;
    if (until === "READ") return !config.hasReadDevInfo(latestversion);
    if (until === "PERSIST") return true;
    if (new Date(until) < new Date()) return false;
  }
  return true;
}

export function DevInfoAnchor({
  active, open,
  announce,
  config,
  version,
}: {
  active: boolean, open: () => void,
  announce?: Announce,
  config: GlobalConfig,
  version: string,
}) {
  if (isAnnounceEffective(announce, config, version)) {
    return (
      <div className="level">
        <div className="level-item is-clickable demado-devinfo-anchor" onClick={open}>
          <div className={"is-size-7 demado-devinfo-hidden-balloon has-text-info"}>{announce!.message}</div>
          <span className={"icon is-large has-text-info"}><i className="fa-2x fa fa-github" /></span>
        </div>
      </div>
    );
  }
  return (
    <div className="level">
      <div className="level-item is-clickable demado-devinfo-anchor" onClick={open}>
        <div className={"is-size-7 demado-devinfo-hidden-balloon"}>開発情報</div>
        <span className={"icon is-large " + (active ? "has-text-warning" : "")}>
          <i className="fa-2x fa fa-github" />
        </span>
      </div>
    </div>
  );
}