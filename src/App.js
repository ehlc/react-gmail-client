import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppContainer from "./AppContainer";

import "./App.css";

class App extends Component {
  
  

  render() {
    return (
      <Router>
        <AppContainer />
      </Router>
    );
  }
}

export default App;
