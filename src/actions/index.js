const LETTERPRESS = "LETTERPRESS";
const INITIALIZE = "INITIALIZE";
const NEXT_WORD = "NEXT_WORD";
const SKIP_WORD = "SKIP_WORD";

export function initialize(wordSetId) {
  return { type: INITIALIZE, wordSetId };
}

export function letterPress(key, currentWord, userWord) {
  return { type: LETTERPRESS, key, currentWord, userWord };
}

export function nextWord(words, skipped = false) {
  return { type: NEXT_WORD, words, skipped };
}

export function skipWord(words) {
  return { type: SKIP_WORD, words };
}

export function announce(text) {
  return { type: "ANNOUNCE", text };
}
