import React from 'react';
import styles from './ErrorBanner.css';

const ErrorBanner = ({ children }) => {
    return (
        <div className={styles.errorBanner}>
            {children}
        </div>
    );
};

export default ErrorBanner;
