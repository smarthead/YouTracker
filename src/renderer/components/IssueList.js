import React, { useState } from 'react';
import Issue from './Issue';
import SearchBar from './SearchBar';

const IssueList = ({ issues, current }) => {
    
    const activeIssueId = current && current.isActive ? current.issue.id : null;
    
    const [query, setQuery] = useState('');

    const queryLowerCased = query.toLowerCase();

    return (
        <div className="issueList">
            {
                issues
                    .filter(issue => 
                        issue.idReadable.toLowerCase().includes(queryLowerCased) ||
                        issue.summary.toLowerCase().includes(queryLowerCased)
                    )
                    .map(issue =>
                        <Issue key={issue.id} isActive={issue.id === activeIssueId} { ...issue } />
                    )
            }
            <SearchBar query={query} onQueryChange={setQuery}/>
        </div>
    );
}

export default IssueList;
