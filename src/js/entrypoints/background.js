import {Router} from 'chomex';

import * as Controllers from '../controllers/message-controllers';

let r = new Router();
r.on('/mado/configure',       Controllers.MadoConfigure);
r.on('/mado/should-decorate', Controllers.MadoShouldDecorate);

chrome.runtime.onMessage.addListener(r.listener());
