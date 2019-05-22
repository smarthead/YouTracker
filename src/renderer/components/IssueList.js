import React from 'react';
import Issue from './Issue';

const IssueList = (props) => {
  const { issues, activeIssueId } = props;
  
  return (
    <div className="issueList">
      {issues.map((issue) => <Issue key={issue.id} isActive={issue.id === activeIssueId} { ...issue } />)}
    </div>
  );
}

export default IssueList;
