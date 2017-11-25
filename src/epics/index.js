import { Observable } from "rxjs/Rx";
import storage from "../storage";
import { say as promiseSay } from "../speech";

function say(text, options) {
  return Observable.fromPromise(promiseSay(text, options));
}

function isValidKey(key) {
  return /\w/gi.test(key);
}

function loadWords(listParam) {
  const [namespace, listId] = listParam.split(":");
  return storage.getItem(namespace).then(lists => {
    return lists[listId];
  });
}

export function initialize(action$) {
  return action$
    .ofType("INITIALIZE")
    .pluck("wordSetId")
    .switchMap(id => Observable.fromPromise(loadWords(id)))
    .map(words => {
      const state = {
        currentWord: words.pop(),
        words
      };

      const wordStats = {
        word: state.currentWord,
        start: Date.now(),
        end: null,
        misses: 0,
        skipped: false
      };

      return { type: "INITIALIZE_COMPLETE", state, wordStats };
    })
    .do(({ state }) => say(`Let's begin. Spell ${state.currentWord}.`));
}

export function letterPress(action$) {
  return action$
    .ofType("LETTERPRESS")
    .filter(({ key }) => isValidKey(key))
    .do(({ key }) => say(key))
    .map(({ key, currentWord, userWord }) => {
      const wordStats = { misses: 0 };
      const attempt = userWord + key;
      const state = {
        attemptTimestamp: Date.now(),
        correct: currentWord.startsWith(attempt)
      };

      if (state.correct) {
        state.userWord = attempt;
      } else {
        wordStats.misses++;
      }

      if (attempt === currentWord) {
        state.complete = true;
        wordStats.end = Date.now();
      }
      return { type: "LETTERPRESS_COMPLETE", state, wordStats };
    });
}

export function nextWord(action$) {
  return action$.ofType("NEXT_WORD").map(({ words }) => {
    const state = {};
    const wordStats = {};

    if (words.length) {
      state.currentWord = words.pop();
      state.words = words;
      state.userWord = "";
      state.complete = false;
    } else {
      state.finished = true;
      wordStats.end = Date.now();
    }

    if (state.currentWord) {
      say(`Spell: ${state.currentWord}.`);
    }

    return { type: "NEXT_WORD_COMPLETE", state, wordStats };
  });
}

export function skipWord(action$) {
  return action$.ofType("SKIP_WORD").map(({ words }) => {
    const state = {};
    const wordStats = { skipped: true, end: Date.now() };

    if (words.length) {
      state.currentWord = words.pop();
      state.words = words;
      state.userWord = "";
      state.complete = false;
    } else {
      state.finished = true;
    }

    return { type: "SKIP_WORD_COMPLETE", state, wordStats };
  });
}

export function announce(action$) {
  return action$
    .ofType("ANNOUNCE")
    .switchMap(({ text }) => say(text))
    .mapTo({ type: "ANNOUNCE_COMPLETE" });
}

export function repeatWord(action$) {
  return action$
    .ofType("REPEAT_WORD")
    .switchMap(({ word }) => say(word, { rate: 0.6 }))
    .mapTo({ type: "REPEAT_WORD_COMPLETE" });
}
