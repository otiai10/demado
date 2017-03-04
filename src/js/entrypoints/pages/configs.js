/* global document:false */
import React from 'react';
import ReactDOM from 'react-dom';

// CSS
import 'bulma';

import ConfigsView from '../../container/configs';

ReactDOM.render(
  <ConfigsView />,
  document.querySelector('main#app')
);
