import React from 'react';
import { createRoot } from 'react-dom/client';
import { ipcRenderer } from 'electron';
import App from './components/App';

let appState = { isInitialized: false, isAuthorized: false, state: null };

const root = createRoot(document.getElementById('root'));

const render = () => {
    root.render(<App appState={appState} />);
}

ipcRenderer.on('app-state-updated', (event, arg) => {
    appState = arg;
    render();
});

render();
