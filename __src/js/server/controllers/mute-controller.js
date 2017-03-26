"use strict";

class MuteController {
  static ToggleMuted(req, sender, sendResponse) {
    Launcher.blank().getCurrentWindow().then((win) => {
      Launcher.toggleMute(win.tabs[0].id);
    });
  }
}
