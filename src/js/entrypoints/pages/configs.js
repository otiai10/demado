/* global document:false */
import React from 'react';
import ReactDOM from 'react-dom';

// CSS
import 'bulma';
import 'font-awesome/css/font-awesome.css';

import ConfigsView from '../../container/configs';

ReactDOM.render(
  <ConfigsView />,
  document.querySelector('main#app')
);
