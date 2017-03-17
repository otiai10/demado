import {MadoConfigureManager} from '../../services/mado';
import Mado from '../../models/Mado';

export function MadoConfigure({url}) {
  return MadoConfigureManager.sharedInstance().open({url});
}
export function MadoConfigureZoomUpdate({zoom}) {
  return new Promise(resolve => {
    chrome.tabs.setZoom(this.sender.tab.id, parseFloat(zoom), () => {
      chrome.tabs.get(this.sender.tab.id, resolve);
    });
  });
}

/**
 * すべてのChrome上のタブ作成は、これを修飾するか聞いてくるので、それに答える
 */
export function MadoShouldDecorate() {
  let configurer = MadoConfigureManager.sharedInstance();
  if (configurer.hasTarget(this.sender.tab.id)) {
    return new Promise(resolve => {
      chrome.tabs.getZoom(this.sender.tab.id, (zoom) => {
        resolve({status:200, zoom, decorator:'configure'});
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
