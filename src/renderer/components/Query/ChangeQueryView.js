import React, { useState } from 'react';
import styles from './ChangeQueryView.css';
import { ipcRenderer } from 'electron';
import ipc from '../../ipc';

const ChangeQueryView = ({ query, onComplete }) => {

    const [newQuery, setNewQuery] = useState(query);
    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState(false);

    const sendChange = () => {
        setError(false);
        setInProgress(true);

        ipcRenderer.once('change-issues-query-result', (event, success) => {
            setInProgress(false);
            if (success) {
                onComplete();
            } else {
                setError(true);
            }
        });

        ipc.changeIssuesQuery(newQuery);
    };

    const handleInputChange = (event) => {
        setNewQuery(event.target.value);
    };

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendChange();
        } else if (event.key === 'Escape') {
            event.stopPropagation();
            onComplete();
        }
    };

    const handleApplyClick = () => {
        sendChange();
    };

    const handleCancelClick = () => {
        onComplete();
    };

    return <>
        <div className={styles.content}>
            <input
                className={styles.field}
                type="text"
                placeholder="Все задачи"
                autoFocus={true}
                value={newQuery}
                disabled={inProgress}
                onChange={handleInputChange}
                onKeyDown= {handleInputKeyDown}
            />
            <button
                className={styles.button}
                disabled={inProgress}
                onClick={handleApplyClick}
            >
                Применить
            </button>
            <button
                className={styles.button}
                disabled={inProgress}
                onClick={handleCancelClick}
            >
                Отмена
            </button>
        </div>
        {error ? <ErrorBanner /> : ''}
    </>;
};

const ErrorBanner = () => {
    return (
        <div className={styles.error}>
            Некорректный поисковый запрос
        </div>
    );
};

export default ChangeQueryView;
