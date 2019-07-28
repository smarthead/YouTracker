import React from 'react';

const SearchBar = (props) => {
    const { query, onQueryChange } = props;

    const handleQueryChange = (event) => {
        onQueryChange(event.target.value);
    }

    return (
        <div className="searchBar">
            <input
                type="text"
                className="searchBar__field"
                placeholder="Поиск по ID или названию задачи"
                value={query}
                onChange={handleQueryChange}
            />
        </div>
    );
};

export default SearchBar;
