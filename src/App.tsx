import React from 'react'
import { ReactComponent as Logo } from './logo.svg'
import './App.css'

export const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Logo style={{ width: '100%', height: '100%' }} />
        <p>
          <code>React ESLint Boilerplate</code>
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
  )
}
