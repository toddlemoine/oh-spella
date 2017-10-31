import React from "react";
import ReactDOM from "react-dom";
import Game from "./Game";
import { initialize } from "./gameState";

class GameContainer extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    this.$stream = initialize(node);
    this.$stream.subscribe(
      state => this.setState(state),
      error => console.error(error)
    );
  }
  componentWillUnmount() {
    this.$stream.unsubscribe();
  }
  render() {
    return <Game {...this.state} />;
  }
}

export default GameContainer;
