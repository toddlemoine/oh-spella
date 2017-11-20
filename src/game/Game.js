import React, { Component } from "react";
import Word from "./Word";
import NextWordOverlay from "./NextWordOverlay";
import StatsOverlay from "./StatsOverlay";
import "./Game.css";

class Game extends Component {
  constructor() {
    super();
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  componentDidMount() {
    document.addEventListener("keypress", this.handleKeyPress);
    this.props.initialize();
  }
  componentWillUnmount() {
    document.removeEventListener("keypress", this.handleKeyPress);
  }
  handleKeyPress(e) {
    const { currentWord, userWord } = this.props;
    this.props.onKeyPress(e.key, currentWord, userWord);
  }
  render() {
    const {
      userWord = "",
      currentWord = "",
      complete,
      stats = [],
      wordList = [],
      finished
    } = this.props;

    const currentStats = stats[stats.length - 1];

    return (
      <div className="game">
        {complete && <NextWordOverlay show={true} />}
        {finished && <StatsOverlay stats={stats} />}
        <Word stats={currentStats} value={currentWord} letters={userWord} />
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
