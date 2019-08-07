import React, { useState } from 'react';
import IssueGroup from './IssueGroup';
import SearchBar from './SearchBar';

const IssueList = ({ issues, current }) => {
    const activeIssueId = current && current.isActive ? current.issue.id : null;
    
    const [query, setQuery] = useState('');

    const queryLowerCased = query.toLowerCase();
    const groups = group(
        issues.filter(issue => satisfies(issue, queryLowerCased)),
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

const satisfies = (issue, query) => {
    const idReadable = issue.idReadable.toLowerCase();
    const summary = issue.summary.toLowerCase();
    return idReadable.includes(query) || summary.includes(query);
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
