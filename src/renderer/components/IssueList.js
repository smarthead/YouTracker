import React, { useState } from 'react';
import IssueGroup from './IssueGroup';
import SearchBar from './SearchBar';

const IssueList = ({ issues, current }) => {
    const activeIssueId = current && current.isActive ? current.issue.id : null;
    
    const [query, setQuery] = useState('');

    const queryLowerCased = query.toLowerCase();
    const groups = group(
        issues.filter(issue => issueFilter(issue, queryLowerCased)),
        issue => ({ ...issue.project })
    );

    return (
        <div className="issueList">
            <div>
                {groups.map(group => (
                    <IssueGroup key={group.id} group={group} activeIssueId={activeIssueId}/>
                ))}
            </div>
            <SearchBar query={query} onQueryChange={setQuery}/>
        </div>
    );
}

const issueFilter = (issue, query) => {
    return issue.idReadable.toLowerCase().includes(query) ||
        issue.summary.toLowerCase().includes(query)
}

const group = (issues, grouper) => {
    let groups = new Map();
    for (const issue of issues) {
        const { id, name } = grouper(issue);
        let group = groups.has(id) ? groups.get(id) : { name: name, issues: [] };
        group.issues.push(issue);
        groups.set(id, group);
    }

    let groupArray = [];
    for (const key of groups.keys()) {
        groupArray.push({ id: key, ...groups.get(key) });
    }
    return groupArray;
};

export default IssueList;
