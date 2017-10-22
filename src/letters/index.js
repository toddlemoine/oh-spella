import { speak } from "./speech";

const LETTERPRESS = "LETTERPRESS";

// Actions
export const letterPress = letter => {
  return {
    type: "LETTERPRESS",
    letter
  };
};

// Epics
export const letterPressEpic = action$ =>
  action$
    .ofType("LETTERPRESS")
    .mergeMap($action => speak($action.letter))
    .map($action => ({ type: "LETTERPRESS_COMPLETE", letter: $action.letter }));

// Reducer
export default function lettersReducer(state, action) {
  switch (action.type) {
    case LETTERPRESS:
      return { ...state, letter: action.letter };
    case LETTERPRESS_COMPLETE:
      return { ...state, word: state.word + action.letter };
  }
}
