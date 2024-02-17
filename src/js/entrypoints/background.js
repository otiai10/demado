import {Router} from 'chomex';

import Launcher from '../services/mado/Launcher';
import * as Controllers from '../controllers/message-controllers';
import * as Commands    from '../controllers/command-controllers';

let router = new Router();
// このへんは設定いじるときしか使われない
router.on('/mado/configure',             Controllers.MadoConfigure);
router.on('/mado/configure/zoom:update', Controllers.MadoConfigureZoomUpdate);
router.on('/mado/configure:draft',       Controllers.MadoConfigureDraft);
router.on('/mado/configure:upsert',      Controllers.MadoConfigureUpsert);
router.on('/mado/edit-config',           Controllers.MadoEditConfig);
router.on('/mado/edit-config:commit',    Controllers.MadoEditConfigCommit);
router.on('/mado:delete',                Controllers.MadoDelete);
router.on('/mado:launch',                Controllers.MadoLaunch);
router.on('/mado:screenshot',            Controllers.MadoScreenshot);
router.on('/mado:toggle-mute',           Controllers.MadoToggleMute);
router.on('/mado:resize-by',             Controllers.MadoResizeBy);
router.on('/mado/position:update',       Controllers.MadoPositionUpdate);
router.on('/mado/entries',               Controllers.MadoEntries);
// これすごい大事
router.on('/mado/should-decorate',       Controllers.MadoShouldDecorate);

router.on('/dashboard:open', Controllers.DashboardOpen);
router.on('/dashboard:track',Controllers.DashboardTrack);

chrome.runtime.onMessage.addListener(router.listener());

// コマンドのやつ
let commands = new Router(name => {return {name};});
commands.on('capture', Commands.Capture);
commands.on('mute',    Commands.Mute);
chrome.commands.onCommand.addListener(commands.listener());

// 外部（というかponpetick）からのリクエスト
let ex = new Router();
ex.on('/mado/launch/external', Controllers.ExternalMadoLaunch);
chrome.runtime.onMessageExternal.addListener(ex.listener());

// とりあえずここでいいや
chrome.tabs.onRemoved.addListener(id => Launcher.sharedInstance().unlaunch(id));
chrome.windows.onRemoved.addListener(id => Launcher.sharedInstance().unlaunchAllInWindow(id));

const migrateLocalStorageToChromeStorage = (trigger) => {
  const obj = Object.keys(localStorage).reduce((ctx, namespace) => {
    ctx[namespace] = JSON.parse(localStorage[namespace]);
    return ctx;
  }, {});
  chrome.storage.local.set(obj).then(() => {
    console.log('Migrated localStorage to chrome.storage.local:', trigger, obj);
  });
};

// TODO: これはchomexで提供しなくていいのかな
let installed = new Router(({reason}) => {return {name:reason};});
installed.on('update', () => {
  const message = [
    'demadoがアップデートされました',
    `version ${chrome.runtime.getManifest().version}`,
    `Chrome拡張のプラットフォーム側の仕様変更により、設計の大きな変更を予定しています。`,
    '各窓とbackgroundの接続が一時的に切れるので、スクショやミュートが無効になります。必要があれば、窓を閉じて、右上から窓を作り直してください。',
    'こういうアラートを出さずに解決する方法を模索中です。',
  ].join('\n');
  window.alert(message);
  migrateLocalStorageToChromeStorage('on_update');
});
chrome.runtime.onInstalled.addListener(installed.listener());

migrateLocalStorageToChromeStorage('on_runtime');