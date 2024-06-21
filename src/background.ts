import { Router } from "chromite";

const r = new Router<chrome.runtime.ExtensionMessageEvent>();

r.onNotFound(async (m, s, r) => {
  console.log("not found", m, s, r);
  return {};
});

chrome.runtime.onMessage.addListener(r.listener());
