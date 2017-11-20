const LETTERPRESS = "LETTERPRESS";
const INITIALIZE = "INITIALIZE";
const NEXT_WORD = "NEXT_WORD";

export function initialize(wordSetId) {
  return { type: INITIALIZE, wordSetId };
}

export function letterPress(key, currentWord, userWord) {
  return { type: LETTERPRESS, key, currentWord, userWord };
}

export function nextWord(words) {
  return { type: NEXT_WORD, words };
}
