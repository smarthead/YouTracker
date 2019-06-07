import React from 'react';
import { remote, clipboard } from 'electron';
import ipc from '../ipc';

const { Menu } = remote;

const Issue = (props) => {
  const {
    id, idReadable, summary, spentTime,
    isActive
  } = props;
  
  const onContextMenu = (event) => {
    event.preventDefault();
    const menu = makeContextMenu(id, idReadable, summary);
    menu.popup();
  };

  return (
    <div className="issue" onContextMenu={onContextMenu}>
      <div className="issue__left">
        {
          isActive
          ? <button className="issue__stop-button" onClick={ipc.stopTracking}>
              <i className="fas fa-pause" />
            </button>
          : <button className="issue__start-button" onClick={ipc.startTracking(id)}>
              <i className="fas fa-play" />
            </button>
        }
        <button onClick={ipc.openLink(idReadable)}>{idReadable}</button>
        <div className="issue__summary" title={summary}>{summary}</div>
      </div>
      <div className="issue__right">
        <div className="spent-time">
          {spentTime ? spentTime.presentation : ''}
        </div>
      </div>
    </div>
  );
};

const makeContextMenu = (id, idReadable, summary) => {
  const add = (minutes) => ipc.addWorkItem(id, minutes);

  return Menu.buildFromTemplate([
    {
      label: 'Копировать ID и название',
      click: () => clipboard.writeText(`${idReadable} ${summary}`)
    },
    {
      label: 'Открыть',
      click: ipc.openLink(idReadable)
    },
    { type: 'separator' },
    {
      label: 'Добавить время',
      submenu: [
        { label: '5m', click: add(5) },
        { label: '10m', click: add(10) },
        { label: '15m', click: add(15) },
        { label: '30m', click: add(30) },
        { label: '1h', click: add(60) },
        { label: '2h', click: add(120) }
      ]
    }
  ]);
};

export default Issue;
