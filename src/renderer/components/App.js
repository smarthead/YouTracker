import React from 'react';
import IssueList from './IssueList';

const App = (props) => {
  const { appState } = props

  return (
    <div>
      <IssueList { ...appState }/>
    </div>
  );
}

export default App;
