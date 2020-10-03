import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import HomePage from './pages/HomePage/Index';
import AddContent from './pages/AddContent/Index'

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path = '/'>
            <HomePage />
          </Route>
          <Route path = '/add'>
            <AddContent />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
