import { useLoaderData } from "react-router-dom";
import { IssueReport } from "../components/info/IssueReport";
import Mado, { PortableJSONObject } from "../models/Mado";
import { useState } from "react";
import TabService from "../services/TabService";

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

function ImportView() {
  const [obj, setObj] = useState<PortableJSONObject | null>(null);
  return (
    <div className="container demado-import-view mb-8">
      <div className="mb-4">
        <h1 className="title is-size-4">#窓設定のインポート</h1>
        <h2 className="subtitle is-size-7">エクスポートしたJSONファイルを指定して、設定をインポートすることができます. この操作は、現在の設定を上書きしません. 設定値が同じでも、新規に別設定を追加します.</h2>
      </div>
      <div className="level mb-0">
        <div className="file">
          <label className="file-label">
            <input className="file-input" type="file" name="resume" onChange={ev => {
              const files = ev.target.files;
              if (!files || !files.length) return setObj(null);
              try {
                const r = new FileReader();
                r.onload = (ev) => {
                  const content = ev.target?.result as string;
                  setObj(JSON.parse(content));
                };
                r.readAsText(files[0]);
              } catch (e) { setObj(null); }
            }} />
            <span className="file-cta">
              <span className="file-icon">
                <i className="fa fa-arrow-circle-up"></i>
              </span>
              <span className="file-label"> エクスポートされたファイルを選択 </span>
            </span>
          </label>
        </div>
      </div>
      {(obj && obj.mados.length) ? <div className="demado-export-obj-preview-container mb-8 mt-2">
        <pre className="is-size-7">{JSON.stringify(obj, null, 2)}</pre>
        <div className="demado-export-action-container">
          <div>
            <div className="button is-primary" title="この設定を窓としてインポートする" onClick={async () => {
              const mados = obj.mados.map(madolike => Mado.new(madolike));
              for (let i = 0; i < mados.length; i++) {
                await mados[i].save();
              }
              window.alert(`インポートが完了しました. ${mados.filter(m => m._id).length}件の設定が追加されました`);
              await new TabService().options.reopen();
              window.close();
            }}>
              <i className="fa fa-folder-open" />
              <span className="ml-2"> 窓設定として取り込む</span>
            </div>
            <div className="is-size-7 has-text-right">{obj.mados.length}件の設定が追加されます</div>
          </div>
        </div>
      </div> : null}
    </div>
  )
}

function ExportView({ exports }: { exports: Mado[] }) {
  const obj: PortableJSONObject = {
    version: chrome.runtime.getManifest().version,
    timestamp: Date.now(),
    mados: exports.map(mado => mado.export()),
  };
  return (
    <div className="container demado-export-view mb-8">
      <div className="mb-4">
        <h1 className="title is-size-4">#窓設定のエクスポート</h1>
        <h2 className="subtitle is-size-7">インポート時に利用可能な.jsonファイルをダウンロードできます. このファイルをインポートで指定すれば、まったく同じ設定を複製ないし移植することができます.</h2>
      </div>
      <div className="demado-export-obj-preview-container mb-4">
        <pre className="is-size-7">{JSON.stringify(obj, null, 2)}</pre>
        <div className="demado-export-action-container">
          <div className="button is-primary" title="この設定をJSONファイルとしてダウンロードする" onClick={async () => {
            const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const filename =  `demado/export-${obj.timestamp}.JSON`;
            await chrome.downloads.download({ url, filename, saveAs: true });
            URL.revokeObjectURL(url);
          }}>
            <i className="fa fa-arrow-circle-down" />
            <span className="ml-2"> ダウンロードする</span>
          </div>
          <div className="is-size-7 has-text-right">{obj.mados.length}件の設定が対象になっています</div>
        </div>
      </div>
    </div>
  )
}

export function DebugPage() {
  const { exports } = useLoaderData() as { exports: Mado[] };
  return (
    <div>
      <div className="container pt-4">
        <h1 className="title">DEBUG</h1>
        <h2 className="subtitle is-size-7">不具合などの情報は開発者へ直接伝えていただけると、対応がスムーズなのと、開発の励みになります</h2>
      </div>
      <hr />
      <ImportView />
      {exports.length ? [
        <hr />,
        <ExportView exports={exports} />
      ]: null}
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