import React from 'react';
import { shell } from 'electron';
import urls from '../../common/urls';
import ipc from '../ipc';
import { makeIssueContextMenu } from '../menu/issueContextMenu';

const Issue = (props) => {
    const {
        id, idReadable, summary, spentTime,
        isActive
    } = props;
    
    const handleContextMenu = (event) => {
        event.preventDefault();
        const menu = makeIssueContextMenu(id, idReadable, summary);
        menu.popup();
    };

    const handleLinkClick = () => {
        shell.openExternal(urls.viewIssue(idReadable))
    };
    
    return (
        <div className="issue" onContextMenu={handleContextMenu}>
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
                <button onClick={handleLinkClick}>{idReadable}</button>
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
