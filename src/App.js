import React from 'react';
import logo from './logo.svg';
import './App.css';

const process = window.require('process');

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello World!</h1>       
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Electron version: {process.versions.electron}.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
