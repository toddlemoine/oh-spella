const INITIALIZE_COMPLETE = "INITIALIZE_COMPLETE";
const LETTERPRESS_COMPLETE = "LETTERPRESS_COMPLETE";
const NEXT_WORD_COMPLETE = "NEXT_WORD_COMPLETE";

const initialState = {
  words: [],
  currentWord: "",
  userWord: "",
  complete: false,
  stats: []
};

export default function(state = initialState, action) {
  console.log("action", action.type, action);
  switch (action.type) {
    case INITIALIZE_COMPLETE:
      return { ...state, words: action.words, currentWord: action.currentWord };

    case NEXT_WORD_COMPLETE:
    case LETTERPRESS_COMPLETE:
      return { ...state, ...action._state };

    default:
      return state;
  }
}
