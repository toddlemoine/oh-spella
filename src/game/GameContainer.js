import React from "react";
import { connect } from "react-redux";
import { initialize, letterPress, nextWord, skipWord } from "../actions";
import Game from "./Game";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
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
