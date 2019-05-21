import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const { ipcRenderer } = window.require('electron');

let appState = { issues: [], activeIssueId: null };

const render = () => {
  ReactDOM.render(<App appState={appState} />, document.getElementById('root'));
}

ipcRenderer.on('app-state-updated', (event, arg) => {
  appState = arg;
  render();
});

render();
