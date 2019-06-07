import React from 'react';
import Issue from './Issue';

const IssueList = ({ issues, current }) => {
  
  const activeIssueId = current && current.isActive ? current.issue.id : null;
  
  return (
    <div className="issueList">
      {issues.map(issue =>
        <Issue key={issue.id} isActive={issue.id === activeIssueId} { ...issue } />
      )}
    </div>
  );
}

export default IssueList;
