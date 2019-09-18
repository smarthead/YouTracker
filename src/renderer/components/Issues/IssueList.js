import React, { useState } from 'react';
import IssueGroup from './IssueGroup';
import SearchBar from '../SearchBar/SearchBar';
import styles from './IssueList.css';
import QueryBar from '../Query/QueryBar';

const IssueList = ({ query, issues, current }) => {
    const activeIssueId = current && current.isActive ? current.issue.id : null;
    
    const [search, setSearch] = useState('');

    const searchLowerCased = search.toLowerCase();
    const groups = group(
        issues.filter(issue => satisfies(issue, searchLowerCased)),
        issue => ({ ...issue.project })
    );

    return (
        <div className={styles.issueList}>
            <QueryBar query={query}/>
            <div>
                {groups.map(group => (
                    <IssueGroup key={group.id} group={group} activeIssueId={activeIssueId}/>
                ))}
            </div>
            <SearchBar search={search} onSearchChange={setSearch}/>
        </div>
    );
}

const satisfies = (issue, search) => {
    const idReadable = issue.idReadable.toLowerCase();
    const summary = issue.summary.toLowerCase();
    return idReadable.includes(search) || summary.includes(search);
}

const group = (issues, grouper) => {
    let groups = new Map();

    for (const issue of issues) {
        const { id, name } = grouper(issue);
        let group = groups.has(id) ? groups.get(id) : { name: name, issues: [] };
        group.issues.push(issue);
        groups.set(id, group);
    }

    return [...groups.keys()].map(key => (
        { id: key, ...groups.get(key) }
    ));
};

export default IssueList;
