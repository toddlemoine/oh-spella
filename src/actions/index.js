const LETTERPRESS = "LETTERPRESS";
const INITIALIZE = "INITIALIZE";
const NEXT_WORD = "NEXT_WORD";
const SKIP_WORD = "SKIP_WORD";
const REPEAT_WORD = "REPEAT_WORD";
const ANNOUNCE = "ANNOUNCE";

export function initialize(wordSetId) {
  return { type: INITIALIZE, wordSetId };
}

export function letterPress(key, currentWord, userWord) {
  return { type: LETTERPRESS, key, currentWord, userWord };
}

export function nextWord(words, options = { congratulate: false }) {
  return { type: NEXT_WORD, words, ...options };
}

export function skipWord(words) {
  return { type: SKIP_WORD, words };
}

export function announce(text) {
  return { type: ANNOUNCE, text };
}

export function repeatWord(word) {
  return { type: REPEAT_WORD, word };
}
