import React, { useState, useEffect } from 'react';
import ipc from '../ipc';

const TIMER_UPDATE_INTERVAL = 5 * 1000; // 5 sec

const Toolbar = ({ current }) => {
  const {
    issue: {
      id = null,
      idReadable = null,
      summary = null,
      spentTime = null
    } = {},
    isActive = false,
    startTime = null,
    endTime = null
  } = current ? current : {};

  const disabled = !current;

  const [time, setTime] = useState(timeComponents(startTime, endTime));

  useEffect(() => {
    if (!isActive) return;
    
    setTime(timeComponents(startTime));

    const interval = setInterval(() => {
      setTime(timeComponents(startTime));
    }, TIMER_UPDATE_INTERVAL);

    return () => {
      clearInterval(interval);
    }
  }, [isActive, startTime]);

  return (
    <div className="toolbar">
      <div className="toolbar__left">
        <button
          className="toolbar__start-stop-button"
          disabled={disabled}
          onClick={isActive ? ipc.stopTracking : ipc.startTracking(id)}
        >
          {isActive ? <i className="fas fa-pause" /> : <i className="fas fa-play" />}
        </button>

        <div className={disabled ? 'toolbar__timer--disabled' : 'toolbar__timer'}>
          {time.hours}
          <span className={isActive ? 'colon--active' : 'colon'}>:</span>
          {time.minutes}
        </div>
        
        {idReadable ? <button onClick={ipc.openLink(idReadable)}>{idReadable}</button> : ''}

        {
          disabled
          ? <div className="toolbar__empty-summary">
              Нет активной задачи
            </div>
          : <div className="toolbar__summary" title={summary}>
              {summary}
            </div>
        }
        
      </div>

      <div className="toolbar__right">
        <div className="spent-time">
          {spentTime ? spentTime.presentation : ''}
        </div>
      </div>
    </div>
  );
}

const timeComponents = (start, end) => {
  if (!start) {
    return { hours: '0', minutes: '00'};
  }

  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();

  const seconds = Math.floor(
    (endDate.getTime() - startDate.getTime()) / 1000
  );
  let minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  minutes %= 60;

  return {
    hours: `${hours}`,
    minutes: `${minutes < 10 ? '0' + minutes : minutes}`
  }
}

export default Toolbar;
