import { speak } from "./speech";
import { isCorrectWord } from "./validator";

// Action constants
const LETTERPRESS = "LETTERPRESS";
const WRONG_LETTER = "WRONG_LETTER";
const VALIDATE_LETTER = "VALIDATE_LETTER";
const SPEECH_COMPLETE = "SPEECH_COMPLETE";
const WORD_SPELLED_CORRECTLY = "WORD_SPELLED_CORRECTLY";
const INCORRECT_LETTER = "INCORRECT_LETTER";

// Initial State
const initialState = {
  // wordList: ["big", "grip", "list"],
  word: "big",
  userWord: "",
  userHistory: []
};

// Reducer
const lettersReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

// Actions
export const letterPress = letter => {
  return {
    type: LETTERPRESS,
    letter
  };
};

export const wordSpelledCorrectly = word => {
  return {
    type: WORD_SPELLED_CORRECTLY,
    word
  };
};
// Thunk Action
export const validate = (letter, userWord, word) => {
  return dispatch => {
    if (isCorrectWord(attemptedWord, word)) {
      dispatch(wordSpelledCorrectly(word));
    } else {
      dispatch(incorrectLetter(letter));
    }
  };
};

// Epics
export const lettersEpic = (action$, store) =>
  action$
    .ofType(LETTERPRESS)
    .mergeMap($action => speak($action.letter))
    .map(text => ({ type: SPEECH_COMPLETE, text }));

export const wordSpelledCorrectlyEpic = action$ => {
  const speech = `${word}. Correct!`;
  action$
    .ofType(WORD_SPELLED_CORRECTLY)
    .mergeMap($action => speak(speech))
    .map(text => ({ type: SPEECH_COMPLETE, text }));
};
export default lettersReducer;
