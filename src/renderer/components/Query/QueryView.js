import React from 'react';
import styles from './QueryView.css';

const QueryView = ({ query, onChangeRequest }) => {
    return (
        <div className={styles.queryView}>
            {query !== '' ? query : 'Все задачи'}
            &nbsp;&nbsp;
            <button className={styles.button} onClick={onChangeRequest}>
                Изменить
            </button>
        </div>
    );
}

export default QueryView;
