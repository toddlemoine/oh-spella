import React, { Component } from "react";
import Word from "./Word";
import NextWordOverlay from "./NextWordOverlay";
import GameFinished from "./GameFinished";
import "./Game.css";

class Game extends Component {
  constructor() {
    super();
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
    this.handleRepeat = this.handleRepeat.bind(this);
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
  handleKeyPress(e) {
    const { currentWord, userWord } = this.props;
    this.props.onKeyPress(e.key, currentWord, userWord);
  }
  handleSkip() {
    this.props.onSkip(this.props.words);
  }
  handleRepeat() {
    this.props.repeatWord(this.props.currentWord);
  }
  render() {
    const {
      userWord = "",
      currentWord = "",
      complete,
      words = [],
      lastLetterCorrect,
      finished
    } = this.props;

    if (finished) {
      return <GameFinished />;
    }

    return (
      <div className="game">
        <Word
          ref={inst => (this.word = inst)}
          lastLetterCorrect={lastLetterCorrect}
          value={currentWord}
          letters={userWord}
        />
        <button id="repeat" onClick={this.handleRepeat} disabled={complete}>
          Repeat word
        </button>
        <button onClick={this.handleSkip} disabled={complete}>
          Skip
        </button>
      </div>
    );
  }
}

export default Game;
