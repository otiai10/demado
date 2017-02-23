/* global document:false */
import React from 'react';
import ReactDOM from 'react-dom';

// CSS
import 'bulma';

import ConfigsView from '../../components/container/configs';

ReactDOM.render(
  <ConfigsView />,
  document.querySelector('main#app')
);
