
export function DevInfoAnchor({
  active, open,
}: {
  active: boolean, open: () => void,
}) {
  return (
    <div className="level">
      <div className="level-item is-clickable demado-devinfo-anchor" onClick={open}>
        <div className="is-size-7 demado-devinfo-hidden-balloon">開発情報</div>
        <span className={"icon is-large " + (active ? "has-text-warning" : "")}>
          <i className="fa-2x fa fa-github" />
        </span>
      </div>
    </div>
  );
}