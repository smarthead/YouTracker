import React from 'react';
import Issue from './Issue';
import './IssueList.css';

const IssueList = (props) => {
  const { issues, activeIssueId } = props;
  
  return (
    <div className="IssueList">
      {issues.map((issue) => <Issue key={issue.id} isActive={issue.id === activeIssueId} { ...issue } />)}
    </div>
  );
}

export default IssueList;
