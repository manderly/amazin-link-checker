import React from 'react';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

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
