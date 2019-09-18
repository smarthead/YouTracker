import { ipcRenderer } from 'electron';

const startTracking = (id) => () => {
    ipcRenderer.send('start-tracking', id);
};

const stopTracking = () => {
    ipcRenderer.send('stop-tracking');
};

const addWorkItem = (issueId, minutes) => () => {
    ipcRenderer.send('add-work-item', { issueId, minutes });
};

const acceptIdleTime = () => {
    ipcRenderer.send('accept-idle-time');
};

const subtractIdleTime = () => {
    ipcRenderer.send('subtract-idle-time');
};

const changeIssuesQuery = (query) => {
    ipcRenderer.send('change-issues-query', query);
}

export default {
    startTracking, stopTracking, addWorkItem,
    acceptIdleTime, subtractIdleTime,
    changeIssuesQuery
};
