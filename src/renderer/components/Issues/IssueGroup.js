import React from 'react';
import Issue from './Issue';
import makeTree from './utils/makeTree';
import styles from './IssueGroup.css';

const IssueGroup = ({ group, activeIssueId }) => {

    const tree = makeTree(group.issues);
    const issues = tree.map(item => {
        const { issue, level } = item;
        return <Issue key={issue.id} level={level} isActive={issue.id === activeIssueId} { ...issue } />
    });

    return (
        <div className={styles.issueGroup}>
            <div className={styles.title}>
                {group.name}
            </div>
            <div>
                {issues}
            </div>
        </div>
    );
}

export default IssueGroup;
