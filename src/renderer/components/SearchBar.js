import React, { useEffect } from 'react';

const SearchBar = (props) => {
    const { query, onQueryChange } = props;

    const handleQueryChange = (event) => {
        onQueryChange(event.target.value);
    }

    const handleClearClick = (event) => {
        onQueryChange('');
    };
    
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onQueryChange('');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onQueryChange]);

    return (
        <div className="searchBar">
            <input
                type="text"
                className="searchBar__field"
                placeholder="Поиск по ID или названию задачи"
                value={query}
                onChange={handleQueryChange}
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
