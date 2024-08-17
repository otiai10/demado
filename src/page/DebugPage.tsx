import { IssueReport } from "../components/info/IssueReport";

function TemporarilyShowLocalStorage() {
  const old = {
    Mado: JSON.parse(localStorage.getItem("Mado") || "{}"),
    Config: JSON.parse(localStorage.getItem("Config") || "{}"),
  };
  return (
    <div className="container mb-8">
      <div className="mb-4">
        <h1 className="title is-size-4">#旧版で設定されていたlocalStorageの確認</h1>
        <h2 className="subtitle is-size-7">demado 2.0 では、Chrome Manifest V3 対応に伴い、設定などの保存場所を <code>localStorage</code> から <code>chrome.storage.(local|sync)</code> に移行しています. これによって、旧版で設定していた内容を詳しく確認する方法を、一時的な目的のため設置しました.</h2>
      </div>
      <div className="mb-4">
        <div className="mb-2"><code className="is-size-5">Config</code></div>
        <pre className="is-size-7">{JSON.stringify(old.Config, null, 2)}</pre>
      </div>
      <div className="mb-4">
        <div className="mb-2"><code className="is-size-5">Mado</code></div>
        <pre className="is-size-7">{JSON.stringify(old.Mado, null, 2)}</pre>
      </div>
    </div>
  )
}

export function DebugPage() {
  return (
    <div>
      <div className="container pt-4">
        <h1 className="title">DEBUG</h1>
        <h2 className="subtitle is-size-7">不具合などの情報は開発者へ直接伝えていただけると、対応がスムーズなのと、開発の励みになります</h2>
      </div>
      <hr />
      <TemporarilyShowLocalStorage />
      <hr />
      <IssueReport />
      <div className="level mb-6">
        <div className="level-item has-text-grey">
          <span className="mx-4 is-clickable"
            onClick={() => window.open("https://github.com/otiai10")}
          ><i className="fa fa-github" /></span>
          <span className="mx-4 is-clickable"
            onClick={() => window.open("https://twitter.com/otiai10")}
          ><i className="fa fa-twitter" /></span>
          {/* <span className="mx-4 is-clickable">
            <i className="fa fa-envelope" />
          </span> */}
        </div>
      </div>
    </div>
  )
}