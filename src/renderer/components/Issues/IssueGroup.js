import React from 'react';
import Issue from './Issue';
import styles from './IssueGroup.css';

const IssueGroup = ({ group, activeIssueId }) => {
    return (
        <div className={styles.issueGroup}>
            <div className={styles.title}>
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
