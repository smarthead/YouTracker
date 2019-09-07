import React from 'react';
import ipc from '../../ipc';
import styles from './IdleBanner.css';

const IdleBanner = ({ idleMinutes }) => {
    
    const handleSubtractClick = () => {
        ipc.subtractIdleTime();
    };

    const handleCloseClick = () => {
        ipc.acceptIdleTime();
    };

    return (
        <div className={styles.idleBanner}>
            Вы были неактивны {formatMinutes(idleMinutes)}.&nbsp;&nbsp;
            <button className={styles.subtractButton} onClick={handleSubtractClick}>
                Вычесть это время
            </button>
            <button className={styles.closeButton} onClick={handleCloseClick}>
                ×
            </button>
        </div>
    );
}

const formatMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
        return `${hours} ч ${minutes} мин`;
    } else if (hours > 0) {
        return `${hours} ч`;
    } else {
        return `${minutes} мин`;
    }
};

export default IdleBanner;
