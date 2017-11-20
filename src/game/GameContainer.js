import React from "react";
import { connect } from "react-redux";
import { initialize, letterPress } from "../actions";
import Game from "./Game";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    initialize: () => {
      dispatch(initialize(ownProps.wordSetId));
    },
    onKeyPress: (key, currentWord, userWord) => {
      dispatch(letterPress(key, currentWord, userWord));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
