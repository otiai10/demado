import {MadoConfigureManager} from '../../services/mado';
import Mado from '../../models/Mado';
import Config from '../../models/Config';
import DashboardBounds from '../../models/DashboardBounds';
import Launcher from '../../services/mado/Launcher';

import Time from '../../services/time';

export function MadoDelete({_id}) {
  const mado = Mado.find(_id);
  if (!mado) return {status:404, message:`Not found mado config for id ${_id}`};
  mado.delete();
  return {status:200};
}

export function MadoEditConfig({mado}) {
  return MadoConfigureManager.sharedInstance(true).open(mado);
}
export function MadoEditConfigCommit({dict, mado:{_id}}) {
  let mado = Mado.find(_id);
  mado.update(dict);
  window.open('/html/configs.html');
  return {status:200,mado};
}
export function MadoConfigure({url}) {
  return MadoConfigureManager.sharedInstance(true).open({url});
}
export function MadoConfigureZoomUpdate({zoom}) {
  return new Promise(resolve => {
    chrome.tabs.setZoomSettings(this.sender.tab.id, {scope:'per-tab'}, () => {
      chrome.tabs.setZoom(this.sender.tab.id, parseFloat(zoom), () => {
        chrome.tabs.get(this.sender.tab.id, resolve);
      });
    });
  });
}

/**
 * すべてのChrome上のタブ作成は、これを修飾するか聞いてくるので、それに答える
 */
export function MadoShouldDecorate() {
  let configurer = MadoConfigureManager.sharedInstance();
  let target = configurer.has(this.sender.tab.id);
  if (target) {
    return new Promise(resolve => {
      if (!!target.mado && target.mado.zoom != 1) {
        chrome.tabs.setZoomSettings(this.sender.tab.id, {scope:'per-tab'}, () => {
          chrome.tabs.setZoom(this.sender.tab.id, parseFloat(target.mado.zoom), () => {
            resolve({status:200, zoom:target.mado.zoom, decorator:'configure', mado:target.mado});
          });
        });
      } else {
        chrome.tabs.getZoom(this.sender.tab.id, (zoom) => {
          resolve({status:200, zoom, decorator:'configure', mado:target.mado});
        });
      }
    });
  }
  let entry = Launcher.sharedInstance().has(this.sender.tab.id);
  if (entry) {
    return new Promise(resolve => {
      chrome.tabs.setZoomSettings(this.sender.tab.id, {scope:'per-tab'}, () => {
        chrome.tabs.setZoom(this.sender.tab.id, parseFloat(entry.mado.zoom), () => {
          const configs = {
            onbeforeunload: Config.find('ask-before-unload').value,
          };
          resolve({status:200, entry, decorator:'app', configs});
          setTimeout(() => entry.decorated = true, 100);// レスポンス送ったあとにフラグ立てる
        });
      });
    });
  }
  return true;
}

/**
 * とりあえずは設定ページに知らせるだけ
 */
export function MadoConfigureDraft(draft) {
  delete draft['action'];
  /**
   * FIXME: メッセージング使おうと思ったんだけど、設定ページのドメインがChrome拡張で、
   *        chromeネームスペースを共有しているから、chrome.runtime.onMessageを
   *        設定ページのrouterが上書きしてしまうっぽい。要調査。
   */
  // chrome.tabs.query({url: chrome.extension.getURL('/html/configs.html')}, tabs => {
  //   tabs.map(tab => Client.for(chrome.tabs, tab.id).message('/mado/draft', draft));
  // });

  // FIXME: しょうがないんでこうやります
  localStorage.setItem('draft', JSON.stringify(draft)); // うーんつらい

  return true;
}

/**
 * ゆくゆくはUpsertにしたいけど、とりあえずInsertする
 */
export function MadoConfigureUpsert(draft) {
  return new Promise(resolve => {
    const mado = Mado.create(draft);
    resolve(mado);
  });
}

/**
 * 窓を実際つくるやつ
 */
export function MadoLaunch({_id, winId}) {
  if (winId) return Launcher.sharedInstance().focus(winId);
  const mado = Mado.find(_id);
  return Launcher.sharedInstance().launch(mado);
}

/**
 * 外部Chrome拡張からのLaunchリクエスト
 */
export function ExternalMadoLaunch(req) {
  const mados = Mado.filter(mado => req.url.match(mado.url));
  if (mados.length == 0) return {status:404,message:'Not found in demado configs'};
  return Launcher.sharedInstance().launch({...mados[0], url: req.url});
}

/**
 * まどの最後の起動位置を記憶
 */
export function MadoPositionUpdate({x, y}) {
  const entry = Launcher.sharedInstance().has(this.sender.tab.id);
  if (!entry) return true;
  return entry.mado.update({position:{x, y}});
}

export function MadoEntries() {
  const entries = Launcher.sharedInstance().populate(Mado.list());
  return {status: 200, entries};
}

export function MadoScreenshot({mado, winId}) {
  // {{{ TODO: DRY
  return new Promise(resolve => {
    chrome.tabs.captureVisibleTab(winId,{format: 'png'}, url => {
      const filename = `${mado.name.replace('/','_','g')}/${Time.new().xxx()}.png`;
      if (Config.find('use-prisc').value) {
        chrome.runtime.sendMessage('gghkamaeinhfnhpempdbopannocnlbkg', {
          action: '/open/edit', path:'open/edit',
          params: {imgURI: url, filename}
        }, () => resolve({status:200}));
      } else {
        chrome.downloads.download({url, filename}, resolve);
      }
    });
  });
  // }}}
}

export function MadoToggleMute({tabId}) {
  return new Promise(resolve => {
    chrome.tabs.get(tabId, tab => {
      const muted = !tab.mutedInfo.muted;
      chrome.tabs.update(tab.id, {muted}, tab => {
        Launcher.sharedInstance().update(tab);
        resolve({status:200,tab});
      });
    });
  });
}

export function DashboardOpen() {
  const bounds = DashboardBounds.common();
  const height = 24 * 2 + Mado.list().length * 50;
  return new Promise(resolve => {
    chrome.windows.create({
      type:'popup',
      url: '/html/dashboard.html',
      height: (height < 170 ? 170 : height),
      width: bounds.size.width,
      left:  bounds.position.x,
      top:   bounds.position.y,
    }, resolve);
  });
}
export function DashboardTrack({position}) {
  DashboardBounds.common().update({position});
  return {status:200};
}
