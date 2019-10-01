import React, { useState } from 'react';
import IssueGroup from './IssueGroup';
import SearchBar from '../SearchBar/SearchBar';
import QueryBar from '../Query/QueryBar';
import satisfies from './utils/satisfies';
import group from './utils/group';
import styles from './IssueList.css';

const IssueList = ({ query, issues, current }) => {
    const activeIssueId = current && current.isActive ? current.issue.id : null;
    
    const [search, setSearch] = useState('');

    const normalizedSearch = search.toLowerCase().trim();
    const groups = group(
        issues.filter(issue => satisfies(issue, normalizedSearch)),
        issue => ({ ...issue.project })
    );

    return (
        <div className={styles.issueList}>
            <QueryBar query={query} count={issues.length} />
            <div>
                {groups.map(group => (
                    <IssueGroup key={group.id} group={group} activeIssueId={activeIssueId} />
                ))}
            </div>
            <SearchBar search={search} onSearchChange={setSearch} />
        </div>
    );
}

export default IssueList;
