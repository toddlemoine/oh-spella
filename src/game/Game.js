import React, { Component } from "react";
import Word from "./Word";
import NextWordOverlay from "./NextWordOverlay";
import GameFinished from "./GameFinished";
import RepeatButton from "./RepeatButton";
import SkipButton from "./SkipButton";
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
      nextWord,
      finished
    } = this.props;

    if (!correct) {
      this.word.popLastLetter();
    }

    if (!finished && userWord === currentWord) {
      setTimeout(() => nextWord(words, { congratulate: true }), 1000);
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
      finished,
      stats
    } = this.props;

    if (finished) {
      return <GameFinished stats={stats} />;
    }

    return (
      <div className="game">
        <Word
          ref={inst => (this.word = inst)}
          lastLetterCorrect={lastLetterCorrect}
          value={currentWord}
          letters={userWord}
        />
        <RepeatButton onClick={this.handleRepeat} disabled={complete} />
        <SkipButton onClick={this.handleSkip} disabled={complete} />
      </div>
    );
  }
}

export default Game;
