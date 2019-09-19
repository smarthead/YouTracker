import React from 'react';
import IssueList from './Issues/IssueList';
import Login from './Login/Login';
import Toolbar from './Toolbar/Toolbar';

const App = ({ appState }) => {
    const { isInitialized, isAuthorized, state } = appState;
    
    if (!isInitialized) {
        return null;
    }
    
    return (
        isAuthorized
        ? <>
            <Toolbar { ...state }/>
            <IssueList { ...state } />
        </>
        : <Login />
    );
}

export default App;
