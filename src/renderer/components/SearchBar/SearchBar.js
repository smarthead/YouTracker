import React, { useEffect, createRef } from 'react';
import isMac from '../../../common/isMac';
import styles from './SearchBar.css';

const SearchBar = (props) => {
    const { search, onSearchChange } = props;

    const handleSearchChange = (event) => {
        onSearchChange(event.target.value);
    }

    const handleClearClick = () => {
        onSearchChange('');
    };
    
    const inputRef = createRef();

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Clear search on Escape
            if (event.key === 'Escape') {
                inputRef.current.blur();
                onSearchChange('');
            }
            // Set focus on Cmd/Ctrl+F
            if (event.code === 'KeyF' && (isMac && event.metaKey || !isMac && event.ctrlKey)) {
                inputRef.current.focus();
            }
            // Auto search while typing
            if (event.key.length === 1 && search === '' && !event.metaKey && !event.ctrlKey && activeElementTag() !== 'input') {
                inputRef.current.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onSearchChange, inputRef]);

    return (
        <div className={styles.searchBar}>
            <input
                type="text"
                className={styles.field}
                placeholder={`Начните вводить ID или название задачи (${isMac ? '⌘F' : 'Ctrl+F'})`}
                value={search}
                onChange={handleSearchChange}
                ref={inputRef}
            />
            <button
                className={styles.clearButton}
                onClick={handleClearClick}
                hidden={search === ''}
            >
                ×
            </button>
        </div>
    );
};

const activeElementTag = () => {
    return document.activeElement.tagName.toLowerCase();
}

export default SearchBar;
