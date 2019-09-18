import React, { useState } from 'react';
import styles from './QueryBar.css';
import ChangeQueryView from './ChangeQueryView';
import ipc from '../../ipc';

const QueryBar = ({ query }) => {

    const [isEditing, setIsEditing] = useState(false);

    const handleChangeClick = () => {
        setIsEditing(true);
    };

    const handleChangeRequest = (newQuery) => {
        ipc.changeIssuesQuery(newQuery);
        setIsEditing(false);
    };

    const handleChangeCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className={styles.queryBar}>
            {
                isEditing
                ? <ChangeQueryView query={query.value} onChangeRequest={handleChangeRequest} onCancel={handleChangeCancel} />
                : <>
                    {query.value}
                    &nbsp;&nbsp;
                    <button className={styles.button} onClick={handleChangeClick}>Изменить</button>
                </>
            }
        </div>
    );
};

export default QueryBar;
