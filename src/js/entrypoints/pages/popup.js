/* global document:false */
import React from 'react';
import ReactDOM from 'react-dom';

// CSS
import 'bulma';
import 'font-awesome/css/font-awesome.css';

import PopupView from '../../container/popup';

ReactDOM.render(
  <PopupView />,
  document.querySelector('main#app')
);
