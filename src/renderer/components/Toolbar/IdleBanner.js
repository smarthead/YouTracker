import React from 'react';
import styles from './IdleBanner.css';

const IdleBanner = ({ idleMinutes }) => {
    return (
        <div className={styles.idleBanner}>
            Вы отсутствовали {idleMinutes}m
        </div>
    );
}

export default IdleBanner;
