import { useLoaderData } from "react-router-dom";
import Mado from "../models/Mado";

export function PopupPage() {
  const { mados } = useLoaderData() as { mados: Mado[] };
  return <div>
    <h1>Popup</h1>
    <ul>
      {mados.map((mado) => (
        <li key={mado._id}>
          <span>{mado._id}</span>
          <span>{mado.name || "_設定無し_"}</span>
          <span>{mado.url}</span>
        </li>
      ))}
    </ul>
  </div>;
}
