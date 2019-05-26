import React from 'react';
//import logo from './logo.svg';
import './App.css';

import { LinkCheckerContainer } from 'containers'
import styles from './App.scss'

function App() {
  return (
    <div className={styles.appContainer}>
      <LinkCheckerContainer />
    </div>
  )
}

export default App;
