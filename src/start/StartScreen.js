import React, { Component } from "react";
import ReactDOM from "react-dom";
import CannedLists from "./CannedLists";
// import SavedLists from "./SavedLists";
import ListBuilder from "./ListBuilder";
import { initialize } from "./startState";

class StartScreen extends Component {
  render() {
    const { cannedLists, savedLists, onSave } = this.props;
    return (
      <div className="start-screen">
        <h1>Start</h1>
        <CannedLists items={cannedLists} />
        <ListBuilder onSave={onSave} />
      </div>
    );
  }
}

class StartScreenContainer extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    this.unsubscribe = initialize(node).subscribe(state =>
      this.setState(state)
    );
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    return <StartScreen {...this.state} />;
  }
}

export default StartScreenContainer;
