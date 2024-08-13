import { ChangeEvent } from "react";

export function ChoiceField({
  label,
  onChange,
}: {
  label: string;
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <label className="radio">
          <input type="radio" name="answer" value={0}
            onChange={onChange}
            defaultChecked={true}
          /> 表示しない
        </label>
        <label className="radio">
          <input type="radio" name="answer" value={1}
            onChange={onChange}
          /> あえて表示する
        </label>
      </div>
    </div>
  )
}