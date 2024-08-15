import { ChangeEvent } from "react";

interface Preference<Key> {
  label: string;
  key: Key;

  icon?: string;
  placeholder?: number | string;
  defaultValue?: number | string;

  min?: number;
  max?: number;
}

export function MatrixField<Key extends string | number>({
  label,
  items,
  onChange,
}: {
  label: string;
  items: Preference<Key>[];
  onChange: (ev: ChangeEvent<HTMLInputElement>, key: Key) => void;
}) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <div className="columns">

          {items.map(item => {
            return (
              <div className="column" style={{ display: "flex", alignItems: "center" }}>
                <label style={{ whiteSpace: "nowrap", marginRight: "1rem" }}>{item.label}</label>
                <div className="control has-icons-left">
                  <input className="input" type="number" min={item.min} max={item.max}
                    placeholder={item.placeholder as string}
                    defaultValue={item.defaultValue as string}
                    onChange={ev => {
                      onChange(ev, item.key);
                    }}
                  />
                  <span className="icon is-small is-left"><i className={"fa " + (item.icon || "fa-arrows-h")}></i></span>
                </div>
              </div>
            )
          })}

          {/* <div className="column" style={{ display: "flex", alignItems: "center" }}>
            <div style={{ whiteSpace: "nowrap", marginRight: "1rem" }}>横幅</div>
            <input className="input" type="number" min={100} />
          </div>
          <div className="column" style={{ display: "flex", alignItems: "center" }}>
            <div style={{ whiteSpace: "nowrap", marginRight: "1rem" }}>高さ</div>
            <input className="input" type="number" min={100} />
          </div>
 */}
        </div>
      </div>
    </div>
  )
}
