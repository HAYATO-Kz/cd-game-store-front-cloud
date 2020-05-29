import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Store from "./Store";

const App = () => {
  return (
    <Router>
      <Route exact path="/" component={Home} />
      <Route path="/store" component={Store} />
    </Router>
  );
};

export default App;
