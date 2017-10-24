import React from "react";
import ReactDOM from "react-dom";
import Word from "./Word";
import Rx from "rxjs/Rx";
import { say } from "./letters/speech";

const initialState = {
  wordList: "big list web".split(" "),
  doneWords: [],
  currentWord: "",
  userWord: "",
  wrongLetter: false
};

function validGuess(guess, word) {
  return word.startsWith(guess);
}

function getAnotherWord(words, blacklist) {
  let word;

  do {
    word = words.pop();
  } while (blacklist.includes(word));

  console.log("word is ", word);
  return word;
}

class Home extends React.Component {
  constructor() {
    super();
    this.state = { ...initialState, currentWord: initialState.wordList[0] };
  }
  componentDidMount() {
    this.listen(ReactDOM.findDOMNode(this));
  }
  componentWillUnmount() {
    this.unlisten();
  }
  listen(node) {
    console.log("listening");
    const $keypress = Rx.Observable
      .fromEvent(window, "keypress")
      .mergeMap(e => say(e.key))
      .map(text => this.handleKeyPress(text))
      .subscribe();
    const $clicks = Rx.Observable
      .fromEvent(node, "click")
      .filter(e => /button/gi.test(e.target.nodeName))
      .map(e => {
        const { id } = e.target;
        if (id === "repeat") {
          return say(this.state.currentWord);
        }
        if (id === "new-word") {
          return this.newWord();
        }
      })
      .subscribe();
    this.$stream = Rx.Observable.merge($keypress, $clicks);
  }
  unlisten() {
    console.log("stop listening");
    this.$stream.unsubscribe();
  }
  newWord() {
    console.log("new word");
    const { state } = this;
    const doneWords = state.doneWords.concat(state.currentWord);
    this.setState({
      doneWords,
      currentWord: getAnotherWord(state.wordList, doneWords),
      userWord: ""
    });
  }
  handleKeyPress(text) {
    console.log("pressed", text);
    const { currentWord, userWord } = this.state;
    const attemptedUserWord = userWord + text;
    if (validGuess(attemptedUserWord, currentWord)) {
      this.setState({ userWord: attemptedUserWord, wrongLetter: false });
    } else {
      this.setState({ wrongLetter: true });
    }
  }
  render() {
    const state = this.state;
    return (
      <div>
        <button id="repeat">Say Word</button>
        <button id="new-word">New Word</button>
        <Word value={state.userWord} />
        (Current word is {state.currentWord})
      </div>
    );
  }
}

export default Home;
