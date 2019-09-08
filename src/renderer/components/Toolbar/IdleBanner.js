import React from 'react';
import ipc from '../../ipc';
import styles from './IdleBanner.css';

const IdleBanner = ({ idleTime }) => {
    
    const handleSubtractClick = () => {
        ipc.subtractIdleTime();
    };

    const handleCloseClick = () => {
        ipc.acceptIdleTime();
    };

    return (
        <div className={styles.idleBanner}>
            Вы были неактивны {formatIdleTime(idleTime)}.&nbsp;&nbsp;
            <button className={styles.subtractButton} onClick={handleSubtractClick}>
                Вычесть это время
            </button>
            <button className={styles.closeButton} onClick={handleCloseClick}>
                ×
            </button>
        </div>
    );
}

const formatIdleTime = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    minutes %= 60;

    if (hours > 0 && minutes > 0) {
        return `${hours} ч ${minutes} мин`;
    } else if (hours > 0) {
        return `${hours} ч`;
    } else {
        return `${minutes} мин`;
    }
};

export default IdleBanner;
