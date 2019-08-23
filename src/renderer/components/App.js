import React from 'react';
import IssueList from './Issues/IssueList';
import Login from './Login/Login';
import Toolbar from './Toolbar/Toolbar';

const App = (props) => {
    const { appState } = props;
    
    return (
        appState.isAuthorized
        ? <>
            <Toolbar { ...appState.state }/>
            <IssueList { ...appState.state } />
        </>
        : <Login />
    );
}

export default App;
