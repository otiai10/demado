
import Messages from "./controllers/Messages";
chrome.runtime.onMessage.addListener(Messages.listener());

