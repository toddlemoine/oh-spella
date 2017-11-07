import React, { Component } from "react";
import ReactDOM from "react-dom";
import CannedLists from "./CannedLists";
// import SavedLists from "./SavedLists";
import ListBuilder from "./ListBuilder";
import { initialize } from "./startState";

class StartScreen extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    // @TODO: Replace with ref
    const node = ReactDOM.findDOMNode(this);
    this.unsubscribe = initialize(node).subscribe(state =>
      this.setState(state)
    );
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const { cannedLists } = this.state;
    return (
      <div className="start-screen">
        <h1>Start</h1>
        <CannedLists items={cannedLists} />
        <ListBuilder />
      </div>
    );
  }
}

export default StartScreen;
