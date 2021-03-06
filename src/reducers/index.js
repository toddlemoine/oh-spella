const INITIALIZE_COMPLETE = "INITIALIZE_COMPLETE";
const LETTERPRESS_COMPLETE = "LETTERPRESS_COMPLETE";
const NEXT_WORD_COMPLETE = "NEXT_WORD_COMPLETE";
const SKIP_WORD_COMPLETE = "SKIP_WORD_COMPLETE";

const initialState = {
  words: [],
  currentWord: "",
  userWord: "",
  complete: false,
  stats: [],
  wordStats: {},
  correct: []
};

function updateStats(state, newWordStats) {
  const { wordStats } = state;

  if (newWordStats.misses) {
    wordStats.misses += newWordStats.misses;
  }
  wordStats.end = newWordStats.end;
  state.wordStats = wordStats;

  if (wordStats.end) {
    state.stats.push(wordStats);
  }

  return state;
}

export default function(state = initialState, action) {
  console.log("action", action.type, action);
  switch (action.type) {
    case INITIALIZE_COMPLETE:
      return { ...state, ...action.state, wordStats: action.wordStats };
    case NEXT_WORD_COMPLETE:
    case LETTERPRESS_COMPLETE:
    case SKIP_WORD_COMPLETE:
      const _state = { ...state, ...action.state };
      return updateStats(_state, action.wordStats);

    default:
      return state;
  }
}
