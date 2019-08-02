import React from 'react';
import Issue from './Issue';

const IssueGroup = ({ group, activeIssueId }) => {
    return (
        <div>
            <div className="issueGroup__title">
                {group.title}
            </div>
            {group.issues.map(issue => (
                <Issue key={issue.id} isActive={issue.id === activeIssueId} { ...issue } />
            ))}
        </div>
    );
}

export default IssueGroup;
