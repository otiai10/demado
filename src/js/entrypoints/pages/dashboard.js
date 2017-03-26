/* global document:false */
import React from 'react';
import ReactDOM from 'react-dom';

// CSS
import 'bulma';
import 'font-awesome/css/font-awesome.css';

import DashboardView from '../../container/dashboard';

ReactDOM.render(
  <DashboardView />,
  document.querySelector('main#app')
);
