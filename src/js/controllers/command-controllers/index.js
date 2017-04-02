import Config   from '../../models/Config';
import Launcher from '../../services/mado/Launcher';
import Time     from '../../services/time';

function current() {
  return Promise.resolve().then(() => {
    return new Promise((resolve, reject) => {
      chrome.tabs.getAllInWindow(null, tabs => {
        if (tabs.length == 0) return reject();
        resolve(tabs[0]);
      });
    });
  });
}

export function Capture() {
  return current().then(tab => {
    const entry = Launcher.sharedInstance().has(tab.id);
    return entry ? Promise.resolve(entry) : Promise.reject();
  }).then(entry => {
    return new Promise(resolve => {
      chrome.tabs.captureVisibleTab(entry.tab.windowId, {format:'png'}, url => {
        resolve({entry, url});
      });
    });
  }).then(({entry, url}) => {
    // {{{ TODO: DRY
    return new Promise(resolve => {
      const filename = `${entry.mado.name.replace('/','_','g')}/${Time.new().xxx()}.png`;
      if (Config.find('use-prisc').value) {
        chrome.runtime.sendMessage('gghkamaeinhfnhpempdbopannocnlbkg', {
          action: '/open/edit', path:'open/edit',
          params: {imgURI: url, filename}
        }, resolve);
      } else {
        chrome.downloads.download({url, filename}, resolve);
      }
    });
    // }}}
  });
}

export function Mute() {
  return current().then(tab => {
    const entry = Launcher.sharedInstance().has(tab.id);
    return entry ? Promise.resolve(entry) : Promise.reject();
  }).then(entry => {
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
