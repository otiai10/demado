import { useLoaderData, useNavigate } from "react-router-dom";
import Mado from "../models/Mado";
import MadoLauncher from "../services/MadoLauncher";
import WindowService from "../services/WindowService";
import TabService from "../services/TabService";
import ScriptService from "../services/ScriptService";
import { ShortMadoCard } from "../components/popup-control";
import { useEffect } from "react";
import Dashboard from "../models/Dashboard";

export function DashboardPage() {
  const { mados } = useLoaderData() as { mados: Mado[] };
  const launcher = new MadoLauncher(new WindowService(), new TabService(), new ScriptService());
  const navigate = useNavigate();
  const refresh = () => navigate(0);

  useEffect(() => {
    const interval = setInterval(() => Dashboard.track(window), 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  return <div>
    <div className="p-2">
      {mados.map((mado, i) => <ShortMadoCard mado={mado} key={mado._id} index={i} refresh={refresh} launcher={launcher} inpopup={false} />)}
    </div>
  </div>;
}
