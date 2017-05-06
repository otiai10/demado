import {Client} from 'chomex';
import Config   from '../../models/Config';
import Launcher from '../../services/mado/Launcher';
import Time     from '../../services/time';
import {safe} from '../../services/filename';

export function Capture() {
  return Launcher.sharedInstance().context().then(entry => {
    return new Promise(resolve => {
      chrome.tabs.captureVisibleTab(entry.tab.windowId, {format:'png'}, url => {
        resolve({entry, url});
      });
    });
  }).then(({entry, url}) => {
    // {{{ TODO: DRY
    return new Promise(resolve => {
      const filename = `${safe(entry.mado.name)}/${Time.new().xxx()}.png`;
      if (Config.find('use-prisc').value) {
        Client.for(chrome.runtime, 'gghkamaeinhfnhpempdbopannocnlbkg').message('/open/edit', {
          action: '/open/edit', path:'open/edit',
          params: {imgURI: url, filename}
        }).then(() => resolve({status:200}));
      } else {
        chrome.downloads.download({url, filename}, resolve);
      }
    });
    // }}}
  });
}

export function Mute() {
  return Launcher.sharedInstance().context().then(entry => {
    return new Promise(resolve => {
      chrome.tabs.get(entry.tab.id, tab => {
        const muted = !tab.mutedInfo.muted;
        chrome.tabs.update(tab.id, {muted}, tab => {
          Launcher.sharedInstance().update(tab);
          resolve({status:200,tab});
        });
      });
    });
  });
}
