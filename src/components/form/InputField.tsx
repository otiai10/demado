import { ChangeEvent } from "react";

export function InputField({
  label, type, icon,
  placeholder = "",
  help = "",
  required = true,
  onChange,
}: {
  label: string;
  type: string;
  icon: string;
  placeholder?: string;
  help?: string;
  required?: boolean;
  onChange?: (ev: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control has-icons-left has-icons-right">
        <input className="input" type={type} placeholder={placeholder} required={required} onChange={onChange} />
        <span className="icon is-small is-left">
          <i className={"fa " + icon}></i>
        </span>
        {/* <span className="icon is-small is-right">
                  <i className="fa fa-check"></i>
                </span> */}
      </div>
      <p className="help is-success">{help}</p>
    </div>
  )
}

