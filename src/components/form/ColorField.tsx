import React, { ChangeEvent, useEffect } from "react";

export function ColorField({
  label,
  defaultValue,
  onChange,
}: {
  label: string;
  defaultValue?: string;
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}) {
  const [enabled, setEnabled] = React.useState(!!defaultValue);
  useEffect(() => setEnabled(!!defaultValue), [defaultValue]); // XXX: useStateの初期値にdefaultValueが効かないので、useEffectで初期化する
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <div className="columns">
          <div className="column" style={{display: "flex", alignItems: "center"}}>
            <label className="checkbox" style={{ marginRight: "1rem" }}>
              <input type="checkbox" checked={enabled} onChange={ev => setEnabled(ev.target.checked)} /> 使う
            </label>
            {enabled ? <div className="color-picker" style={{ flex: 1 }}>
              <input type="color" style={{width: "100%", padding: 0}}
                defaultValue={defaultValue}
                onChange={onChange}
              />
            </div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
