import React from 'react';
import { shell } from 'electron';
import urls from '../../../common/urls';
import ipc from '../../ipc';
import { makeContextMenu } from '../../menu/issueContextMenu';
import styles from './Issue.css';

const Issue = (props) => {
    const {
        id, idReadable, summary, spentTime,
        isActive, level
    } = props;
    
    const handleContextMenu = (event) => {
        event.preventDefault();
        const menu = makeContextMenu(id, idReadable, summary);
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
        <div className={styles.issue} onContextMenu={handleContextMenu}>
            <div className={styles.left}>
                {
                    isActive
                    ? <button className={styles.stopButton} onClick={ipc.stopTracking}>
                        <i className="fas fa-pause" />
                    </button>
                    : <button className={styles.startButton} onClick={ipc.startTracking(id)}>
                        <i className="fas fa-play" />
                    </button>
                }
                <button style={{marginLeft: `${level * 20}px`}} onClick={handleLinkClick}>
                    {idReadable}
                </button>
                <div className={styles.summary} title={summary} onDoubleClick={handleDoubleClick}>
                    {summary}
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.spentTime}>
                    {spentTime ? spentTime.presentation : ''}
                </div>
            </div>
        </div>
    );
};

export default Issue;
