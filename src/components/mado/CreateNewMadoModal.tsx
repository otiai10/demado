
interface Preference {
  label: string;
  key: string;

  icon?: string;

  min?: number;
  max?: number;
}

function InputField({
  label, type, icon,
  placeholder = "",
  help = "",
  required = true,
}: {
  label: string;
  type: string;
  icon: string;
  placeholder?: string;
  help?: string;
  required?: boolean;
}) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control has-icons-left has-icons-right">
        <input className="input" type={type} placeholder={placeholder} required={required} />
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

function MatrixField({
  label,
  items,
}: {
  label: string;
  items: Preference[];
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
                  <input className="input" type="number" min={item.min} max={item.max} />
                  <span className="icon is-small is-left"><i className={"fa " + (item.icon || "fa-arrows-left-right")}></i></span>
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

function ChoiceField({
  label,
}: {
  label: string;
}) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <label className="radio">
          <input type="radio" name="answer" defaultChecked={true} /> 表示しない
        </label>
        <label className="radio">
          <input type="radio" name="answer" /> あえて表示する
        </label>
      </div>
    </div>
  )
}

export function ColorField({
  label,
}: {
  label: string;
}) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <div className="columns">
          <div className="column" style={{display: "flex", alignItems: "center"}}>
            <label className="checkbox" style={{ marginRight: "1rem" }}>
              <input type="checkbox" /> 使う
            </label>
            <div className="color-picker" style={{ flex: 1 }}>
              <input type="color" style={{width: "100%", padding: 0}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function example(raw: string) {
  const url = new URL(raw);
  chrome.permissions.contains({ origins: [url.origin + "/*"] }, (granted) => {
    console.log("granted", granted);
    if (!granted) {
      chrome.permissions.request({ origins: [url.origin + "/*"] }, (granted) => {
        console.log("granted", granted);
      });
    }
  });
}

export function CreateNewMadoModal() {
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">窓の新規登録</p>
          {/* <button className="delete" aria-label="close"></button> */}
        </header>
        <section className="modal-card-body">
          <InputField label="窓のURL" type="url" icon="fa-link" help="" placeholder="https://www.youtube.com/watch?v=3c8ilTPmBGA" />
          <InputField label="窓の名前" type="text" icon="fa-tag" help="" placeholder="作業用BGM" required={false} />
          <MatrixField label="窓のサイズ" items={[{ label: "横幅", key: "width" }, { label: "高さ", key: "height" }]} />
          <MatrixField label="窓内コンテンツの意図的ズレ" items={[{ label: "横方向", key: "x" }, { label: "縦方向", key: "y" }]} />
          <ChoiceField label="アドレスバー表示" />
          <InputField label="ズーム倍率" type="number" icon="fa-search" help="" placeholder="0.75" />
          <ColorField label="窓の色（管理用）" />
          {/* <MatrixField label="窓を開く場所" /> */}
        </section>
        <footer className="modal-card-foot">
          <div className="buttons">
            <button className="button is-success" onClick={() => example("https://www.youtube.com/watch?v=3c8ilTPmBGA")}>Save changes</button>
            <button className="button">Cancel</button>
            <button className="button is-info">試しに開く</button>
          </div>
        </footer>
      </div>
    </div>
  );
}