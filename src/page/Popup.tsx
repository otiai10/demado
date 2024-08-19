import { useLoaderData, useNavigate } from "react-router-dom";
import Mado from "../models/Mado";
import MadoLauncher from "../services/MadoLauncher";
import WindowService from "../services/WindowService";
import TabService from "../services/TabService";
import ScriptService from "../services/ScriptService";
import { EmptyShortCard, OpenDashboardButton, ShortMadoCard } from "../components/popup-control";
import type GlobalConfig from "../models/GlobalConfig";

export function PopupPage() {
  const { mados, config } = useLoaderData() as { mados: Mado[], config: GlobalConfig };
  const launcher = new MadoLauncher(new WindowService(), new TabService(), new ScriptService());
  const navigate = useNavigate();
  const refresh = () => navigate(0);
  return <div>
    <div className="p-2">
      {mados.map((mado, i) => <ShortMadoCard mado={mado} key={mado._id} index={i} refresh={refresh} launcher={launcher} config={config} />)}
      <div className="demado-flex">
        <EmptyShortCard />
        {mados.length > 0 ? <OpenDashboardButton launcher={launcher} /> : null}
      </div>
    </div>
  </div>;
}
