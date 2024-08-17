import { useLoaderData, useNavigate } from "react-router-dom";
import Mado from "../models/Mado";
import MadoLauncher from "../services/MadoLauncher";
import WindowService from "../services/WindowService";
import TabService from "../services/TabService";
import ScriptService from "../services/ScriptService";
import { ShortMadoCard } from "../components/popup-control";
import { useCallback, useEffect, useMemo } from "react";
import Dashboard from "../models/Dashboard";

export function DashboardPage() {
  const { mados } = useLoaderData() as { mados: Mado[] };
  const launcher = useMemo(() => new MadoLauncher(new WindowService(), new TabService(), new ScriptService()), []);
  const navigate = useNavigate();

  const autorefresh = useCallback(async <Info extends chrome.tabs.TabChangeInfo | chrome.tabs.TabRemoveInfo>(tabId: number, info: Info) => {
    if ("isWindowClosing" in info && info.isWindowClosing) return navigate(0);
    const mado = await launcher.lookup(tabId);
    if (!mado || !mado.$existance) return;
    if ("mutedInfo" in info) return navigate(0);
  }, [launcher, navigate]);

  useEffect(() => {
    const interval = setInterval(() => Dashboard.track(window), 10 * 1000);
    // ダッシュボードのcontextでListenerを登録するのは気持ち悪いが、
    // backgroundからダッシュボードへの通知ができないため、仕方なくここで登録する
    chrome.tabs.onRemoved.addListener(autorefresh);
    chrome.tabs.onUpdated.addListener(autorefresh);
    return () => {
      clearInterval(interval);
      chrome.tabs.onRemoved.removeListener(autorefresh);
      chrome.tabs.onUpdated.removeListener(autorefresh);
    };
  }, [autorefresh]);

  return <div>
    <div className="p-2">
      {mados.map((mado, i) => <ShortMadoCard mado={mado} key={mado._id} index={i} refresh={() => navigate(0)} launcher={launcher} inpopup={false} />)}
    </div>
  </div>;
}
