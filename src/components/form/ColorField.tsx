import React, { ChangeEvent } from "react";

export function ColorField({
  label,
  onChange,
}: {
  label: string;
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}) {
  const [enabled, setEnabled] = React.useState(false);
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <div className="columns">
          <div className="column" style={{display: "flex", alignItems: "center"}}>
            <label className="checkbox" style={{ marginRight: "1rem" }}>
              <input type="checkbox" defaultChecked={enabled} onChange={ev => setEnabled(ev.target.checked)} /> 使う
            </label>
            {enabled ? <div className="color-picker" style={{ flex: 1 }}>
              <input type="color" style={{width: "100%", padding: 0}}
                onChange={onChange}
              />
            </div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
