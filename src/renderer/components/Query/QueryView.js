import React from 'react';
import { makeContextMenu } from '../../menu/queryContextMenu';
import styles from './QueryView.css';

const QueryView = ({ query, count, onChangeRequest }) => {
    
    const handleContextMenu = (event) => {
        event.preventDefault();
        const menu = makeContextMenu(query);
        menu.popup();
    };

    return (
        <div className={styles.queryView} onContextMenu={handleContextMenu}>
            {query !== '' ? query : 'Все задачи'}
            &nbsp;
            ({count})
            &nbsp;
            <button className={styles.button} onClick={onChangeRequest}>
                Изменить
            </button>
        </div>
    );
}

export default QueryView;
