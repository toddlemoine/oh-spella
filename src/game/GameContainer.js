import React from "react";
import ReactDOM from "react-dom";
import Game from "./Game";
import { initialize } from "./gameState";

class GameContainer extends React.Component {
  constructor() {
    super();
    this.state = {};
    this.initialize = this.initialize.bind(this);
  }
  initialize() {
    const node = ReactDOM.findDOMNode(this);
    this.$stream = initialize(node, this.props.wordSetId);
    this.$stream.subscribe({
      next: state => this.setState(state),
      error: error => console.error(error)
    });
  }
  componentWillUnmount() {
    this.$stream.unsubscribe();
  }
  render() {
    return <Game ref={this.initialize} {...this.state} />;
  }
}

export default GameContainer;
