import React from 'react';
import Issue from './Issue';

const IssueGroup = ({ group, activeIssueId }) => {
    return (
        <div className="issueGroup">
            <div className="issueGroup__title">
                {group.name}
            </div>
            <div>
                {group.issues.map(issue => (
                    <Issue key={issue.id} isActive={issue.id === activeIssueId} { ...issue } />
                ))}
            </div>
        </div>
    );
}

export default IssueGroup;
