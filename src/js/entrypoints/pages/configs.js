/* global document:false */
import React from 'react';
import ReactDOM from 'react-dom';

// CSS
import 'bulma';
import 'font-awesome/css/font-awesome.css';

import ConfigsView from '../../container/configs';

const dump = Object.keys(localStorage)
.map(key => ({key, val: JSON.parse(localStorage.getItem(key))}))
.reduce((self, e) => { self[e.key] = e.val; return self;}, {});
document.querySelector('#emergency-dump').innerHTML = JSON.stringify(dump, null, 4);
document.querySelector('#emergency-reset').addEventListener('click', () => localStorage.clear() && window.reload());

ReactDOM.render(
  <ConfigsView />,
  document.querySelector('main#app')
);
