
import Messages from "./controllers/Messages";
chrome.runtime.onMessage.addListener(Messages.listener());

import Commands from "./controllers/Commands";
chrome.commands.onCommand.addListener(Commands.listener());
