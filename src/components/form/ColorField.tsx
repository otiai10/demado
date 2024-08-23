import React, { ChangeEvent, useEffect } from "react";

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}) {
  const [enabled, setEnabled] = React.useState(!!value);
  useEffect(() => setEnabled(!!value), [value]); // XXX: useStateの初期値にdefaultValueが効かないので、useEffectで初期化する
  const fallbackvalue = "#808080"
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <div className="columns">
          <div className="column" style={{display: "flex", alignItems: "center"}}>
            <label className="checkbox" style={{ marginRight: "1rem" }}>
              <input type="checkbox" checked={enabled} onChange={ev => {
                setEnabled(ev.target.checked)
                if (ev.target.checked) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  if (value === "") onChange({ target: { value: fallbackvalue } } as any)
                } else {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange({ target: { value: "" } } as any)
                }
              }} /> 使う
            </label>
            {enabled ? <div className="color-picker" style={{ flex: 1 }}>
              <input type="color" style={{width: "100%", padding: 0}}
                value={value}
                onChange={onChange}
              />
            </div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
