import React, { Component } from "react";
import "./Letter.css";

class Letter extends Component {
  constructor() {
    super();
    this.saveRef = this.saveRef.bind(this);
  }
  saveRef(node) {
    this.node = node;
  }
  pulse() {
    console.log("pulsing", this.props.value, this.props.index);
    const PULSE = "pulse";
    this.node.classList.add(PULSE);
    setTimeout(() => this.node.classList.remove(PULSE), 250);
  }
  render() {
    const { value } = this.props;
    return (
      <div className="letter" ref={this.saveRef}>
        {value}
      </div>
    );
  }
}

export default Letter;
