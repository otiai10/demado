import { ChangeEvent } from "react";

export function InputField({
  label, type, icon,
  placeholder = "",
  defaultValue = "",
  help = "",
  required = true,
  onChange,
}: {
  label: string;
  type: string;
  icon: string;
  placeholder?: string;
  defaultValue?: string | number;
  help?: string;
  required?: boolean;
  onChange?: (ev: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control has-icons-left has-icons-right">
        <input className="input" type={type} placeholder={placeholder} defaultValue={defaultValue} required={required} onChange={onChange} />
        <span className="icon is-small is-left">
          <i className={"fa " + icon}></i>
        </span>
      </div>
      <p className="help is-success">{help}</p>
    </div>
  )
}

