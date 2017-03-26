import {Router} from 'chomex';

import Launcher from '../services/mado/Launcher';
import * as Controllers from '../controllers/message-controllers';

let router = new Router();
// このへんは設定いじるときしか使われない
router.on('/mado/configure',             Controllers.MadoConfigure);
router.on('/mado/configure/zoom:update', Controllers.MadoConfigureZoomUpdate);
router.on('/mado/configure:draft',       Controllers.MadoConfigureDraft);
router.on('/mado/configure:upsert',      Controllers.MadoConfigureUpsert);
router.on('/mado:delete',                Controllers.MadoDelete);
router.on('/mado:launch',                Controllers.MadoLaunch);
router.on('/mado:screenshot',            Controllers.MadoScreenshot);
router.on('/mado:toggle-mute',           Controllers.MadoToggleMute);
router.on('/mado/position:update',       Controllers.MadoPositionUpdate);
router.on('/mado/entries',               Controllers.MadoEntries);
// これすごい大事
router.on('/mado/should-decorate',       Controllers.MadoShouldDecorate);

chrome.runtime.onMessage.addListener(router.listener());

// 外部（というかponpetick）からのリクエスト
let ex = new Router();
ex.on('/mado/launch/external', Controllers.ExternalMadoLaunch);
chrome.runtime.onMessageExternal.addListener(ex.listener());

// とりあえずここでいいや
chrome.tabs.onRemoved.addListener(id => Launcher.sharedInstance().unlaunch(id));
