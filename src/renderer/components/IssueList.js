import React, { useState } from 'react';
import IssueGroup from './IssueGroup';
import SearchBar from './SearchBar';

const IssueList = ({ issues, current }) => {
    const activeIssueId = current && current.isActive ? current.issue.id : null;
    
    const [query, setQuery] = useState('');

    const queryLowerCased = query.toLowerCase();
    const groups = group(
        issues.filter(issue => issueFilter(issue, queryLowerCased))
    );

    return (
        <div className="issueList">
            {groups.map(group => (
                <IssueGroup key={group.id} group={group} activeIssueId={activeIssueId}/>
            ))}
            <SearchBar query={query} onQueryChange={setQuery}/>
        </div>
    );
}

const issueFilter = (issue, query) => {
    return issue.idReadable.toLowerCase().includes(query) ||
        issue.summary.toLowerCase().includes(query)
}

const group = (issues) => {
    let groups = new Map();
    for (const issue of issues) {
        // TODO вынести функцию группировки, разделить на id и name
        const groupId = issue.idReadable.split('-')[0];
        let groupIssues = groups.has(groupId) ? groups.get(groupId) : [];
        groupIssues.push(issue);
        groups.set(groupId, groupIssues);
    }

    let groupArray = [];
    for (const key of groups.keys()) {
        groupArray.push({ id: key, title: key, issues: groups.get(key) });
    }
    return groupArray;
};

export default IssueList;
