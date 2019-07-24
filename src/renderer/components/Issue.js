import React from 'react';
import ipc from '../ipc';
import { makeIssueContextMenu } from '../menu/issueContextMenu';

const Issue = (props) => {
  const {
    id, idReadable, summary, spentTime,
    isActive
  } = props;
  
  const onContextMenu = (event) => {
    event.preventDefault();
    const menu = makeIssueContextMenu(id, idReadable, summary);
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

export default Issue;
