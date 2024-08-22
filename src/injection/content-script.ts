import type GlobalConfig from "../models/GlobalConfig";
import { type MadoPortableObject } from "../models/Mado";

(async () => {

  // const LaunchMode = {
  //   DEFAULT: "default",
  //   PREVIEW: "preview",
  //   DYNAMIC: "dynamic",
  // };
  // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //   console.log("content-script received message", message, sender, sendResponse);
  // });

  const id = sessionStorage.getItem(`demado_${chrome.runtime.id}_id`);
  const mode = sessionStorage.getItem(`demado_${chrome.runtime.id}_mode`);
  const portablestr = sessionStorage.getItem(`demado_${chrome.runtime.id}_madojson`);
  let { mado }: { mado: MadoPortableObject } = await chrome.runtime.sendMessage(chrome.runtime.id, { _act_: "/mado:get", id });
  if (!mado) mado = JSON.parse(portablestr || "{}");
  console.log("(demado) %c[INFO]", "color:white;background-color:blue;", id, mado, mode);

  if (mado.offset) {
    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "relative";
    if (mado.offset.left) document.body.style.left = `${mado.offset.left}px`;
    if (mado.offset.top) document.body.style.top = `${mado.offset.top}px`;
  }
  if (mado.stylesheet) {
    const style = document.createElement("style");
    style.textContent = mado.stylesheet;
    document.head.appendChild(style);
  }
  if (mado.zoom !== 1) {
    await chrome.runtime.sendMessage(chrome.runtime.id, { _act_: "/mado/zoom:set", value: mado.zoom });
  }

  const interval = setInterval(() => {
    chrome.runtime.sendMessage(chrome.runtime.id, { _act_: "/mado/position:track", id, position: { x: window.screenX, y: window.screenY } });
  }, 1000);

  const { config }: { config: GlobalConfig } = await chrome.runtime.sendMessage({ _act_: "/global-config:get" });
  if (config.alertOnClose) {
    window.onbeforeunload = (ev: BeforeUnloadEvent) => {
      clearInterval(interval);
      ev.stopPropagation();
      return true;
    };
  }

})();
