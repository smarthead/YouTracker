import React from 'react';
import IssueList from './components/IssueList';
import './App.css';

const App = (props) => {
  const { appState } = props

  return (
    <div className="App">
      <IssueList { ...appState }/>
    </div>
  );
}

export default App;
