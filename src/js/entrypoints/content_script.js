import {Client} from 'chomex';

import Decorator from '../page-decorator';

(() => {
  const client = new Client(chrome.runtime);
  client.message('/mado/should-decorate').then(res => {
    Decorator.of(res.decorator, window).decorate();
  });
})();
