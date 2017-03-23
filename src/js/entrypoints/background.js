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
// これすごい大事
router.on('/mado/should-decorate',       Controllers.MadoShouldDecorate);

chrome.runtime.onMessage.addListener(router.listener());

// とりあえずここでいいや
chrome.tabs.onRemoved.addListener(id => Launcher.sharedInstance().unlaunch(id));
