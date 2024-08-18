import type GlobalConfig from "../models/GlobalConfig";

(async () => {
  const { config }: { config: GlobalConfig } = await chrome.runtime.sendMessage({ _act_: "/global-config:get" });
  console.log(config);
  if (config.alertOnClose) {
    window.onbeforeunload = (ev: BeforeUnloadEvent) => {
      ev.stopPropagation();
      return true;
    };
  }
})();
