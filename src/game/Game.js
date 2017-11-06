import React, { Component } from "react";
import Word from "./Word";
import NextWordOverlay from "./NextWordOverlay";
import "./Game.css";

class Game extends Component {
  render() {
    const {
      userWord = "",
      currentWord = "",
      complete,
      stats = [],
      wordList = []
    } = this.props;

    const classes = ["game"];
    const currentStats = stats[stats.length - 1];

    return (
      <div className={classes.join(" ")}>
        <NextWordOverlay show={complete} />
        <Word stats={currentStats} value={currentWord} letters={userWord} />
        (Current word is {currentWord})
        <button id="repeat" disabled={complete}>
          Say Word
        </button>
        <button id="skip" disabled={complete}>
          Skip
        </button>
      </div>
    );
  }
}

export default Game;
