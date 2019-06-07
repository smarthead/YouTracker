import { ipcRenderer } from 'electron';

const openLink = (idReadable) => () => {
  ipcRenderer.send('view-issue', idReadable);
};

const startTracking = (id) => () => {
  ipcRenderer.send('start-tracking', id);
};

const stopTracking = () => {
  ipcRenderer.send('stop-tracking');
};

const addWorkItem = (issueId, minutes) => () => {
  ipcRenderer.send('add-work-item', { issueId, minutes });
};

export default { openLink, startTracking, stopTracking, addWorkItem };
