import React, { useEffect, createRef } from 'react';
import isMac from '../../../common/isMac';
import styles from './SearchBar.css';

const SearchBar = (props) => {
    const { query, onQueryChange } = props;

    const handleQueryChange = (event) => {
        onQueryChange(event.target.value);
    }

    const handleClearClick = (event) => {
        onQueryChange('');
    };
    
    const inputRef = createRef();

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Clear search on Escape
            if (event.key === 'Escape') {
                inputRef.current.blur();
                onQueryChange('');
            }
            // Set focus on Cmd/Ctrl+F
            if (event.code === 'KeyF' && (isMac && event.metaKey || !isMac && event.ctrlKey)) {
                inputRef.current.focus();
            }
            // Auto search while typing
            if (event.key.length === 1 && query === '' && !event.metaKey && !event.ctrlKey) {
                inputRef.current.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onQueryChange, inputRef]);

    return (
        <div className={styles.searchBar}>
            <input
                type="text"
                className={styles.field}
                placeholder={`Начните вводить ID или название задачи (${isMac ? '⌘F' : 'Ctrl+F'})`}
                value={query}
                onChange={handleQueryChange}
                ref={inputRef}
            />
            <button
                className={styles.clearButton}
                onClick={handleClearClick}
                hidden={query === ''}
            >
                <i className="fas fa-times" />
            </button>
        </div>
    );
};

export default SearchBar;
