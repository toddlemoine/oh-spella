import React, { Component } from "react";
import Letter from "./Letter";
import "./Word.css";

class Word extends Component {
  constructor() {
    super();
    this.saveLetterRef = this.saveLetterRef.bind(this);
    this.letterInstances = [];
  }

  saveLetterRef(letterInstance) {
    this.letterInstances.push(letterInstance);
  }

  popLastLetter() {
    const { letters } = this.props;
    const pos = letters.length;
    try {
      const inst = this.letterInstances[pos];
      inst.pop();
    } catch (err) {
      console.error("pop error", err);
    }
  }

  render() {
    const { value = "", letters = "" } = this.props;

    return (
      <div className="word">
        {value
          .split("")
          .map((x, index) => (
            <Letter
              key={index}
              index={index}
              ref={this.saveLetterRef}
              value={letters[index] || null}
            />
          ))}
      </div>
    );
  }
}

export default Word;
