import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Files from './Files';

function App(props) {
  return(
    <Router>
      <div className="container">
        <div className="header">
            Neoclient
        </div>
        <Route component={Files} />
      </div>
    </Router>
  );
}

export default App;