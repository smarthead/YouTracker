import React, { useEffect, createRef } from 'react';
import isMac from '../../common/isMac';

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
                onQueryChange('');
            }
            // Set focus on Cmd/Ctrl+F
            if (event.code === 'KeyF' && (isMac && event.metaKey || !isMac && event.ctrlKey)) {
                inputRef.current.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onQueryChange, inputRef]);

    return (
        <div className="searchBar">
            <input
                type="text"
                className="searchBar__field"
                placeholder={`Поиск по ID или названию задачи (${isMac ? '⌘F' : 'Ctrl+F'})`}
                value={query}
                onChange={handleQueryChange}
                ref={inputRef}
            />
            <button
                className="searchBar__clear-button"
                onClick={handleClearClick}
                hidden={query === ''}
            >
                <i className="fas fa-times" />
            </button>
        </div>
    );
};

export default SearchBar;
