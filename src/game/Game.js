import React, { Component } from "react";
import Word from "./Word";
import NextWordOverlay from "./NextWordOverlay";
import StatsOverlay from "./StatsOverlay";
import "./Game.css";

class Game extends Component {
  constructor() {
    super();
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
  }
  componentDidMount() {
    document.addEventListener("keypress", this.handleKeyPress);
    this.props.initialize();
  }
  componentWillUnmount() {
    document.removeEventListener("keypress", this.handleKeyPress);
  }
  componentDidUpdate() {
    const {
      announce,
      userWord,
      currentWord,
      words,
      correct,
      nextWord
    } = this.props;
    if (!correct) {
      this.word.popLastLetter();
    }
    if (userWord === currentWord) {
      nextWord(words);
    }
  }
  componentWillUpdate(nextProps) {
    const { announce, currentWord } = this.props;
    // if (!nextProps.finished && nextProps.currentWord !== currentWord) {
    //   announce(`Spell: ${nextProps.currentWord}`);
    // }
  }
  handleKeyPress(e) {
    const { currentWord, userWord } = this.props;
    this.props.onKeyPress(e.key, currentWord, userWord);
  }
  handleSkip() {
    this.props.onSkip(this.props.words);
  }
  render() {
    const {
      userWord = "",
      currentWord = "",
      complete,
      stats = [],
      words = [],
      lastLetterCorrect,
      finished
    } = this.props;

    const currentStats = stats[stats.length - 1];

    return (
      <div className="game">
        {finished && <StatsOverlay stats={stats} />}
        <Word
          ref={inst => (this.word = inst)}
          lastLetterCorrect={lastLetterCorrect}
          value={currentWord}
          letters={userWord}
        />
        <button id="repeat" disabled={complete}>
          Say Word
        </button>
        <button onClick={this.handleSkip} disabled={complete}>
          Skip
        </button>
      </div>
    );
  }
}

export default Game;
