import React from 'react';
import ipc from '../../ipc';
import formatTimeInterval from '../../../common/formatTimeInterval';
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
            Вы были неактивны {formatTimeInterval(idleTime)}.&nbsp;&nbsp;
            <button className={styles.subtractButton} onClick={handleSubtractClick}>
                Вычесть это время
            </button>
            <button className={styles.closeButton} onClick={handleCloseClick}>
                ×
            </button>
        </div>
    );
}

export default IdleBanner;
