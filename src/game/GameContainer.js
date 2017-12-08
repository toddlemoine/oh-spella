import React from "react";
import { connect } from "react-redux";
import {
  announce,
  initialize,
  letterPress,
  nextWord,
  skipWord,
  repeatWord
} from "../actions";
import Game from "./Game";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    announce: word => {
      dispatch(announce(word));
    },
    initialize: () => {
      dispatch(initialize(ownProps.wordSetId));
    },
    nextWord: (words, options) => {
      dispatch(nextWord(words, options));
    },
    onKeyPress: (key, currentWord, userWord) => {
      dispatch(letterPress(key, currentWord, userWord));
    },
    onSkip: words => {
      dispatch(skipWord(words));
    },
    repeatWord: word => {
      dispatch(repeatWord(word));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
