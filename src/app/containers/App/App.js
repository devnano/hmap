import React from 'react';
import Cockpit from '../Cockpit/Cockpit';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="" component={Cockpit}/>
      </Router>
    </div>
  );
}

export default App;

