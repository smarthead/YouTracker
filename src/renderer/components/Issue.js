import React from 'react';
import { ipcRenderer, remote } from 'electron';

const { Menu } = remote;

const Issue = (props) => {
  const {
    id, idReadable, summary, spentTime,
    isActive
  } = props;

  const openLink = () => {
    ipcRenderer.send('view-issue', idReadable);
  };

  const startTracking = () => {
    ipcRenderer.send('start-tracking', id);
  };

  const stopTracking = () => {
    ipcRenderer.send('stop-tracking');
  };

  const add = () => {
    const menu = contextMenuForAdd(id);
    menu.popup();
  };
  
  return (
    <div className="issue">
      <div className="issue__left">
        {
          isActive
          ? <button className="issue__stop-button" onClick={stopTracking}>
              <i className="fas fa-stop" />
            </button>
          : <button className="issue__start-button" onClick={startTracking}>
              <i className="fas fa-play" />
            </button>
        }
        <button onClick={openLink}>{idReadable}</button>
        <div className="issue__summary" title={summary}>{summary}</div>
      </div>
      <div className="issue__right">
        <div className="issue__time">
          {spentTime !== null ? spentTime.presentation : ''}
        </div>
        <button className="issue__add-button" onClick={add}>
          <i className="fas fa-plus" />
        </button>
      </div>
    </div>
  );
};

const contextMenuForAdd = (issueId) => {
  const add = (minutes) => {
    ipcRenderer.send('add-work-item', { issueId, minutes });
  };

  return Menu.buildFromTemplate([
    { label: '5m', click: () => add(5) },
    { label: '10m', click: () => add(10) },
    { label: '15m', click: () => add(15) },
    { label: '30m', click: () => add(30) },
    { label: '1h', click: () => add(60) },
    { label: '2h', click: () => add(120) }
  ]);
};

export default Issue;
