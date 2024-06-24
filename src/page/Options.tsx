import { useLoaderData } from "react-router-dom";
import Mado from "../models/Mado";

export function OptionsPage() {
  const { mados } = useLoaderData() as { mados: Mado[] };
  return [
    <section className="section">
      <div className="container">
        <p className="title">demadoの設定</p>
        <p className="subtitle is-size-6">任意のウェブページを小窓化できます. 詳しくは<a className="link" href="https://github.com/otiai10/demado/wiki" target="_blank">ここ</a></p>
      </div>
    </section>,
    <section className="block">
      <div className="container">
        <div className="grid">
          {mados.map((mado, i) => (
            <div className="cell card demado-card" key={mado._id}
              style={{ borderColor: mado.colorcodeByIndex(i) }}
            >
              <div className={"card-header"}
                style={{ backgroundColor: mado.colorcodeByIndex(i) }}
              >
                <p className="card-header-title">
                  <span className="icon">
                    <i className="fas fa-home"></i>
                  </span>
                  <span>{mado.name || "_設定無し_"}</span>
                </p>
              </div>
              <div className="card-content">
                <div className="content">
                  <p style={{ wordBreak: 'break-all' }}>{mado.url}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>,
    <section className="block">
      <div className="container">
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <button className="button">新規追加</button>
            </div>
          </div>
          <div className="level-right">
            <div className="level-item">
              <button className="button">削除</button>
            </div>
          </div>
        </div>
      </div>
    </section>,
  ];
}