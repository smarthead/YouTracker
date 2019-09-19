import React from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer } from 'electron';
import App from './components/App';

let appState = { isInitialized: false, isAuthorized: false, state: null };

const render = () => {
    ReactDOM.render(<App appState={appState} />, document.getElementById('root'));
}

ipcRenderer.on('app-state-updated', (event, arg) => {
    appState = arg;
    render();
});

render();
