import React, { useState, useEffect } from 'react';
import { shell } from 'electron';
import urls from '../../../common/urls';
import ipc from '../../ipc';
import { makeIssueContextMenu } from '../../menu/issueContextMenu';
import styles from './Toolbar.css';

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
    
    const handleContextMenu = (event) => {
        if (disabled) return;
        event.preventDefault();
        const menu = makeIssueContextMenu(id, idReadable, summary);
        menu.popup();
    };

    const handleDoubleClick = () => {
        if (isActive) {
            ipc.stopTracking();
        } else {
            ipc.startTracking(id)();
        }
    };

    const handleLinkClick = () => {
        shell.openExternal(urls.viewIssue(idReadable))
    };
    
    return (
        <div className={styles.toolbar} onContextMenu={handleContextMenu}>
            <div className={styles.left}>
                <button
                    className={styles.startStopButton}
                    disabled={disabled}
                    onClick={isActive ? ipc.stopTracking : ipc.startTracking(id)}
                >
                    {isActive ? <i className="fas fa-pause" /> : <i className="fas fa-play" />}
                </button>
                
                {
                    isActive
                    ? <div className={styles.timer}>
                        {time.hours}<span className={styles.colon}>:</span>{time.minutes}
                    </div>
                    : ''
                }
                
                {idReadable ? <button onClick={handleLinkClick}>{idReadable}</button> : ''}
                
                {
                    disabled
                    ? <div className={styles.emptySummary}>
                        Нет активной задачи
                    </div>
                    : <div className={styles.summary} title={summary} onDoubleClick={handleDoubleClick}>
                        {summary}
                    </div>
                }
            
            </div>
            
            <div className={styles.right}>
                <div className={styles.spentTime}>
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
