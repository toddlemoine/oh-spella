import React from "react";
import { connect } from "react-redux";
import {
  announce,
  initialize,
  letterPress,
  nextWord,
  skipWord
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
    nextWord: words => {
      dispatch(nextWord(words));
    },
    onKeyPress: (key, currentWord, userWord) => {
      dispatch(letterPress(key, currentWord, userWord));
    },
    onSkip: words => {
      dispatch(skipWord(words));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
