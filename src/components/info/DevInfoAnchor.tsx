import GlobalConfig from "../../models/GlobalConfig";
import { Announce } from "./ReleaseNote";

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
  if (config.isAnnounceEffective(announce, version)) {
    return (
      <div className="level">
        <div className="level-item is-clickable demado-devinfo-anchor is-shaking" onClick={open}>
          <div className={"is-size-7 demado-devinfo-hidden-balloon has-text-warning"}>{announce!.message}</div>
          <span className={"icon is-large has-text-warning"}><i className="fa-2x fa fa-github" /></span>
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