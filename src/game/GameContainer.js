import React from "react";
import { connect } from "react-redux";
import { letterPress } from "../actions";
import Game from "./Game";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    onKeyPress: e => {
      dispatch(letterPress(e.key));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);
