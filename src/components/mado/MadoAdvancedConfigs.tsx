import Mado from "../../models/Mado";

const stylesheetPlaceholder = `/* 例: 特定の要素を非表示にする */
#leftnavi #dmm-left-navi .dmm-ntgnavi {
  display: none;
}
`;

export function MadoAdvancedConfigs({
  mado, update, // showAdvanced, setShowAdvanced,
  active, toggle,
}: {
  mado: Mado, update: (mado: Mado) => void,
  active: boolean, toggle: () => void,
  // showAdvanced: boolean, setShowAdvanced: (showAdvanced: boolean) => void,
}) {
  return [
    <hr className="mt-1 mb-1" />,
    <label className="label is-clickable" onClick={toggle}>
      <span className="mr-2">高度な設定</span>
      {active ? <i className="fa fa-angle-down" /> : <i className="fa fa-angle-right" />}
    </label>,
    active ? <div>
      < div >
        <label className="label">
          <i className="fa fa-paint-brush mr-2" />
          <span>スタイルシートの注入</span>
        </label>
        <textarea className="textarea" placeholder={stylesheetPlaceholder} defaultValue={mado.stylesheet}
          onChange={ev => { mado.stylesheet = ev.target.value; update(mado) }}
        />
      </div >
    </div > : null,
  ]
}