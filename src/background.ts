import { Router } from "chromite";

const r = new Router<chrome.runtime.ExtensionMessageEvent>();

r.onNotFound(async (m, s) => {
  console.log("not found", m, s);
  return {};
});

chrome.runtime.onMessage.addListener(r.listener());
