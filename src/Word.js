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

  componentDidUpdate() {
    const { stats, letters } = this.props;
    const lastAttempt = stats.correctHistory[stats.correctHistory.length - 1];
    if (!stats.complete && lastAttempt === false) {
      const pos = letters.length;
      this.letterInstances[pos].pop();
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
