import React from 'react';
import IssueList from './IssueList';
import Login from './Login';

const App = (props) => {
  const { appState } = props

  return (
    <div>
      {
        appState.isAuthorized
        ? <IssueList { ...appState.state }/>
        : <Login />
      }
    </div>
  );
}

export default App;
