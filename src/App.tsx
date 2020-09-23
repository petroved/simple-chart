import React from 'react';
import { ReactComponent as Logo } from './logo.svg';
import './App.css';

export const App = (): JSX.Element => {
  return (
    <div className="App">
      <header className="App-header">
        <Logo style={{ width: '128px', height: '128px' }} />
        <p>
          <code>React ESLint Boilerplate</code>
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
};
