import { Observable } from "rxjs/Rx";
import storage from "../storage";
import { say as promiseSay } from "../speech";
import shuffle from "../util/shuffle";

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

function wordStats(attrs) {
  return {
    word: "",
    start: Date.now(),
    end: null,
    misses: 0,
    skipped: false,
    ...attrs
  };
}

export function initialize(action$) {
  return action$
    .ofType("INITIALIZE")
    .pluck("wordSetId")
    .switchMap(id => Observable.fromPromise(loadWords(id)))
    .map(shuffle)
    .map(words => {
      const state = {
        currentWord: words.pop(),
        words
      };

      return {
        type: "INITIALIZE_COMPLETE",
        state,
        wordStats: wordStats({
          word: state.currentWord
        })
      };
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
  return action$.ofType("NEXT_WORD").switchMap(({ words, congratulate }) => {
    const state = {};
    let _wordStats = {};
    const hasWords = words.length;

    if (hasWords) {
      state.currentWord = words.pop();
      state.words = words;
      state.userWord = "";
      state.complete = false;
      _wordStats = wordStats({ word: state.currentWord });
    } else {
      state.finished = true;
    }

    if (!hasWords) {
      return Observable.of({
        type: "NEXT_WORD_COMPLETE",
        state,
        wordStats: _wordStats
      });
    }

    const speech = [];

    if (congratulate) {
      speech.push(`Some nice spellin there.`);
    }

    if (state.currentWord) {
      speech.push(`Spell: ${state.currentWord}.`);
    }

    return say(speech.join(" "))
      .do(() => console.log("speech finished"))
      .mapTo({
        type: "NEXT_WORD_COMPLETE",
        state,
        wordStats: _wordStats
      });
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
  let rate = 1.0;
  return action$
    .ofType("REPEAT_WORD")
    .switchMap(({ word }) => say(word, { rate }))
    .do(() => (rate = rate === 1.0 ? 0.6 : 1.0))
    .mapTo({ type: "REPEAT_WORD_COMPLETE" });
}
