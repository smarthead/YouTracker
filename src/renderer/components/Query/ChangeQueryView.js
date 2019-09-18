import React, { useState } from 'react';
import styles from './ChangeQueryView.css';

const ChangeQueryView = ({ query, onChangeRequest, onCancel }) => {

    const [newQuery, setNewQuery] = useState(query);

    const handleInputChange = (event) => {
        setNewQuery(event.target.value);
    }

    const handleInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            onChangeRequest(newQuery);
        } else if (event.key === 'Escape') {
            onCancel();
        }
    }

    const handleApplyClick = () => {
        onChangeRequest(newQuery);
    };

    const handleCancelClick = () => {
        onCancel();
    };

    return (
        <div className={styles.changeQueryView}>
            <input
                className={styles.field}
                type="text"
                placeholder="Все issue"
                autoFocus={true}
                value={newQuery}
                onChange={handleInputChange}
                onKeyDown= {handleInputKeyDown}
            />
            <button
                className={styles.button}
                onClick={handleApplyClick}
            >
                Применить
            </button>

            <button
                className={styles.button}
                onClick={handleCancelClick}
            >
                Отмена
            </button>
        </div>
    );
};

export default ChangeQueryView;
