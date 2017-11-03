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
  pop() {
    const CSS_CLASS = "pop";
    this.node.classList.add(CSS_CLASS);
    setTimeout(() => this.node.classList.remove(CSS_CLASS), 250);
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
