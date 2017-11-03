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
    const classes = ["letter"];
    if (value) {
      classes.push("complete");
    }
    return (
      <div className={classes.join(" ")} ref={this.saveRef}>
        {value}
      </div>
    );
  }
}

export default Letter;
