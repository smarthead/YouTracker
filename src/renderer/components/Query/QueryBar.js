import React, { useState } from 'react';
import styles from './QueryBar.css';
import QueryView from './QueryView';
import ChangeQueryView from './ChangeQueryView';

const QueryBar = ({ query, count }) => {

    const [isEditing, setIsEditing] = useState(false);

    const handleChangeRequest = () => {
        setIsEditing(true);
    };

    const handleChangeComplete = () => {
        setIsEditing(false);
    };

    return (
        <div className={styles.queryBar}>
            {isEditing
            ? <ChangeQueryView query={query} onComplete={handleChangeComplete} />
            : <QueryView query={query} count={count} onChangeRequest={handleChangeRequest} />}
        </div>
    );
};

export default QueryBar;
