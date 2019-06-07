import React from 'react';
import IssueList from './IssueList';
import Login from './Login';
import Toolbar from './Toolbar';

const App = (props) => {
  const { appState } = props;

  return (
    <div>
      {
        appState.isAuthorized
        ? <div>
            <Toolbar { ...appState.state }/>
            <IssueList { ...appState.state } />
          </div>
        : <Login />
      }
    </div>
  );
}

export default App;
