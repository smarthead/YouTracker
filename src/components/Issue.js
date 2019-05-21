import React from 'react';
import './Issue.css';

const { ipcRenderer } = window.require('electron');

const Issue = (props) => {
  const { id, idReadable, summary, isActive } = props;

  const openLink = () => {
    ipcRenderer.send('view-issue', idReadable);
  };

  const toggleTracking = () => {
    if (isActive) {
      ipcRenderer.send('stop-tracking');
    } else {
      ipcRenderer.send('start-tracking', id);
    }
  };
  
  return (
    <div className="Issue">
      <button onClick={openLink}>{idReadable}</button> {summary} <button onClick={toggleTracking}>{isActive ? 'Stop' : 'Start'}</button>
    </div>
  );
};

export default Issue;
