import type GlobalConfig from "../models/GlobalConfig";
import { type MadoPortableObject } from "../models/Mado";

(() => {
  let id: string | null;
  let mode: string | null;
  let mado: MadoPortableObject;

  chrome.runtime.onMessage.addListener(async (msg) => {
    switch (msg._act_) {
    case "/injected:__init__": {
      id = msg.id; mado = msg.mado; mode = msg.mode;
      const ext = chrome.runtime.id;
      sessionStorage.setItem(`demado_${ext}_id`, id as string);
      sessionStorage.setItem(`demado_${ext}_madojson`, JSON.stringify(mado));
      if (mode) {
        sessionStorage.setItem(`demado_${ext}_mode`, mode as string);
      }
      return await __init__();
    }
    }
  });


  const __init__ = async () => {

    if (!mado) {
      const res: { mado: MadoPortableObject } = await chrome.runtime.sendMessage(chrome.runtime.id, { _act_: "/mado:get", id });
      mado = res.mado;
    }

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
  }

})();
